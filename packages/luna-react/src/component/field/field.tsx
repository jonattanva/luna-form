import { FieldGroup } from './field-group'
import { InputBase } from '../input/input-base'
import {
  buildDisabled,
  buildOrientation,
  buildReadOnly,
  getSpan,
  mergeStyle,
  type Field,
  type Style,
  type Localization,
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import type { Children } from '../../type'

export type FieldProps = Readonly<{
  children: Children
  disabled?: boolean
  // What lists the field's errors under it, which the client passes in: the
  // one it has brings an error into view after a failed submit, an effect and a
  // context this tree cannot hold, since the server renders it too -- and a
  // form rendered there has no errors to list, as no value has been typed yet.
  // The server leaves it out, which used to take a copy of this whole component.
  error?: React.ComponentType<Readonly<{ errors?: string[]; name?: string }>>
  errors?: string[]
  field: Field
  // `context.now`, the instant a timezone select labels its zones for.
  now?: string
  style?: Style
  localization?: Localization
}>

export function Field(props: FieldProps) {
  const cols = props.field.advanced?.cols

  // A field with no name is not registered, so nothing validates it and nothing
  // is reported under its name. What the store answers for the empty name is
  // not this field's to show.
  const errors = props.field.name ? props.errors : undefined

  // Defaulted here rather than in `buildOrientation`, which has to be able to
  // say nothing for the form-wide style to be reachable. What is passed down
  // stays a boolean: `InputGroup` tells a vertical field apart from an
  // unanswered one by comparing against `false`.
  const { horizontal = false } = mergeStyle(props.style, {
    horizontal: buildOrientation(props.field),
  })

  // Both from the `disabled` the field was handed, before a read-only field is
  // folded into it: past this point the two can no longer be told apart.
  const disabled = buildDisabled(props.field, props.disabled)
  const readOnly = buildReadOnly(props.field, props.disabled)

  const ErrorList = props.error

  return (
    <div className={twMerge('flex flex-col gap-3', getSpan(cols))}>
      <FieldGroup
        disabled={disabled}
        errors={errors}
        field={props.field}
        horizontal={horizontal}
      >
        <InputBase
          disabled={disabled}
          errors={errors}
          field={props.field}
          horizontal={horizontal}
          localization={props.localization}
          now={props.now}
          readOnly={readOnly}
        >
          {props.children}
        </InputBase>
      </FieldGroup>
      {ErrorList && <ErrorList errors={errors} name={props.field.name} />}
    </div>
  )
}
