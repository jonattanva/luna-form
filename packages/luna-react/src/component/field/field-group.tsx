import { VERTICAL, type Orientation } from '@luna-form/core'
import { FieldVertical } from './field-vertical'
import { FieldHorizontal } from './field-horizontal'

export function FieldGroup(
  props: Readonly<{
    children: React.ReactNode
    cols?: number
    errors?: string[]
    orientation?: Orientation
    disabled?: boolean
  }>
) {
  if (props.orientation === VERTICAL) {
    return (
      <FieldVertical
        cols={props.cols}
        disabled={props.disabled}
        errors={props.errors}
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
    >
      {props.children}
    </FieldHorizontal>
  )
}
