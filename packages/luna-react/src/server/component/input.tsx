import { FormattedDescription } from '../../component/formatted-description'
import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import {
  prepareInputProps,
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
  const source = resolveSource(props.field, props.value)

  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    props.commonProps,
    source,
    props.value
  )

  return renderIfExists(props.config.inputs[props.field.type], (Component) => (
    <InputGroup field={props.field}>
      <Component
        {...props.ariaAttributes}
        {...commonPropsWithOptions}
        {...props.dataAttributes}
        defaultValue={defaultValue}
      />
      <FormattedDescription text={props.field.description} />
    </InputGroup>
  ))
}
