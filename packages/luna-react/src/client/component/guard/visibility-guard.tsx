import { atom, useAtomValue } from 'jotai'
import { isColumn } from '@luna-form/core'
import { fieldStateAtom } from '../../lib/state-store'
import { useMemo } from 'react'
import type { Column, Field, FieldState, Fields, List } from '@luna-form/core'

function isColumnHidden(
  column: Column,
  states: Record<string, FieldState>
): boolean {
  return column.fields.every((field) => isFieldHidden(field, states))
}

function isFieldHidden(
  field: Field | List,
  states: Record<string, FieldState>
): boolean {
  return states[field.name]?.hidden ?? field.hidden ?? false
}

function isEntryHidden(
  entry: Fields[number],
  states: Record<string, FieldState>
): boolean {
  return isColumn(entry)
    ? isColumnHidden(entry, states)
    : isFieldHidden(entry, states)
}

// Whether this guard has anything left to show: what the container itself
// declares, and then every entry it holds.
function isGuardHidden(
  states: Record<string, FieldState>,
  fields: Fields,
  container?: Field | List
): boolean {
  if (container) {
    const hidden = states[container.name]?.hidden ?? container.hidden ?? false
    if (hidden) {
      return true
    }
  }

  if (fields.length === 0) {
    return true
  }

  return fields.every((entry) => isEntryHidden(entry, states))
}

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
