import { FieldDescription } from './field-description'
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

  // The same locale `FormattedDescription` formats with. Without it a filter in
  // a label falls back to whatever locale is running the code -- the browser on
  // the client, the process on the server -- so the same placeholder rendered
  // one number in a label and another in a description.
  const locale = props.config?.env?.locale as string | undefined

  const label = interpolateIfNeeded(props.field.label, interpolateOpts, {
    locale,
  })

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
        <FieldDescription
          config={props.config}
          context={props.context}
          field={props.field}
          translations={props.translations}
        />
      )}
    </div>
  )
}
