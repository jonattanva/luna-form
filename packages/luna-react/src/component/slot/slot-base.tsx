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

// By identity and not by position: a definition that changes in place must not
// hand one field's state to another that lands on the same index. A field and a
// list are unique by name within a form -- that is what the schema registry is
// keyed by -- and a column is the names it holds. A slot with no name of its
// own keeps its position, which is all it ever had.
function slotKey(slot: Fields[number], index: number): string {
  if (isColumn(slot)) {
    const names = slot.fields.map((field) => field.name).join('|')
    return `column:${names || index}`
  }
  return slot.name || `slot:${index}`
}

export function SlotBase(
  props: Readonly<{
    children: Children
    components: SlotComponents
    config: Config
    context?: Record<string, unknown>
    disabled?: boolean
    fields?: Fields
    lang?: string
    onValueChange?: (input: { name: string; value: unknown }) => void
    style?: Style
    translations?: Record<string, string>
    value?: Nullable<Record<string, unknown>>
  }>
) {
  const { field: Field, list: List } = props.components

  return prepare(props.fields).map((field, index) => (
    <Fragment key={slotKey(field, index)}>
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
        <Field
          disabled={props.disabled}
          field={field}
          lang={props.lang}
          style={props.style}
          translations={props.translations}
        >
          {props.children}
        </Field>
      )}
      {isList(field) && (
        <List
          field={field}
          lang={props.lang}
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
              lang={props.lang}
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
