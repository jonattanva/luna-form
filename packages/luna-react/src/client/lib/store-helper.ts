import { atom, type PrimitiveAtom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { deepEqual } from 'fast-equals'

type RecordValue<T> = T extends Record<string, infer V> ? V : never

interface NestedAtomFamilyOptions<TInner> {
  merge?: (values: TInner[]) => TInner | undefined
  validateTarget?: (target: string) => boolean
}

function createRecordAtomFamily<
  TRecord extends Record<string, unknown>,
  TValue = RecordValue<TRecord>,
>(baseAtom: PrimitiveAtom<TRecord>) {
  return atomFamily((name: string) =>
    atom(
      (get) => {
        return (get(baseAtom)[name] as TValue | undefined) ?? undefined
      },
      (get, set, newValue: TValue | undefined) => {
        const current = get(baseAtom)

        if (newValue !== undefined && newValue !== null) {
          const currentValue = current[name]
          if (!currentValue || !deepEqual(currentValue, newValue)) {
            set(baseAtom, { ...current, [name]: newValue })
          }
        } else if (current[name]) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [name]: _unused, ...rest } = current
          set(baseAtom, rest as TRecord)
        }
      }
    )
  )
}

function createClearAllAtom<T>(baseAtom: PrimitiveAtom<Record<string, T>>) {
  return atom(null, (get, set) => {
    const current = get(baseAtom)
    if (current && Object.keys(current).length > 0) {
      set(baseAtom, {})
    }
  })
}

function createClearAtom<T>(baseAtom: PrimitiveAtom<Record<string, T>>) {
  return atom(null, (get, set, names: string[]) => {
    const current = get(baseAtom)
    const next = { ...current }
    let hasChanges = false

    for (const name of names) {
      if (next[name]) {
        delete next[name]
        hasChanges = true
      }
    }

    if (hasChanges) {
      set(baseAtom, next)
    }
  })
}

function createBulkReportAtom<T>(baseAtom: PrimitiveAtom<Record<string, T>>) {
  return atom(null, (get, set, newValue: Record<string, T>) => {
    const current = get(baseAtom)

    if (!deepEqual(current, newValue)) {
      set(baseAtom, newValue)
    }
  })
}

export function createNestedRecordAtomFamily<
  TInner,
  TRecord extends Record<string, Record<string, TInner>> = Record<
    string,
    Record<string, TInner>
  >,
>(
  baseAtom: PrimitiveAtom<TRecord>,
  options: NestedAtomFamilyOptions<TInner> = {}
) {
  const { merge, validateTarget } = options

  return atomFamily((contributorName: string) =>
    atom(
      (get) => {
        const current = get(baseAtom)[contributorName]
        if (current && merge) {
          return merge(Object.values(current))
        }
        return undefined
      },
      (get, set, target: string, value: TInner | undefined) => {
        if (validateTarget && !validateTarget(target)) {
          return
        }

        const current = get(baseAtom)
        const targetContributions = { ...(current[target] ?? {}) }

        if (value !== undefined && value !== null) {
          const currentContribution = targetContributions[contributorName]
          if (!currentContribution || !deepEqual(currentContribution, value)) {
            targetContributions[contributorName] = value as TInner
            set(baseAtom, {
              ...current,
              [target]: targetContributions,
            } as TRecord)
          }
        } else if (targetContributions[contributorName]) {
          delete targetContributions[contributorName]

          if (Object.keys(targetContributions).length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [target]: _unused, ...rest } = current
            set(baseAtom, rest as TRecord)
          } else {
            set(baseAtom, {
              ...current,
              [target]: targetContributions,
            } as TRecord)
          }
        }
      }
    )
  )
}

export function createNestedClearAtom<TInner>(
  baseAtom: PrimitiveAtom<Record<string, Record<string, TInner>>>
) {
  return atom(null, (get, set, contributorNames: string[]) => {
    const current = get(baseAtom)
    const next = { ...current }
    let hasChanges = false

    for (const name of contributorNames) {
      if (next[name]) {
        delete next[name]
        hasChanges = true
      }
    }

    for (const target in next) {
      const targetContributions = { ...next[target] }
      let targetChanged = false

      for (const contributorName of contributorNames) {
        if (targetContributions[contributorName]) {
          delete targetContributions[contributorName]
          targetChanged = true
          hasChanges = true
        }
      }

      if (targetChanged) {
        if (Object.keys(targetContributions).length === 0) {
          delete next[target]
        } else {
          next[target] = targetContributions
        }
      }
    }

    if (hasChanges) {
      set(baseAtom, next)
    }
  })
}

export function createAtomStore<T>(initialValue: Record<string, T> = {}) {
  const baseAtom = atom<Record<string, T>>(initialValue)

  return {
    atom: baseAtom,
    clearAll: createClearAllAtom(baseAtom),
    clear: createClearAtom(baseAtom),
    bulkReport: createBulkReportAtom(baseAtom),
    report: createRecordAtomFamily(baseAtom),
  }
}
