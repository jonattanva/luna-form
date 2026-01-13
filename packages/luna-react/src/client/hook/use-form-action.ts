import { useSetAtom } from 'jotai'
import { reportErrorAtom } from '../lib/error-store'
import { clearAllValueAtom } from '../lib/value-store'
import { startTransition, useActionState } from 'react'
import {
  buildSchema,
  flatten,
  getFormData,
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
  validation?: boolean
  value?: Nullable<T>
}

export function useFormState<T, F = Record<string, unknown>>(
  getSchema: () => Schemas,
  action?: (formData: F, schema?: ZodSchema) => Promise<FormState<T>>,
  options?: FormActionOptions<T>
) {
  const {
    onSuccess,
    preserveValues = false,
    validation = true,
    value = null,
  } = options ?? {}

  const setError = useSetAtom(reportErrorAtom)
  const clearValues = useSetAtom(clearAllValueAtom)

  const initialState: FormState<T> = {
    data: value,
    error: null,
    success: false,
  }

  const [state, formAction, isPending] = useActionState(
    async (
      prevState: FormState<T>,
      formData: FormData
    ): Promise<FormState<T>> => {
      const schema = buildSchema(getSchema())
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
          details: errors,
          title: 'There were validation errors submitting the form.',
        })
      }

      if (action) {
        try {
          const result = await action(form as F, schema)
          if (!result.success) {
            return failure(form as T, result.error)
          }

          onSuccess?.(result.data as T)
          if (!preserveValues) {
            startTransition(() => {
              clearValues()
            })
          }

          return success(form as T, preserveValues)
        } catch (error) {
          console.log('Error submitting form action:', error)
          return failure(form as T, {
            title: 'An unexpected error occurred submitting the form.',
            details: buildError(error),
          })
        }
      }

      return success(validated.data as T, preserveValues)
    },
    initialState
  )

  return [formAction, state, isPending] as const
}

function buildError(error: unknown) {
  const detail = error instanceof Error ? error.message : ['Unknown error']
  return Array.isArray(detail) ? detail : [detail]
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
