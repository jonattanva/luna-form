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
import { SlotList } from './slot-list'
import type { Children } from '../../type'
import type { FieldProps } from '../field/field'
import type { ListProps } from '../field/field-list'

export type SlotComponents = {
  field: React.ComponentType<FieldProps>
  list: React.ComponentType<ListProps>
}

export function SlotBase(
  props: Readonly<{
    children: Children
    components: SlotComponents
    disabled?: boolean
    fields?: Fields
    style?: Style
    value?: Nullable<Record<string, unknown>>
  }>
) {
  const { field: Field, list: List } = props.components

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
        <List field={field} value={props.value}>
          {(index) => (
            <SlotList
              children={props.children}
              components={props.components}
              disabled={props.disabled}
              field={field}
              index={index}
              style={props.style}
              value={props.value}
            />
          )}
        </List>
      )}
    </Fragment>
  ))
}
