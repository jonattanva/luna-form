import {
  VERTICAL,
  buildReverse,
  isCheckbox,
  isClickable,
  type Field,
  type Orientation,
} from '@luna-form/core'
import { FieldVertical } from './field-vertical'
import { FieldHorizontal } from './field-horizontal'

export function FieldGroup(
  props: Readonly<{
    children: React.ReactNode
    disabled?: boolean
    errors?: string[]
    field: Field
    orientation?: Orientation
  }>
) {
  const clickable = isClickable(props.field)
  const checkbox = isCheckbox(props.field)
  const reversed = buildReverse(props.field)

  if (props.orientation === VERTICAL) {
    return (
      <FieldVertical
        disabled={props.disabled}
        errors={props.errors}
        isCheckbox={checkbox}
        isReversed={reversed}
        isClickable={clickable}
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
    >
      {props.children}
    </FieldHorizontal>
  )
}
