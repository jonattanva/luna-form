import {
  getInitialList,
  getLabel,
  isMultiFieldList,
  translate,
  type List,
  type Nullable,
  type Localization,
} from '@luna-form/core'
import { FieldListItem } from './field-list-item'

export type ListProps = Readonly<{
  children: (index: number) => React.ReactNode
  field: List
  onValueChange?: (input: { name: string; value: unknown }) => void
  localization?: Localization
  value?: Nullable<Record<string, unknown>>
}>

export function FieldList(props: ListProps) {
  const translations = props.localization?.translations
  const label = translate(getLabel(props.field), translations)
  const isMultiField = isMultiFieldList(props.field)

  return getInitialList(props.field, props.value).map((index) => (
    <FieldListItem
      collapsed={props.field.advanced?.collapsed}
      index={index}
      isMultiField={isMultiField}
      key={index}
      label={label}
      translations={translations}
    >
      {props.children(index)}
    </FieldListItem>
  ))
}
