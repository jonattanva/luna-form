import { FieldError } from './field-error'
import { FieldGroup } from './field-group'
import { InputBase } from '../input/input-base'
import {
  buildDisabled,
  buildOrientation,
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
  errors?: Record<string, string[]>
  field: Field
  style?: Style
}>

export function Field(props: FieldProps) {
  const cols = props.field.advanced?.cols
  const errors = props.field.name ? props.errors?.[props.field.name] : undefined

  const { orientation } = mergeStyle(props.style, {
    orientation: buildOrientation(props.field),
  })

  const disabled = buildDisabled(props.field, props.disabled)

  return (
    <div className={twMerge('flex flex-col gap-3', getSpan(cols))}>
      <FieldGroup
        cols={cols}
        disabled={disabled}
        errors={errors}
        field={props.field}
        orientation={orientation}
      >
        <InputBase
          disabled={disabled}
          errors={errors}
          field={props.field}
          orientation={orientation}
        >
          {props.children}
        </InputBase>
      </FieldGroup>
      <FieldError errors={errors} name={props.field.name} />
    </div>
  )
}
