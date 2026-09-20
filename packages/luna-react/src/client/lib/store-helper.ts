import { atom, type PrimitiveAtom } from 'jotai'
import { deepEqual } from 'fast-equals'

export function omitKey<T extends Record<string, unknown>>(
  obj: T,
  key: string
): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _removed, ...rest } = obj
  return rest as T
}

// One entry of the record, as an atom of its own.
//
// Made by whoever reads it, in `useEntryAtom`, rather than cached by name for
// the life of the page: a family did that, never let go on its own, and had to
// be emptied by hand from `useStore`. It holds no state -- it reads and writes
// `base[name]` -- so two readers of one name are two views of one record and
// they agree, exactly as two callers of the family did.
export function createEntryAtom<T>(
  base: PrimitiveAtom<Record<string, T>>,
  name: string
) {
  return atom(
    (get) => (get(base)[name] as T | undefined) ?? undefined,
    (get, set, next: T | undefined) => {
      const current = get(base)

      if (next !== undefined && next !== null) {
        if (!deepEqual(current[name], next)) {
          set(base, { ...current, [name]: next })
        }
      } else if (name in current) {
        set(base, omitKey(current, name))
      }
    }
  )
}

// The same, for a record every field writes into about *other* fields: what
// this one is owed, merged, and a write addressed to whoever it is for.
//
// A `source` change event is the case. Several fields can point at the same
// target, so a target's entry is keyed by whoever contributed it and what the
// target reads is the merge of them all. Reading and writing go by different
// names, which is why this is not `createEntryAtom` over a nested record.
export function createContributionAtom<T>(
  base: PrimitiveAtom<Record<string, Record<string, T>>>,
  name: string,
  options: Readonly<{
    merge: (values: T[]) => T | undefined
    validateTarget: (target: string) => boolean
  }>
) {
  const { merge, validateTarget } = options

  return atom(
    (get) => {
      const contributions = get(base)[name]
      return contributions ? merge(Object.values(contributions)) : undefined
    },
    (get, set, target: string, value: T | undefined) => {
      if (!validateTarget(target)) {
        return
      }

      const current = get(base)
      const contributions = { ...(current[target] ?? {}) }

      if (value !== undefined && value !== null) {
        if (!deepEqual(contributions[name], value)) {
          contributions[name] = value
          set(base, { ...current, [target]: contributions })
        }
        return
      }

      if (!(name in contributions)) {
        return
      }

      delete contributions[name]
      set(
        base,
        Object.keys(contributions).length === 0
          ? omitKey(current, target)
          : { ...current, [target]: contributions }
      )
    }
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
      if (name in next) {
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

export function createNestedClearAtom<TInner>(
  baseAtom: PrimitiveAtom<Record<string, Record<string, TInner>>>
) {
  return atom(null, (get, set, contributorNames: string[]) => {
    const current = get(baseAtom)
    const next = { ...current }
    let hasChanges = false

    for (const name of contributorNames) {
      if (name in next) {
        delete next[name]
        hasChanges = true
      }
    }

    for (const target in next) {
      const targetContributions = { ...next[target] }
      let targetChanged = false

      for (const contributorName of contributorNames) {
        if (contributorName in targetContributions) {
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

// The record itself, and the ways the form writes the whole of it. One entry
// of it is `useEntryAtom`, made by the component that reads it.
export function createAtomStore<T>(initialValue: Record<string, T> = {}) {
  const baseAtom = atom<Record<string, T>>(initialValue)

  return {
    atom: baseAtom,
    clearAll: createClearAllAtom(baseAtom),
    clear: createClearAtom(baseAtom),
    bulkReport: createBulkReportAtom(baseAtom),
  }
}
