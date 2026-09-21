import { isColumn } from '@luna-form/core'
import type { Column, Field, FieldState, Fields, List } from '@luna-form/core'

// What a field declares and what the form has been told about it, in that
// order. Kept here, away from the atom that answers the second half, because
// the server tree has to ask the same question with nothing to read: a form
// rendered on the server knows only what its definition says.

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

export function isEntryHidden(
  entry: Fields[number],
  states: Record<string, FieldState>
): boolean {
  return isColumn(entry)
    ? isColumnHidden(entry, states)
    : isFieldHidden(entry, states)
}

// Whether a guard has anything left to show: what the container itself
// declares, and then every entry it holds.
export function isGuardHidden(
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
