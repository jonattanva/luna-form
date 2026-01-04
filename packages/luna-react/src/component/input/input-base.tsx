import { buildCommon } from './input-common'
import { buildAriaAttributes, buildDataAttributes } from './input-attributes'
import type { Children } from '../../type'
import type { Field } from '@luna-form/core'

export function InputBase(
  props: Readonly<{
    children: Children
    disabled?: boolean
    errors?: string[]
    field: Field
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
  })
}
