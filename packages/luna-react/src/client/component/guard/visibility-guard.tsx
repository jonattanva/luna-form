import { atom, useAtomValue } from 'jotai'
import { fieldStateAtom } from '../../lib/state-store'
import { isGuardHidden } from '../../../lib/visibility'
import { useMemo } from 'react'
import type { Field, Fields, List } from '@luna-form/core'

export function VisibilityGuard(
  props: Readonly<{
    children: React.ReactNode
    container?: Field | List
    fields: Fields
  }>
) {
  // A boolean, and not the record every field's state is written into. A
  // `state` event that hides one field rewrites that record, and a guard
  // subscribed to it woke up for all of them and walked its own fields again to
  // reach the answer it already had. Derived, the answer is what jotai
  // compares, so the only guard that renders is the one whose answer changed.
  //
  // The atom is made with the guard and collected with it, the same shape a row
  // uses in `useLiveItemValue`: nothing is cached by name.
  const hiddenAtom = useMemo(
    () =>
      atom((get) =>
        isGuardHidden(get(fieldStateAtom), props.fields, props.container)
      ),
    [props.container, props.fields]
  )

  return useAtomValue(hiddenAtom) ? null : props.children
}
