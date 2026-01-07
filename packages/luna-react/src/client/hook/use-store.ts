import { clearInputErrorAtom } from '../lib/error-store'
import { clearInputSourceAtom } from '../lib/source-store'
import { clearInputValueAtom } from '../lib/value-store'
import { useCallback } from 'react'
import { useSetAtom } from 'jotai'

export function useStore() {
  const clearErrors = useSetAtom(clearInputErrorAtom)
  const clearSources = useSetAtom(clearInputSourceAtom)
  const clearValues = useSetAtom(clearInputValueAtom)

  return useCallback(
    (names: string | string[]) => {
      const target = Array.isArray(names) ? names : [names]
      clearErrors(target)
      clearSources(target)
      clearValues(target)
    },
    [clearErrors, clearSources, clearValues]
  )
}
