import { FormattedDescription } from './formatted-description'
import { InputLabel } from './input-label'
import {
  translate,
  VERTICAL,
  type Field,
  type Orientation,
} from '@luna-form/core'
import type { Config } from '../type'

export function InputGroup(
  props: Readonly<{
    children: React.ReactNode
    config?: Config
    context?: Record<string, unknown>
    field: Field
    translations?: Record<string, string>
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
          translations={props.translations}
        />
      )}
      {props.children}
      {props.orientation === VERTICAL && props.field.description && (
        <FormattedDescription
          text={translate(props.field.description, props.translations)}
        />
      )}
    </>
  )
}
