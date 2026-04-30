import {
  isColumn,
  isField,
  type List,
  type Nullable,
  type Style,
} from '@luna-form/core'
import { SlotBase, type SlotComponents } from './slot-base'
import type { Children, Config } from '../../type'

export function SlotList(
  props: Readonly<{
    children: Children
    components: SlotComponents
    config: Config
    context?: Record<string, unknown>
    disabled?: boolean
    field: List
    index: number
    style?: Style
    translations?: Record<string, string>
    value?: Nullable<Record<string, unknown>>
  }>
) {
  const fields = Array.isArray(props.field.fields)
    ? props.field.fields.map((field) => {
        if (isField(field)) {
          return {
            ...field,
            name: `${props.field.name}.${props.index}.${field.name}`,
          }
        }

        if (isColumn(field)) {
          return {
            ...field,
            fields: field.fields.map((columnField) => ({
              ...columnField,
              name: `${props.field.name}.${props.index}.${columnField.name}`,
            })),
          }
        }

        return field
      })
    : []

  return (
    <SlotBase
      children={props.children}
      components={props.components}
      config={props.config}
      context={props.context}
      disabled={props.disabled}
      fields={fields}
      style={props.style}
      translations={props.translations}
      value={props.value}
    />
  )
}
