import {
  VERTICAL,
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
    cols?: number
    disabled?: boolean
    errors?: string[]
    field: Field
    orientation?: Orientation
  }>
) {
  const clickable = isClickable(props.field)
  const checkbox = isCheckbox(props.field)

  if (props.orientation === VERTICAL) {
    return (
      <FieldVertical
        cols={props.cols}
        disabled={props.disabled}
        errors={props.errors}
        isCheckbox={checkbox}
        isClickable={clickable}
      >
        {props.children}
      </FieldVertical>
    )
  }

  return (
    <FieldHorizontal
      cols={props.cols}
      disabled={props.disabled}
      errors={props.errors}
      isCheckbox={checkbox}
      isClickable={clickable}
    >
      {props.children}
    </FieldHorizontal>
  )
}
