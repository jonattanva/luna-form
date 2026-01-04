import { FormattedDescription } from './formatted-description'
import { InputLabel } from './input-label'
import { buildOrientation, VERTICAL, type Field } from '@luna-form/core'

export function InputGroup(
  props: Readonly<{
    children: React.ReactNode
    field: Field
  }>
) {
  const orientation = buildOrientation(props.field)

  return (
    <>
      {props.field.name && props.field.label && (
        <InputLabel field={props.field} orientation={orientation} />
      )}
      {props.children}
      {orientation === VERTICAL && props.field.description && (
        <FormattedDescription text={props.field.description} />
      )}
    </>
  )
}
