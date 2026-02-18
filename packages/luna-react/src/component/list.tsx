import { FieldSetBase } from './field/field-set-base'
import type { List } from '@luna-form/core'

export function List(
  props: Readonly<{
    children: React.ReactNode
    field: List
  }>
) {
  return (
    <FieldSetBase
      description={props.field.description}
      empty={props.field.fields.length === 0}
      id={props.field.name}
      title={props.field.label}
    >
      {props.children}
    </FieldSetBase>
  )
}
