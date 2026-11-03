import { useSetAtom, useStore } from 'jotai'
import { reportErrorAtom } from '../lib/error-store'
import { clearAllValueAtom, valueAtom } from '../lib/value-store'
import { requestFormReset } from 'react-dom'
import {
  startTransition,
  useActionState,
  useCallback,
  useRef,
  type FormEvent,
} from 'react'
import {
  buildSchema,
  flatten,
  getFormData,
  getOfferedValues,
  isOffered,
  logger,
  translateBuiltIn,
  unflatten,
  type Field,
  type FormStateError,
  type Nullable,
  type Schemas,
  type ZodSchema,
} from '@luna-form/core'

export type FormState<T> = {
  data: Nullable<T>
  error: Nullable<FormStateError>
  success: boolean
}

export type FormActionOptions<T> = {
  onSuccess?: (data: T) => void
  preserveValues?: boolean
  sourceTargets?: ReadonlySet<string>
  translations?: Record<string, string>
  validation?: boolean
}

export function useFormState<T, F = Record<string, unknown>>(
  getSchema: () => readonly [Schemas, Field[]],
  action?: (formData: F, schema?: ZodSchema) => Promise<FormState<T>>,
  options?: FormActionOptions<T>
) {
  const {
    onSuccess,
    preserveValues = false,
    sourceTargets,
    validation = true,
    translations,
  } = options ?? {}

  const store = useStore()
  const setError = useSetAtom(reportErrorAtom)
  const clearValues = useSetAtom(clearAllValueAtom)

  // The form being submitted, so that a success can reset it. See `onSubmit`.
  const formRef = useRef<HTMLFormElement | null>(null)

  const initialState: FormState<T> = {
    data: null,
    error: null,
    success: false,
  }

  const [state, formAction, isPending] = useActionState(
    async (
      prevState: FormState<T>,
      formData: FormData
    ): Promise<FormState<T>> => {
      const [schemas, fields] = getSchema()

      const schema = buildSchema(schemas, fields, translations)
      if (validation === false) {
        if (action) {
          return await action(formData as F, schema)
        }
        return prevState
      }

      // A date leaves the schema as `yyyy-MM-dd` whatever the field showed, so
      // what is sent below is what the schema returns, not what was submitted.
      const form = withHeldOptions(
        getFormData(formData),
        fields,
        store.get(valueAtom),
        sourceTargets
      )
      const validated = schema.safeParse(form)

      if (!validated.success) {
        const errors = flatten(validated.error)
        startTransition(() => {
          setError(errors)
        })

        return failure(form as T, {
          description: translateBuiltIn(
            'Please correct the errors and try again.',
            translations
          ),
          details: [],
          title: translateBuiltIn(
            'There were validation errors submitting the form.',
            translations
          ),
        })
      }

      const unflattened = unflatten(
        validated.data as Record<string, unknown>
      ) as F & T

      if (action) {
        try {
          const result = await action(unflattened as F, schema)
          if (!result.success) {
            return failure(unflattened as T, result.error)
          }

          onSuccess?.(result.data as T)
          if (!preserveValues) {
            const submitted = formRef.current
            startTransition(() => {
              clearValues()
              if (submitted) {
                requestFormReset(submitted)
              }
            })
          }

          return success(unflattened as T, preserveValues)
        } catch (error) {
          logger.error('Error executing form action:', error)
          return failure(unflattened as T, {
            title: translateBuiltIn(
              'An unexpected error occurred submitting the form.',
              translations
            ),
            details: buildError(error, translations),
          })
        }
      }

      return success(validated.data as T, preserveValues)
    },
    initialState
  )

  // The submit, dispatched from the form's `onSubmit` rather than left to its
  // `action`.
  //
  // React resets a form after every action it runs itself, whatever the action
  // returned. An input the store controls comes through that unchanged, but a
  // control that restores itself on reset -- a checkbox, a switch, a radio
  // group, a select -- drops what the user picked, and a select goes on showing
  // one option while the native select behind it submits another. After a
  // failed submit there is nothing to reset.
  //
  // With the default prevented and a transition started here, React runs no
  // action of its own and resets nothing; it only shows the form as pending. A
  // success still resets, above, where it clears the values.
  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const form = event.currentTarget
      formRef.current = form
      const submitter = (event.nativeEvent as SubmitEvent).submitter
      const formData = new FormData(form, submitter)
      startTransition(() => {
        formAction(formData)
      })
    },
    [formAction]
  )

  return [formAction, state, isPending, onSubmit] as const
}

// A `select`, `radio` or `chips` whose options are written draws only those
// options, so a value it holds outside them is not on screen, and what the
// browser submits for it is not what the field holds: a native select behind
// the control submits its first option, an option nobody picked, and a radio
// submits nothing. For those fields the submit checks the value the field
// holds, so the field says it is not one of its options and nothing is sent
// in its place. A value it offers, or none, is on screen and sent as the
// control sends it.
function withHeldOptions(
  form: Record<string, unknown>,
  fields: Field[],
  values: Record<string, unknown>,
  sourceTargets?: ReadonlySet<string>
): Record<string, unknown> {
  let held = form
  for (const field of fields) {
    const value = values[field.name]
    const offered = getOfferedValues(field, sourceTargets)
    if (offered && !isOffered(offered, value)) {
      held = held === form ? { ...form } : held
      held[field.name] = value
    }
  }
  return held
}

function buildError(error: unknown, translations?: Record<string, string>) {
  if (error instanceof Error) {
    return [error.message]
  }
  return [translateBuiltIn('Unknown error', translations)]
}

function success<T>(value: Nullable<T>, preserveValues = false): FormState<T> {
  const data = preserveValues ? value : null
  return {
    data,
    error: null,
    success: true,
  }
}

function failure<T>(
  value: Nullable<T>,
  error: Nullable<FormStateError>
): FormState<T> {
  return {
    data: value,
    error,
    success: false,
  }
}
