import { FieldGroup } from './field-group'
import { InputBase } from './input/input-base'
import { buildDisabled, buildOrientation, type Field } from '@luna-form/core'
import type { Children } from '../type'

export type FieldProps = Readonly<{
  children: Children
  disabled?: boolean
  errors?: Record<string, string[]>
  field: Field
  withinColumn?: boolean
}>

export function Field(props: FieldProps) {
  const cols = props.field.advanced?.cols
  const errors = props.field.name ? props.errors?.[props.field.name] : undefined

  const orientation = buildOrientation(props.field)
  const disabled = buildDisabled(props.field, props.disabled)

  return (
    <FieldGroup
      cols={cols}
      disabled={disabled}
      errors={errors}
      orientation={orientation}
    >
      <InputBase
        disabled={disabled}
        errors={errors}
        field={props.field}
        withinColumn={props.withinColumn}
      >
        {props.children}
      </InputBase>
    </FieldGroup>
  )
}
