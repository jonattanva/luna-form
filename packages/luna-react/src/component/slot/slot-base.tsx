import {
  isColumn,
  isField,
  isList,
  prepare,
  type Fields,
  type Nullable,
  type Style,
} from '@luna-form/core'
import { Column } from '../column'
import { Fragment } from 'react'
import { List } from '../list'
import type { Children } from '../../type'
import type { FieldProps } from '../field/field'
import type { ListProps } from '../field/field-list'

export function SlotBase<
  T extends {
    field: React.ComponentType<FieldProps>
    fieldList: React.ComponentType<ListProps>
  },
>(
  props: Readonly<{
    children: Children
    components: T
    disabled?: boolean
    fields?: Fields
    style?: Style
    value?: Nullable<Record<string, unknown>>
  }>
) {
  const { field: Field, fieldList: FieldList } = props.components

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
      {isList(field) && (
        <List field={field}>
          <FieldList field={field} value={props.value}>
            {() => (
              <SlotBase {...props} fields={field.fields}>
                {props.children}
              </SlotBase>
            )}
          </FieldList>
        </List>
      )}
    </Fragment>
  ))
}
