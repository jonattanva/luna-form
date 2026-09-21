import { createContributionAtom, createEntryAtom } from '../lib/store-helper'
import { useMemo } from 'react'
import type { PrimitiveAtom } from 'jotai'

/**
 * One entry of a record the whole form shares, as an atom of the component that
 * reads it.
 *
 * A family did this before: one atom per name, kept in a module-level cache for
 * the life of the page. That cache never let go on its own, so it had to be
 * emptied by hand -- release atoms, a call in `useStore`, and a comment on the
 * loop to avoid -- and two of the three families grew anyway, a key per row ever
 * added and a key per name ever shown. Made here, the atom goes when the
 * component does, and there is nothing left to release.
 */
export function useEntryAtom<T>(
  base: PrimitiveAtom<Record<string, T>>,
  name: string
) {
  return useMemo(() => createEntryAtom(base, name), [base, name])
}

/** The same for a record of contributions. See `createContributionAtom`. */
export function useContributionAtom<T>(
  base: PrimitiveAtom<Record<string, Record<string, T>>>,
  name: string,
  options: Readonly<{
    merge: (values: T[]) => T | undefined
    validateTarget: (target: string) => boolean
  }>
) {
  return useMemo(
    () => createContributionAtom(base, name, options),
    [base, name, options]
  )
}
