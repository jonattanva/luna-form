import { FieldError } from './field-error'
import { FormattedDescription } from './formatted-description'
import { InputLabel } from './input-label'
import { buildOrientation, VERTICAL, type Field } from '@luna-form/core'

export function InputGroup(
  props: Readonly<{
    children: React.ReactNode
    errors?: string[]
    field: Field
    withinColumn?: boolean
  }>
) {
  const orientation = buildOrientation(props.field)

  return (
    <>
      {props.field.name && props.field.label && (
        <InputLabel field={props.field} orientation={orientation} />
      )}
      {props.children}
      {orientation === VERTICAL && (
        <FormattedDescription text={props.field.description} />
      )}
      {!props.withinColumn && (
        <FieldError name={props.field.name} errors={props.errors} />
      )}
    </>
  )
}
