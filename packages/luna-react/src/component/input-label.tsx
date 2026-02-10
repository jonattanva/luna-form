import { FormattedDescription } from './formatted-description'
import { Label } from './label'
import {
  HORIZONTAL,
  interpolate,
  isInterpolated,
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
  const label = isInterpolated(props.field.label)
    ? interpolate(props.field.label, {
        context: props.context,
        env: props.config?.env,
      })
    : props.field.label

  const description = isInterpolated(props.field.description)
    ? interpolate(props.field.description, {
        context: props.context,
        env: props.config?.env,
      })
    : props.field.description

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
