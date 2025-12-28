import { deepEqual } from 'fast-equals'
import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

export const inputErrorAtom = atom<Record<string, string[]>>({})

export const reportInputErrorAtom = atomFamily((name: string) =>
  atom(
    (get) => get(inputErrorAtom)[name] ?? null,
    (get, set, errors: string[]) => {
      const current = get(inputErrorAtom)

      if (errors.length > 0) {
        const currentErrors = current[name]
        if (!currentErrors || !deepEqual(currentErrors, errors)) {
          set(inputErrorAtom, { ...current, [name]: errors })
        }
      } else if (current[name]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [name]: _unused, ...rest } = current
        set(inputErrorAtom, rest)
      }
    }
  )
)

export const clearInputErrorAtom = atom(null, (get, set, names: string[]) => {
  const current = get(inputErrorAtom)
  const next = { ...current }

  let hasChanges = false
  for (const name of names) {
    if (next[name]) {
      delete next[name]
      hasChanges = true
    }
  }

  if (hasChanges) {
    set(inputErrorAtom, next)
  }
})

export const reportErrorAtom = atom(
  null,
  (get, set, error: Record<string, string[]>) => {
    const current = get(inputErrorAtom)

    if (!deepEqual(current, error)) {
      set(inputErrorAtom, error)
    }
  }
)
