import { useSetAtom, useStore } from 'jotai'
import { reportErrorAtom } from '../lib/error-store'
import { valueAtom } from '../lib/value-store'
import {
  mountedListsAtom,
  translateRows,
  type MountedList,
} from '../lib/list-store'
import {
  startTransition,
  useActionState,
  useCallback,
  type FormEvent,
} from 'react'
import {
  buildSchema,
  flatten,
  getFormData,
  withHeldOptions,
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
  // What the action answers as a success starts the form over: whoever renders
  // the form mounts it anew, on a store of its own. See `Form`.
  onReset?: () => void
  translations?: Record<string, string>
  validation?: boolean
}

export function useFormState<T, F = Record<string, unknown>>(
  getSchema: () => readonly [
    Schemas,
    Field[],
    Array<{ name: string; offered: ReadonlySet<string> }>,
  ],
  action?: (formData: F, schema?: ZodSchema) => Promise<FormState<T>>,
  options?: FormActionOptions<T>
) {
  const { onReset, onSuccess, validation = true, translations } = options ?? {}

  const store = useStore()
  const setError = useSetAtom(reportErrorAtom)

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
      const [schemas, fields, options] = getSchema()
      const schema = buildSchema(schemas, fields, translations)

      // What the action answers ends the submission the same way whether the
      // form checked what it sends or not: a success is told and starts the
      // form over, a failure is shown, and a throw is caught.
      const answer = async (
        run: NonNullable<typeof action>,
        input: F
      ): Promise<FormState<T>> => {
        try {
          const result = await run(input, schema)
          if (!result.success) {
            return failure(result.error)
          }

          onSuccess?.(result.data as T)
          startTransition(() => {
            onReset?.()
          })

          return success()
        } catch (error) {
          logger.error('Error executing form action:', error)
          return failure({
            title: translateBuiltIn(
              'An unexpected error occurred submitting the form.',
              translations
            ),
            details: buildError(error, translations),
          })
        }
      }

      // Nothing checked: the action is handed the raw `FormData`, for a form
      // whose action parses it itself. With no action there is nothing to do.
      if (validation === false) {
        return action ? answer(action, formData as F) : prevState
      }

      // A date leaves the schema as `yyyy-MM-dd` whatever the field showed, so
      // what is sent below is what the schema returns, not what was submitted.
      const values = store.get(valueAtom)
      const form = withHeldOptions(
        byRowId(getFormData(formData), store.get(mountedListsAtom)),
        options.map(({ name, offered }) => ({
          name,
          offered,
          value: values[name],
        }))
      )
      const validated = schema.safeParse(form)

      if (!validated.success) {
        const errors = flatten(validated.error)
        startTransition(() => {
          setError(errors)
        })

        return failure({
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

      if (!action) {
        return success()
      }

      const unflattened = unflatten(
        validated.data as Record<string, unknown>
      ) as F
      return answer(action, unflattened)
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
  // success starts the form over, above, through `onReset`.
  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const form = event.currentTarget
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

// What the form sends, under the names the store and the schema know it by.
//
// A control is named with each row at its position, as the consumer sees it,
// while every field is registered, checked and holding its value under the id
// its row keeps for as long as it lives. The ids go back in here, once, and the
// rest of the submit reads one naming. `unflatten` drops them again on the way
// out: it closes the gaps they leave, so the action is handed rows by position.
function byRowId(
  data: Record<string, unknown>,
  mounted: Readonly<Record<string, MountedList>>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).map(([name, value]) => [
      translateRows(name, mounted, 'id') ?? name,
      value,
    ])
  )
}

function buildError(error: unknown, translations?: Record<string, string>) {
  if (error instanceof Error) {
    return [error.message]
  }
  return [translateBuiltIn('Unknown error', translations)]
}

function success<T>(): FormState<T> {
  return {
    data: null,
    error: null,
    success: true,
  }
}

function failure<T>(error: Nullable<FormStateError>): FormState<T> {
  return {
    data: null,
    error,
    success: false,
  }
}
