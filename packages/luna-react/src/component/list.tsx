import { FieldSetBase } from './field/field-set-base'
import { translateOptional, type List } from '@luna-form/core'

export function List(
  props: Readonly<{
    children: React.ReactNode
    field: List
    translations?: Record<string, string>
  }>
) {
  const empty =
    Array.isArray(props.field.fields) && props.field.fields.length === 0

  const title = translateOptional(props.field.label, props.translations)
  const description = translateOptional(
    props.field.description,
    props.translations
  )

  return (
    <FieldSetBase
      description={description}
      empty={empty}
      id={props.field.name}
      title={title}
    >
      {props.children}
    </FieldSetBase>
  )
}
