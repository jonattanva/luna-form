import { FormattedDescription } from './formatted-description'
import { InputLabel } from './input-label'
import type { Config } from '../type'
import type { Field } from '@luna-form/core'

export function InputGroup(
  props: Readonly<{
    children: React.ReactNode
    config?: Config
    context?: Record<string, unknown>
    field: Field
    horizontal?: boolean
    translations?: Record<string, string>
  }>
) {
  return (
    <>
      {props.field.name && props.field.label && (
        <InputLabel
          config={props.config}
          context={props.context}
          field={props.field}
          horizontal={props.horizontal}
          translations={props.translations}
        />
      )}
      {props.children}
      {props.horizontal === false && (
        <FormattedDescription
          config={props.config}
          context={props.context}
          text={props.field.description}
          translations={props.translations}
        />
      )}
    </>
  )
}
