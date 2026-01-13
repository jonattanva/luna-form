import { Form as Component } from '../../component/form'
import { Input } from './input'
import { Slot } from '../../component/slot/slot'
import type { Config } from '../../type'
import type { Definition, Sections, Source } from '@luna-form/core'

export function Form(
  props: Readonly<{
    children?: React.ReactNode
    config: Config
    definition?: Definition
    readOnly?: boolean
    sections: Sections
    source?: Source
    value?: Record<string, unknown>
  }>
) {
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
              source={props.source}
              value={props.value}
            />
          )}
        </Slot>
      )}
    </Component>
  )
}
