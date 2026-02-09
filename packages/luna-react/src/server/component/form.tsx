import { Form as Component } from '../../component/form'
import { Input } from './input'
import { Slot } from '../../component/slot/slot'
import type { Config } from '../../type'
import type { Definition, Sections } from '@luna-form/core'

export function Form(
  props: Readonly<{
    children?: React.ReactNode
    config: Config
    context?: Record<string, unknown>
    definition?: Definition
    lang?: string
    readOnly?: boolean
    sections: Sections
    translations?: Record<string, Record<string, string>>
    value?: Record<string, unknown>
  }>
) {
  const translations = props.translations?.[props.lang ?? '']

  return (
    <Component
      config={props.config}
      control={props.children}
      definition={props.definition}
      readOnly={props.readOnly}
      sections={props.sections}
    >
      {({ disabled, fields }) => (
        <Slot disabled={disabled} fields={fields} style={props.config.style}>
          {(internal) => (
            <Input
              {...internal}
              config={props.config}
              context={props.context}
              translations={translations}
              value={props.value}
            />
          )}
        </Slot>
      )}
    </Component>
  )
}
