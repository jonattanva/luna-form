import {
  buildAriaAttributes,
  buildCommon,
  buildDataAttributes,
  type Field,
} from '@luna-form/core'
import type { Children } from '../../type'

export function InputBase(
  props: Readonly<{
    children: Children
    disabled?: boolean
    errors?: string[]
    field: Field
    horizontal?: boolean
  }>
) {
  if (!props.field.type) {
    return null
  }

  const commonProps = buildCommon(props.field, props.disabled)

  const dataAttributes = buildDataAttributes(props.field)
  const ariaAttributes = buildAriaAttributes(props.field, props.errors)

  const field = {
    ...props.field,
    disabled: commonProps.disabled,
  }

  return props.children({
    ariaAttributes,
    commonProps,
    dataAttributes,
    field,
    horizontal: props.horizontal,
  })
}
