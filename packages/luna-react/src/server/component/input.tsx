import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import {
  prepareDefaultValue,
  prepareInputProps,
  resolveSource,
  type AriaAttributes,
  type CommonProps,
  type DataAttributes,
  type Field,
  type Orientation,
} from '@luna-form/core'
import type { Config } from '../../type'

export function Input(
  props: Readonly<{
    ariaAttributes?: AriaAttributes
    commonProps: CommonProps
    config: Config
    context?: Record<string, unknown>
    dataAttributes?: DataAttributes
    field: Field
    orientation?: Orientation
    translations?: Record<string, string>
    value?: Record<string, unknown>
  }>
) {
  const source = resolveSource(props.field, props.value)

  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    props.commonProps,
    source,
    props.value
  )

  const defaultProps = prepareDefaultValue(props.field, defaultValue)

  return renderIfExists(props.config.inputs[props.field.type], (Component) => (
    <InputGroup
      config={props.config}
      context={props.context}
      field={props.field}
      orientation={props.orientation}
      translations={props.translations}
    >
      <Component
        {...props.ariaAttributes}
        {...commonPropsWithOptions}
        {...props.dataAttributes}
        {...defaultProps}
      />
    </InputGroup>
  ))
}
