import { Form as Body } from '../../component/form'
import { Input } from './input'
import { Slot } from './slot'
import { useFormAction } from '../hook/use-form-action'
import { useSchema } from '../hook/use-schema'
import type { Definition, Sections } from '@luna-form/core'
import type { Config } from '../../type'

export function Form(
  props: Readonly<{
    action?: (formData: FormData) => Promise<void> | void
    children?: React.ReactNode
    config: Config
    definition?: Definition
    readOnly?: boolean
    sections: Sections
    value?: Record<string, unknown>
  }>
) {
  const [schema, onMount, onUnmount] = useSchema()

  const [action] = useFormAction(schema, props.action, {
    enabled: props.config.validation.submit,
  })

  return (
    <Body
      action={action}
      config={props.config}
      control={props.children}
      definition={props.definition}
      noValidate
      readOnly={props.readOnly}
      sections={props.sections}
    >
      {({ disabled, fields }) => (
        <Slot disabled={disabled} fields={fields}>
          {(internal) => (
            <Input
              {...internal}
              config={props.config}
              onMount={onMount}
              onUnmount={onUnmount}
              value={props.value}
            />
          )}
        </Slot>
      )}
    </Body>
  )
}
