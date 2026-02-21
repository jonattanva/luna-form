import { FormattedDescription } from './formatted-description'
import { Label } from './label'
import {
  HORIZONTAL,
  interpolateIfNeeded,
  translate,
  type Field,
  type Orientation,
} from '@luna-form/core'
import type { Config } from '../type'

export function InputLabel(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    field: Field
    orientation?: Orientation
    translations?: Record<string, string>
  }>
) {
  const interpolateOpts = {
    context: props.context,
    env: props.config?.env,
  }

  const label = interpolateIfNeeded(props.field.label, interpolateOpts)
  const description = interpolateIfNeeded(
    props.field.description,
    interpolateOpts
  )

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
      {props.orientation === HORIZONTAL && (
        <FormattedDescription
          text={translate(description, props.translations)}
        />
      )}
    </div>
  )
}
