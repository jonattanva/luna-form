import { Form as Body } from '../../component/form'
import { Hydrate } from './hydrate'
import { Input } from './input'
import { Provider } from 'jotai'
import { Slot } from './slot'
import { renderIfExists } from '../../lib/render-If-exists'
import { useFormState, type FormState } from '../hook/use-form-action'
import { useSchema } from '../hook/use-schema'
import { valueAtom } from '../lib/value-store'
import type { Config, Control } from '../../type'
import type { Definition, Nullable, Sections, ZodSchema } from '@luna-form/core'

export function Form<
  T extends Record<string, unknown> = Record<string, unknown>,
  F = Record<string, unknown>,
>(
  props: Readonly<{
    action?: (formData: F, schema?: ZodSchema) => Promise<FormState<T>>
    children?: Control
    config: Config
    definition?: Definition
    onSuccess?: (data: T) => void
    readOnly?: boolean
    sections: Sections
    value?: Nullable<T>
  }>
) {
  const [schema, onMount, onUnmount] = useSchema()

  const [action, state, isPending] = useFormState(schema, props.action, {
    onSuccess: props.onSuccess,
    validation: props.config.validation.submit,
    value: props.value,
  })

  const isShowingError =
    props.config.validation.showError && !state.success && state.error

  const hasInitialValue = props.value && Object.keys(props.value).length > 0

  return (
    <Provider>
      <Hydrate value={hasInitialValue ? [[valueAtom, props.value]] : []}>
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
            <>
              {isShowingError &&
                renderIfExists(props.config.alert, (Alert) => (
                  <Alert
                    title={state.error!.title}
                    description={state.error?.description}
                    details={state.error?.details}
                  />
                ))}
              <Slot
                disabled={disabled}
                fields={fields}
                style={props.config.style}
              >
                {(internal) => (
                  <Input
                    {...internal}
                    config={props.config}
                    onMount={onMount}
                    onUnmount={onUnmount}
                    value={state.data}
                  />
                )}
              </Slot>
            </>
          )}
        </Body>
      </Hydrate>
    </Provider>
  )
}
