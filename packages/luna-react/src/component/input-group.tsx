import { InputLabel } from './input-label'
import { StaticDescription, type DescriptionProps } from './field-description'
import type { Config } from '../type'
import type { Field } from '@luna-form/core'

export function InputGroup(
  props: Readonly<{
    children: React.ReactNode
    config?: Config
    context?: Record<string, unknown>
    description?: React.ComponentType<DescriptionProps>
    field: Field
    horizontal?: boolean
    translations?: Record<string, string>
  }>
) {
  // What the client passes, or the definition's own text. See
  // `StaticDescription`.
  const Description = props.description ?? StaticDescription

  return (
    <>
      {props.field.name && props.field.label && (
        <InputLabel
          config={props.config}
          context={props.context}
          description={props.description}
          field={props.field}
          horizontal={props.horizontal}
          translations={props.translations}
        />
      )}
      {props.children}
      {props.horizontal === false && (
        <Description
          config={props.config}
          context={props.context}
          field={props.field}
          translations={props.translations}
        />
      )}
    </>
  )
}
