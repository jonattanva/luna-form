import { deepEqual } from 'fast-equals'
import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import type { DataSource, Nullable } from '@luna-form/core'

export const sourceAtom = atom<Record<string, DataSource>>({})

export const reportSourceAtom = atomFamily((name: string) =>
  atom(
    (get) => get(sourceAtom)[name] ?? null,
    (get, set, target: string, source: Nullable<DataSource>) => {
      if (!target || target.trim() === '') {
        return
      }

      const current = get(sourceAtom)

      if (source) {
        const currentSource = current[target]
        if (!currentSource || !deepEqual(currentSource, source)) {
          set(sourceAtom, { ...current, [target]: source })
        }
      } else if (current[target]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [target]: _unused, ...rest } = current
        set(sourceAtom, rest)
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
  }

  if (hasChanges) {
    set(sourceAtom, next)
  }
})
