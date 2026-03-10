import { FormattedDescription } from './formatted-description'
import { Label } from './label'
import { interpolateIfNeeded, translate, type Field } from '@luna-form/core'
import type { Config } from '../type'

export function InputLabel(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    field: Field
    horizontal?: boolean
    translations?: Record<string, string>
  }>
) {
  const interpolateOpts = {
    context: props.context,
    env: props.config?.env,
  }

  const label = interpolateIfNeeded(props.field.label, interpolateOpts)

  return (
    <div
      data-slot="field-content"
      className="flex w-full flex-1 flex-col gap-1.5 leading-snug"
    >
      <Label
        field={props.field}
        style={props.config?.style}
        translations={props.translations}
      >
        {translate(label, props.translations)}
      </Label>
      {props.horizontal === true && (
        <FormattedDescription
          config={props.config}
          context={props.context}
          text={props.field.description}
          translations={props.translations}
        />
      )}
    </div>
  )
}
