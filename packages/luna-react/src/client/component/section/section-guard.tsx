import { useAtomValue } from 'jotai'
import { isColumn } from '@luna-form/core'
import { fieldStateAtom } from '../../lib/state-store'
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

export function SectionGuard(
  props: Readonly<{ children: React.ReactNode; fields: Fields }>
) {
  const states = useAtomValue(fieldStateAtom)

  if (props.fields.length === 0) {
    return null
  }

  const allHidden = props.fields.every((entry) => isEntryHidden(entry, states))
  if (allHidden) {
    return null
  }

  return props.children
}
