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
import type { Children, Config } from '../../type'
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
    config: Config
    context?: Record<string, unknown>
    disabled?: boolean
    fields?: Fields
    onValueChange?: (input: { name: string; value: unknown }) => void
    style?: Style
    translations?: Record<string, string>
    value?: Nullable<Record<string, unknown>>
  }>
) {
  const { field: Field, list: List } = props.components

  return prepare(props.fields).map((field, index) => (
    <Fragment key={index}>
      {isColumn(field) && (
        <Column
          column={field}
          config={props.config}
          context={props.context}
          translations={props.translations}
        >
          <SlotBase {...props} fields={field.fields} />
        </Column>
      )}
      {isField(field) && (
        <Field disabled={props.disabled} field={field} style={props.style}>
          {props.children}
        </Field>
      )}
      {isList(field) && (
        <List
          field={field}
          onValueChange={props.onValueChange}
          translations={props.translations}
          value={props.value}
        >
          {(index) => (
            <SlotList
              components={props.components}
              config={props.config}
              context={props.context}
              disabled={props.disabled}
              field={field}
              index={index}
              onValueChange={props.onValueChange}
              style={props.style}
              translations={props.translations}
              value={props.value}
            >
              {props.children}
            </SlotList>
          )}
        </List>
      )}
    </Fragment>
  ))
}
