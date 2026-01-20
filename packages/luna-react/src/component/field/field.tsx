import { FieldError } from './field-error'
import { FieldGroup } from './field-group'
import { InputBase } from '../input/input-base'
import { mergeStyle } from '../../lib/util/style'
import {
  buildDisabled,
  buildOrientation,
  type Field,
  type Style,
} from '@luna-form/core'
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
    <div className="flex flex-col gap-3">
      <FieldGroup
        cols={cols}
        disabled={disabled}
        errors={errors}
        orientation={orientation}
      >
        <InputBase disabled={disabled} errors={errors} field={props.field}>
          {props.children}
        </InputBase>
      </FieldGroup>
      <FieldError errors={errors} name={props.field.name} />
    </div>
  )
}
