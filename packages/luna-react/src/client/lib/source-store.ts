import { deepEqual } from 'fast-equals'
import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { mergeSource, type DataSource, type Nullable } from '@luna-form/core'

export const sourceAtom = atom<Record<string, Record<string, DataSource>>>({})

export const reportSourceAtom = atomFamily((name: string) =>
  atom(
    (get) => {
      const current = get(sourceAtom)[name]
      if (current) {
        return mergeSource(Object.values(current))
      }
      return null
    },
    (get, set, target: string, source: Nullable<DataSource>) => {
      if (!target || target.trim() === '') {
        return
      }

      const current = get(sourceAtom)
      const targetContributions = { ...(current[target] ?? {}) }

      if (source) {
        const currentContribution = targetContributions[name]
        if (!currentContribution || !deepEqual(currentContribution, source)) {
          targetContributions[name] = source
          set(sourceAtom, { ...current, [target]: targetContributions })
        }
      } else if (targetContributions[name]) {
        delete targetContributions[name]

        if (Object.keys(targetContributions).length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [target]: _unused, ...rest } = current
          set(sourceAtom, rest)
        } else {
          set(sourceAtom, {
            ...current,
            [target]: targetContributions,
          })
        }
      }
    }
  )
)

export const clearInputSourceAtom = atom(null, (get, set, names: string[]) => {
  const current = get(sourceAtom)
  const next = { ...current }

  let hasChanges = false
  for (const name of names) {
    if (next[name]) {
      delete next[name]
      hasChanges = true
    }

    for (const target in next) {
      if (next[target][name]) {
        const updatedTarget = { ...next[target] }
        delete updatedTarget[name]

        if (Object.keys(updatedTarget).length === 0) {
          delete next[target]
        } else {
          next[target] = updatedTarget
        }
        hasChanges = true
      }
    }
  }

  if (hasChanges) {
    set(sourceAtom, next)
  }
})
