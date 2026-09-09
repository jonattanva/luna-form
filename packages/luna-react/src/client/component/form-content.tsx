import { Form as Body } from '../../component/form'
import { Input } from './input'
import { Slot } from './slot/slot'
import { renderIfExists } from '../../lib/render-If-exists'
import { resolveDictionary } from '@luna-form/core'
import { useFormState, type FormState } from '../hook/use-form-action'
import { useEffect, useMemo } from 'react'
import { hostValueAtom } from '../lib/host-value-store'
import { useSchema } from '../hook/use-schema'
import { useSetAtom } from 'jotai'
import type { Config, Control } from '../../type'
import type { Definition, Nullable, Sections, ZodSchema } from '@luna-form/core'

export function FormContent<
  T extends Record<string, unknown> = Record<string, unknown>,
  F = Record<string, unknown>,
>(
  props: Readonly<{
    advanced?: {
      step?: boolean
    }
    action?: (formData: F, schema?: ZodSchema) => Promise<FormState<T>>
    children?: Control
    config: Config
    context?: Record<string, unknown>
    definition?: Definition
    lang?: string
    onSuccess?: (data: T) => void
    onValueChange?: (input: { name: string; value: unknown }) => void
    readOnly?: boolean
    sections: Sections
    translations?: Record<string, Record<string, string>>
    value?: Nullable<T>
  }>
) {
  // Merging the built-ins allocates, so it is memoized: this identity is a
  // dependency of the per-field schema memo, and a fresh object on every render
  // would rebuild every field's schema on every keystroke.
  const translations = useMemo(
    () => resolveDictionary(props.lang, props.translations),
    [props.lang, props.translations]
  )

  const [getSchema, onMount, onUnmount] = useSchema()
  const [action, state, isPending] = useFormState(getSchema, props.action, {
    onSuccess: props.onSuccess,
    validation: props.config.validation.submit,
    translations,
  })

  const isShowingError =
    props.config.validation.showError && !state.success && state.error
  const value = state.data ?? props.value

  // The value the host holds enters the store here, once, so a field can read
  // its own entry instead of being handed the whole record. See `useValue`.
  //
  // In an effect rather than during render, because writing a store while
  // rendering is not a thing React lets a component do honestly.
  //
  // That costs a commit, and the cost is worth knowing about. A field reacting
  // to this write reacts one commit later than it did to a prop, so anything
  // that reads the host's value once and latches sees nothing the first time
  // and never looks again. `useValue` is fine -- it re-applies whenever its
  // entry changes -- but the initial change events in `input-base` are not,
  // which is why they still take the record as a prop. Moving them here needs
  // that latch dealt with first, and no ordering of effects is enough: their
  // effect belongs to the first commit and reads what that render captured,
  // whatever a layout effect writes in between. `initial-value-nested-state-
  // event` is the case that proves it.
  const setHostValue = useSetAtom(hostValueAtom)
  useEffect(() => {
    setHostValue(value ?? null)
  }, [setHostValue, value])

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
        advanced={props.advanced}
        config={props.config}
        control={props.children}
        definition={props.definition}
        isPending={isPending}
        noValidate
        readOnly={props.readOnly}
        sections={props.sections}
        translations={translations}
      >
        {({ disabled, fields }) => (
          <Slot
            config={props.config}
            context={props.context}
            disabled={disabled}
            fields={fields}
            lang={props.lang}
            onValueChange={props.onValueChange}
            style={props.config.style}
            translations={translations}
            value={value}
          >
            {(internal) => (
              <Input
                {...internal}
                config={props.config}
                context={props.context}
                getSchema={getSchema}
                onMount={onMount}
                onUnmount={onUnmount}
                onValueChange={props.onValueChange}
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
