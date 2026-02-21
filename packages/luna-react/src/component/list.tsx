import { FieldSetBase } from './field/field-set-base'
import type { List } from '@luna-form/core'

export function List(
  props: Readonly<{
    children: React.ReactNode
    field: List
  }>
) {
  const empty =
    Array.isArray(props.field.fields) && props.field.fields.length === 0

  return (
    <FieldSetBase
      description={props.field.description}
      empty={empty}
      id={props.field.name}
      title={props.field.label}
    >
      {props.children}
    </FieldSetBase>
  )
}
