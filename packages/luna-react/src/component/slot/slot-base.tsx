import {
  isColumn,
  isField,
  prepare,
  type Fields,
  type Style,
} from '@luna-form/core'
import { Fragment } from 'react'
import type { Children } from '../../type'
import type { ColumnProps } from '../column'
import type { FieldProps } from '../field/field'

export function SlotBase<
  T extends {
    column: React.ComponentType<ColumnProps>
    field: React.ComponentType<FieldProps>
  },
>(
  props: Readonly<{
    children: Children
    components: T
    disabled?: boolean
    fields?: Fields
    style?: Style
  }>
) {
  const { column: Column, field: Field } = props.components

  return prepare(props.fields).map((field, index) => (
    <Fragment key={index}>
      {isColumn(field) && (
        <Column column={field}>
          <SlotBase {...props} fields={field.fields} />
        </Column>
      )}
      {isField(field) && (
        <Field disabled={props.disabled} field={field} style={props.style}>
          {props.children}
        </Field>
      )}
    </Fragment>
  ))
}
