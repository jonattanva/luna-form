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
    horizontal?: boolean
    translations?: Record<string, string>
    value?: Record<string, unknown>
  }>
) {
  const source = resolveSource(props.field, props.value)

  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    props.commonProps,
    source,
    props.value,
    props.translations
  )

  const defaultProps = prepareDefaultValue(props.field, defaultValue)

  return renderIfExists(props.config.inputs[props.field.type], (Component) => (
    <InputGroup
      config={props.config}
      context={props.context}
      field={props.field}
      horizontal={props.horizontal}
      translations={props.translations}
    >
      {/* `advanced.data` first, as in the client: an attribute the form
          writes for its own rules is the form's to say. */}
      <Component
        {...props.dataAttributes}
        {...props.ariaAttributes}
        {...commonPropsWithOptions}
        {...defaultProps}
      />
    </InputGroup>
  ))
}
