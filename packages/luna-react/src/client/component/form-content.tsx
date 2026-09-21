import { FailedSubmitContext } from '../context/failed-submit-context'
import { FieldSet } from './field/field-set'
import { Form as Body } from '../../component/form'
import { Input } from './input'
import { Slot } from './slot/slot'
import { VisibilityGuard } from './guard/visibility-guard'
import { renderIfExists } from '../../lib/render-If-exists'
import { resolveDictionary } from '@luna-form/core'
import { useFormState, type FormState } from '../hook/use-form-action'
import { useCallback, useEffect, useMemo } from 'react'
import { hostValueAtom } from '../lib/host-value-store'
import { useLatest } from '../hook/use-latest'
import { useSchema } from '../hook/use-schema'
import { useSetAtom } from 'jotai'
import type { Children, Config, Control } from '../../type'
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

  const [getSchema, getField, onRegister, onUnmount] = useSchema()
  const [action, state, isPending, onSubmit] = useFormState(
    getSchema,
    props.action,
    {
      onSuccess: props.onSuccess,
      validation: props.config.validation.submit,
      translations,
    }
  )

  const isShowingError =
    props.config.validation.showError && !state.success && state.error

  // The submit that failed, while it is the last one. A field holding an error
  // reads it to bring that error into view through whatever collapsed section
  // or row keeps it off the screen. See `FieldError`.
  const failed = !state.success && state.error ? state : null

  // The host's callback, held steady. A host that declares `onValueChange`
  // inline -- the ordinary way to write it -- hands us a new function on every
  // one of its renders, and that alone gives every field new props on every
  // keystroke. The library should not need the host to memoize anything to
  // behave well.
  //
  // Still `undefined` when the host passed nothing, because that is a question
  // the rest of the code asks: `reportTarget` skips a lookup entirely when
  // there is no one to report to, and a wrapper that is always defined would
  // quietly take that away.
  const onValueChangeRef = useLatest(props.onValueChange)

  const hasValueChange = !!props.onValueChange
  const onValueChange = useMemo(
    () =>
      hasValueChange
        ? (input: { name: string; value: unknown }) =>
            onValueChangeRef.current?.(input)
        : undefined,
    [hasValueChange, onValueChangeRef]
  )

  // The `children` every field is handed, and what a field is memoized on.
  // Everything it closes over is steady now: the value the host holds reaches a
  // field through the store and the context, so this is not rebuilt when that
  // changes.
  const renderInput = useCallback<Children>(
    (internal) => (
      <Input
        {...internal}
        config={props.config}
        context={props.context}
        getField={getField}
        onRegister={onRegister}
        onUnmount={onUnmount}
        onValueChange={onValueChange}
        translations={translations}
      />
    ),
    [
      getField,
      onRegister,
      onUnmount,
      onValueChange,
      props.config,
      props.context,
      translations,
    ]
  )

  // The value the host holds enters the store here, once, so a field can read
  // its own entry instead of being handed the whole record. See `useValue`.
  //
  // The host's value and nothing else. A failed submit used to hand its
  // FormData back through here as if the host had passed it -- flat, keyed by
  // the stable ids of list rows, with a scalar where a field keeps an array --
  // and the form held on to it until a submit succeeded: a row read the entry
  // of the row beside it, a chips field with one selection came back empty, and
  // the host could not put its own value back. The values need no help to
  // survive a failure. They are in the store already, a failure clears nothing,
  // and nothing resets the form after one; see `useFormState`.
  //
  // In an effect rather than during render, because writing a store while
  // rendering is not a thing React lets a component do honestly.
  //
  // That costs a commit, and a child's effects run before this one, so nothing
  // in a child may decide anything final from its own effect. `useValue`
  // re-applies whenever its entry moves and does not care. The initial change
  // events do decide once, which is why they ask from the microtask after the
  // commit rather than from their effect. See `useHostEntryReader`.
  const setHostValue = useSetAtom(hostValueAtom)
  useEffect(() => {
    setHostValue(props.value ?? null)
  }, [setHostValue, props.value])

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
      <FailedSubmitContext value={failed}>
        <Body
          action={action}
          advanced={props.advanced}
          config={props.config}
          control={props.children}
          definition={props.definition}
          fieldSet={FieldSet}
          guard={VisibilityGuard}
          isPending={isPending}
          noValidate
          onSubmit={onSubmit}
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
              onValueChange={onValueChange}
              style={props.config.style}
              translations={translations}
              value={props.value}
            >
              {renderInput}
            </Slot>
          )}
        </Body>
      </FailedSubmitContext>
    </>
  )
}
