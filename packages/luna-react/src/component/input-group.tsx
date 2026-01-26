import { FormattedDescription } from './formatted-description'
import { InputLabel } from './input-label'
import { VERTICAL, type Field, type Orientation } from '@luna-form/core'
import type { Config } from '../type'

export function InputGroup(
  props: Readonly<{
    children: React.ReactNode
    config?: Config
    context?: Record<string, unknown>
    field: Field
    orientation?: Orientation
  }>
) {
  return (
    <>
      {props.field.name && props.field.label && (
        <InputLabel
          config={props.config}
          context={props.context}
          field={props.field}
          orientation={props.orientation}
        />
      )}
      {props.children}
      {props.orientation === VERTICAL && props.field.description && (
        <FormattedDescription text={props.field.description} />
      )}
    </>
  )
}
