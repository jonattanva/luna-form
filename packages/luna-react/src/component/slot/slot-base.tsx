import { isColumn, isField, prepare, type Fields } from '@luna-form/core'
import { Fragment } from 'react'
import type { Children } from '../../type'
import type { ColumnProps } from '../column'
import type { FieldProps } from '../field/field'
import type { Style } from '../../lib/use-style'

export function SlotBase<
  T extends {
    column: React.ComponentType<ColumnProps>
    field: React.ComponentType<FieldProps>
  },
>(
  props: Readonly<{
    children: Children
    disabled?: boolean
    fields?: Fields
    components: T
    style?: Style
  }>
) {
  const fields = prepare(props.fields)

  const { column: Column, field: Field } = props.components

  return fields.map((field, index) => (
    <Fragment key={index}>
      {isColumn(field) && (
        <Column column={field} style={props.style}>
          <SlotBase {...props} fields={field.fields} />
        </Column>
      )}
      {isField(field) && (
        <Field disabled={props.disabled} field={field}>
          {props.children}
        </Field>
      )}
    </Fragment>
  ))
}
