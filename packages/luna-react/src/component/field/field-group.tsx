import {
  buildReverse,
  isCheckbox,
  isClickable,
  type Field,
} from '@luna-form/core'
import { FieldVertical } from './field-vertical'
import { FieldHorizontal } from './field-horizontal'

export function FieldGroup(
  props: Readonly<{
    children: React.ReactNode
    disabled?: boolean
    errors?: string[]
    field: Field
    horizontal?: boolean
    name?: string
  }>
) {
  const clickable = isClickable(props.field)
  const checkbox = isCheckbox(props.field)
  const reversed = buildReverse(props.field)

  if (!props.horizontal) {
    return (
      <FieldVertical
        disabled={props.disabled}
        errors={props.errors}
        isCheckbox={checkbox}
        isReversed={reversed}
        isClickable={clickable}
        name={props.name}
      >
        {props.children}
      </FieldVertical>
    )
  }

  return (
    <FieldHorizontal
      disabled={props.disabled}
      errors={props.errors}
      isCheckbox={checkbox}
      isReversed={reversed}
      isClickable={clickable}
      name={props.name}
    >
      {props.children}
    </FieldHorizontal>
  )
}
