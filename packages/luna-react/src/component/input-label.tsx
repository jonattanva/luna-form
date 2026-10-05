import { Label } from './label'
import { StaticDescription, type DescriptionProps } from './field-description'
import {
  interpolateIfNeeded,
  renderOptions,
  translate,
  type Field,
  type Localization,
} from '@luna-form/core'
import type { Config } from '../type'

export function InputLabel(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    description?: React.ComponentType<DescriptionProps>
    field: Field
    horizontal?: boolean
    localization?: Localization
  }>
) {
  const Description = props.description ?? StaticDescription

  const interpolateOpts = {
    context: props.context,
    env: props.config?.env,
  }

  // Formatted the way `FormattedDescription` formats, in the form's language,
  // so the same placeholder reads the same in a label and in a description.
  const label = interpolateIfNeeded(
    props.field.label,
    interpolateOpts,
    renderOptions(props.localization?.lang, props.context)
  )

  return (
    <div
      data-slot="field-content"
      className="flex w-full flex-1 flex-col gap-1.5 leading-snug"
    >
      <Label
        field={props.field}
        style={props.config?.style}
        translations={props.localization?.translations}
      >
        {translate(label, props.localization?.translations)}
      </Label>
      {props.horizontal === true && (
        <Description
          config={props.config}
          context={props.context}
          field={props.field}
          localization={props.localization}
        />
      )}
    </div>
  )
}
