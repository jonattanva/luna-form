import { useSetAtom } from 'jotai'
import { reportErrorAtom } from '../lib/error-store'
import { clearAllValueAtom } from '../lib/value-store'
import { startTransition, useActionState } from 'react'
import {
  buildSchema,
  flatten,
  getFormData,
  logger,
  translate,
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
    validation = true,
    translations,
  } = options ?? {}

  const setError = useSetAtom(reportErrorAtom)
  const clearValues = useSetAtom(clearAllValueAtom)

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

      const form = getFormData(formData)
      const validated = schema.safeParse(form)

      if (!validated.success) {
        const errors = flatten(validated.error)
        startTransition(() => {
          setError(errors)
        })

        return failure(form as T, {
          description: translate(
            'Please correct the errors and try again.',
            translations
          ),
          details: [],
          title: translate(
            'There were validation errors submitting the form.',
            translations
          ),
        })
      }

      const unflattened = unflatten(form) as F & T

      if (action) {
        try {
          const result = await action(unflattened as F, schema)
          if (!result.success) {
            return failure(unflattened as T, result.error)
          }

          onSuccess?.(result.data as T)
          if (!preserveValues) {
            startTransition(() => {
              clearValues()
            })
          }

          return success(unflattened as T, preserveValues)
        } catch (error) {
          logger.error('Error executing form action:', error)
          return failure(unflattened as T, {
            title: translate(
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

  return [formAction, state, isPending] as const
}

function buildError(error: unknown, translations?: Record<string, string>) {
  if (error instanceof Error) {
    return [error.message]
  }
  return [translate('Unknown error', translations)]
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
