import {
  getInitialList,
  getLabel,
  isMultiFieldList,
  type List,
  type Nullable,
} from '@luna-form/core'
import { FieldListItem } from './field-list-item'

export type ListProps = Readonly<{
  children: (index: number) => React.ReactNode
  field: List
  value?: Nullable<Record<string, unknown>>
}>

export function FieldList(props: ListProps) {
  const label = getLabel(props.field)
  const isMultiField = isMultiFieldList(props.field)

  return getInitialList(props.field, props.value).map((index) => (
    <FieldListItem
      index={index}
      isMultiField={isMultiField}
      key={index}
      label={label}
    >
      {props.children(index)}
    </FieldListItem>
  ))
}
