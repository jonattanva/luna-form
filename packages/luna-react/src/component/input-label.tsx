import { Label } from './label'
import { StaticDescription, type DescriptionProps } from './field-description'
import {
  interpolateIfNeeded,
  renderOptions,
  translate,
  type Field,
  type Localization,
} from '@luna-form/core'
import { memo } from 'react'
import type { Config } from '../type'

/**
 * A field's label, which renders when the field's definition does and not
 * because its value did.
 *
 * The input beside it renders on every keystroke -- it is subscribed to its own
 * value -- and this was rendered along with it each time, label, optional mark
 * and all, for text that reads nothing of the value: `{value}` is a
 * description's, never a label's. Every prop here holds still across a
 * keystroke, so the default comparison is enough. `memo` is one of the few
 * things React exports under `react-server` as well, so the server entry still
 * loads this tree.
 */
export const InputLabel = memo(function InputLabel(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    description?: React.ComponentType<DescriptionProps>
    field: Field
    horizontal?: boolean
    localization?: Localization
    // What the field is rendered holding, for the description beside a
    // horizontal label. See `DescriptionProps`.
    value?: unknown
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
          value={props.value}
        />
      )}
    </div>
  )
})
