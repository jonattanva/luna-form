import { FormattedDescription } from './formatted-description'
import { HORIZONTAL, type Field, type Orientation } from '@luna-form/core'
import { Label } from './label'

export function InputLabel(
  props: Readonly<{
    field: Field
    orientation: Orientation
  }>
) {
  return (
    <div
      data-slot="field-content"
      className="flex flex-1 flex-col gap-1.5 leading-snug"
    >
      <Label field={props.field}>{props.field.label}</Label>
      {props.orientation === HORIZONTAL && (
        <FormattedDescription text={props.field.description} />
      )}
    </div>
  )
}
