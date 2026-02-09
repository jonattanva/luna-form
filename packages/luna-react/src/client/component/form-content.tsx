import { Field } from './wrapper'
import { Form as Body } from '../../component/form'
import { Input } from './input'
import { createSlot } from '../../component/slot/slot-create'
import { renderIfExists } from '../../lib/render-If-exists'
import { useFormState, type FormState } from '../hook/use-form-action'
import { useSchema } from '../hook/use-schema'
import type { Config, Control } from '../../type'
import type { Definition, Nullable, Sections, ZodSchema } from '@luna-form/core'

const Slot = createSlot(Field)

export function FormContent<
  T extends Record<string, unknown> = Record<string, unknown>,
  F = Record<string, unknown>,
>(
  props: Readonly<{
    action?: (formData: F, schema?: ZodSchema) => Promise<FormState<T>>
    children?: Control
    config: Config
    context?: Record<string, unknown>
    definition?: Definition
    lang?: string
    onSuccess?: (data: T) => void
    readOnly?: boolean
    sections: Sections
    translations?: Record<string, Record<string, string>>
    value?: Nullable<T>
  }>
) {
  const translations = props.translations?.[props.lang ?? '']

  const [schema, onMount, onUnmount] = useSchema()
  const [action, state, isPending] = useFormState(schema, props.action, {
    onSuccess: props.onSuccess,
    validation: props.config.validation.submit,
    translations,
  })

  const isShowingError =
    props.config.validation.showError && !state.success && state.error
  const value = state.data ?? props.value

  return (
    <>
      {isShowingError &&
        renderIfExists(props.config.alert, (Alert) => (
          <div className="mb-4 w-full">
            <Alert
              description={state.error?.description}
              details={state.error?.details}
              title={state.error!.title}
            />
          </div>
        ))}
      <Body
        action={action}
        config={props.config}
        control={props.children}
        definition={props.definition}
        isPending={isPending}
        noValidate
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
                onMount={onMount}
                onUnmount={onUnmount}
                translations={translations}
                value={value}
              />
            )}
          </Slot>
        )}
      </Body>
    </>
  )
}
