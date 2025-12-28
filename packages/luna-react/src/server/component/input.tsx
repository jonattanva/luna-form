import { Description } from '../../component/description'
import {
  getInputValue,
  getOptions,
  getPreselectedValue,
  mergeOptionsProps,
  resolveSource,
  type AriaAttributes,
  type CommonProps,
  type DataAttributes,
  type Field,
  type Source,
} from '@luna-form/core'
import type { Config } from '../../type'

export function Input(
  props: Readonly<{
    ariaAttributes?: AriaAttributes
    commonProps: CommonProps
    config: Config
    dataAttributes?: DataAttributes
    field: Field
    source?: Source
    value?: Record<string, unknown>
  }>
) {
  const currentValue = getInputValue(props.field, props.value)
  const source = resolveSource(props.field, props.value)

  const options = Array.isArray(source)
    ? getOptions(props.field, source)
    : source

  const commonPropsWithOptions = mergeOptionsProps(
    props.field,
    props.commonProps,
    options
  )

  const defaultValue = getPreselectedValue(
    props.field,
    commonPropsWithOptions,
    currentValue
  )

  const Component = props.config.inputs[props.field.type]
  if (!Component) {
    return null
  }

  return (
    <>
      <Component
        {...props.ariaAttributes}
        {...commonPropsWithOptions}
        {...props.dataAttributes}
        defaultValue={defaultValue}
      />
      {props.field.description && (
        <Description>{props.field.description}</Description>
      )}
    </>
  )
}
