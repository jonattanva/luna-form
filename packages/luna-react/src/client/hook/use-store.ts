import { clearInputErrorAtom } from '../lib/error-store'
import { clearInputSourceAtom } from '../lib/source-store'
import { clearInputValueAtom } from '../lib/value-store'
import { useCallback } from 'react'
import { useSetAtom } from 'jotai'

// What a name leaves behind when it is finished with: its error, its source
// and, unless the field asked to keep it, its value.
//
// There is nothing else to let go of. A view of one entry is an atom the
// component that read it made, so it goes when that component does -- where a
// family cached one per name for the life of the page and had to be emptied
// from here, by hand, without touching the setter the emptying depended on.
export function useStore() {
  const clearErrors = useSetAtom(clearInputErrorAtom)
  const clearValues = useSetAtom(clearInputValueAtom)
  const clearSources = useSetAtom(clearInputSourceAtom)

  return useCallback(
    (names: string | string[], options?: { keepValue?: boolean }) => {
      const target = Array.isArray(names) ? names : [names]
      clearErrors(target)
      clearSources(target)
      if (!options?.keepValue) {
        clearValues(target)
      }
    },
    [clearErrors, clearSources, clearValues]
  )
}
