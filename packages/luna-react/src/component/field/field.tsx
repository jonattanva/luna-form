import { FieldError } from './field-error'
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
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import type { Children } from '../../type'

export type FieldProps = Readonly<{
  children: Children
  disabled?: boolean
  errors?: string[]
  field: Field
  lang?: string
  style?: Style
  translations?: Record<string, string>
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
          lang={props.lang}
          readOnly={readOnly}
          translations={props.translations}
        >
          {props.children}
        </InputBase>
      </FieldGroup>
      <FieldError errors={errors} name={props.field.name} />
    </div>
  )
}
