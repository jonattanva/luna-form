import {
  isColumn,
  isField,
  isList,
  prepare,
  readNow,
  type Fields,
  type List,
  type Nullable,
  type Style,
  type Localization,
} from '@luna-form/core'
import { Column } from '../column'
import type { DescriptionTextProps } from '../description'
import { Fragment, useCallback } from 'react'
import { SlotList } from './slot-list'
import type { Children, Config } from '../../type'
import type { FieldProps } from '../field/field'
import type { ListProps } from '../field/field-list'

export type SlotComponents = {
  description?: React.ComponentType<DescriptionTextProps>
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

type SlotBaseProps = Readonly<{
  children: Children
  components: SlotComponents
  config: Config
  context?: Record<string, unknown>
  disabled?: boolean
  fields?: Fields
  onValueChange?: (input: { name: string; value: unknown }) => void
  style?: Style
  localization?: Localization
  value?: Nullable<Record<string, unknown>>
}>

export function SlotBase(props: SlotBaseProps) {
  const { field: Field } = props.components
  const now = readNow(props.context)

  return prepare(props.fields).map((field, index) => (
    <Fragment key={slotKey(field, index)}>
      {isColumn(field) && (
        <Column
          column={field}
          config={props.config}
          context={props.context}
          description={props.components.description}
          localization={props.localization}
        >
          <SlotBase {...props} fields={field.fields} />
        </Column>
      )}
      {isField(field) && (
        <Field
          disabled={props.disabled}
          field={field}
          now={now}
          style={props.style}
          localization={props.localization}
        >
          {props.children}
        </Field>
      )}
      {isList(field) && <SlotListField {...props} field={field} />}
    </Fragment>
  ))
}

/**
 * A list, and the callback that renders one of its rows.
 *
 * The callback is what a row is memoized on, so it holds still across a
 * keystroke: it closes over the form's steady props and not over the value the
 * host holds. A row is handed the value to start from by its list -- the one
 * the list was mounted with -- and every keystroke after that reaches the row
 * through the store. Closing over the live value instead rebuilt the callback
 * whenever the host handed its value back, which a controlled host does on
 * every keystroke, and every row of every list rendered again with it.
 */
function SlotListField(props: SlotBaseProps & Readonly<{ field: List }>) {
  const {
    children,
    components,
    config,
    context,
    disabled,
    field,
    localization,
    onValueChange,
    style,
  } = props
  const { list: ListComponent } = components

  const renderRow = useCallback(
    (index: number, value?: Nullable<Record<string, unknown>>) => (
      <SlotList
        components={components}
        config={config}
        context={context}
        disabled={disabled}
        field={field}
        index={index}
        onValueChange={onValueChange}
        style={style}
        localization={localization}
        value={value}
      >
        {children}
      </SlotList>
    ),
    [
      children,
      components,
      config,
      context,
      disabled,
      field,
      localization,
      onValueChange,
      style,
    ]
  )

  return (
    <ListComponent
      field={field}
      onValueChange={onValueChange}
      localization={localization}
      value={props.value}
    >
      {renderRow}
    </ListComponent>
  )
}
