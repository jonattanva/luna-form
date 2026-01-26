import { FormattedDescription } from './formatted-description'
import {
  HORIZONTAL,
  interpolate,
  isInterpolated,
  type Field,
  type Orientation,
} from '@luna-form/core'
import { Label } from './label'
import type { Config } from '../type'

export function InputLabel(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    field: Field
    orientation?: Orientation
  }>
) {
  const label = isInterpolated(props.field.label)
    ? interpolate(props.field.label, {
        context: props.context,
        env: props.config?.env,
      })
    : props.field.label

  return (
    <div
      data-slot="field-content"
      className="flex w-full flex-1 flex-col gap-1.5 leading-snug"
    >
      <Label field={props.field}>{label}</Label>
      {props.orientation === HORIZONTAL && (
        <FormattedDescription text={props.field.description} />
      )}
    </div>
  )
}
