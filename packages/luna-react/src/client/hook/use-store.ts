import { clearInputErrorAtom, releaseInputErrorAtom } from '../lib/error-store'
import {
  clearInputSourceAtom,
  releaseInputSourceAtom,
} from '../lib/source-store'
import { clearInputValueAtom, releaseInputValueAtom } from '../lib/value-store'
import { releaseFieldStateAtom } from '../lib/state-store'
import { useCallback } from 'react'
import { useSetAtom } from 'jotai'

export function useStore() {
  const clearErrors = useSetAtom(clearInputErrorAtom)
  const clearValues = useSetAtom(clearInputValueAtom)
  const clearSources = useSetAtom(clearInputSourceAtom)

  const releaseErrors = useSetAtom(releaseInputErrorAtom)
  const releaseValues = useSetAtom(releaseInputValueAtom)
  const releaseSources = useSetAtom(releaseInputSourceAtom)
  const releaseStates = useSetAtom(releaseFieldStateAtom)

  return useCallback(
    (names: string | string[], options?: { keepValue?: boolean }) => {
      const target = Array.isArray(names) ? names : [names]
      clearErrors(target)
      clearSources(target)
      if (!options?.keepValue) {
        clearValues(target)
      }

      // Called from `onUnmount`, which is the only moment anything knows a
      // name is finished with. Unconditional, `keepValue` included: what is
      // released is the cached per-name atom, not the value under it, and the
      // record the value lives in is untouched. A name that comes back gets a
      // fresh view of the same entry.
      releaseErrors(target)
      releaseSources(target)
      releaseStates(target)
      releaseValues(target)
    },
    [
      clearErrors,
      clearSources,
      clearValues,
      releaseErrors,
      releaseSources,
      releaseStates,
      releaseValues,
    ]
  )
}
