import { Form as Body } from '../../component/form'
import { Input } from './input'
import { Slot } from './slot'
import { useFormState, type FormState } from '../hook/use-form-action'
import { useHydrateAtoms } from 'jotai/utils'
import { useSchema } from '../hook/use-schema'
import { valueAtom } from '../lib/value-store'
import type {
  Definition,
  FormStateError,
  Nullable,
  Sections,
  ZodSchema,
} from '@luna-form/core'
import type { Config } from '../../type'

export function Form<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: Readonly<{
    action?: <K>(formData: K, schema?: ZodSchema) => Promise<FormState<T>>
    children?: React.ReactNode
    config: Config
    definition?: Definition
    onError?: (error: Nullable<FormStateError>) => void
    onSuccess?: (data: T) => void
    readOnly?: boolean
    sections: Sections
    value?: Nullable<T>
  }>
) {
  const [schema, onMount, onUnmount] = useSchema()

  const [action, state] = useFormState<T>(schema, props.action, {
    onError: props.onError,
    onSuccess: props.onSuccess,
    validation: props.config.validation.submit,
    value: props.value,
  })

  useHydrateAtoms([[valueAtom, props.value ?? {}]])

  const Alert = props.config.alert ?? (() => null)
  const isShowingError =
    props.config.validation.showError && !state.success && state.error

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
        <>
          {isShowingError && (
            <Alert
              title={state.error!.title}
              description={state.error?.description}
              details={state.error?.details}
            />
          )}
          <Slot disabled={disabled} fields={fields} style={props.config.style}>
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
  )
}
