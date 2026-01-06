import { useSetAtom } from 'jotai'
import { reportErrorAtom } from '../lib/error-store'
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
  onError?: (error: Nullable<FormStateError>) => void
  onSuccess?: (data: T) => void
  validation?: boolean
  value?: Nullable<T>
}

export function useFormState<T>(
  getSchema: () => Schemas,
  action?: <K>(formData: K, schema?: ZodSchema) => Promise<FormState<T>>,
  options?: FormActionOptions<T>
) {
  const { validation = true, onSuccess, onError, value = null } = options ?? {}

  const setError = useSetAtom(reportErrorAtom)

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
          return await action(formData, schema)
        }
        return prevState
      }

      const form = getFormData(formData)
      const validated = schema.safeParse(form)

      if (!validated.success) {
        const errors = flatten(validated.error)
        startTransition(() => {
          setError(errors)
          onError?.({
            title: 'There were validation errors submitting the form.',
            detail: errors,
          })
        })

        return {
          data: form as T,
          error: {
            title: 'There were validation errors submitting the form.',
            detail: errors,
          },
          success: false,
        }
      }

      if (action) {
        try {
          const result = await action(form, schema)
          if (result.success) {
            onSuccess?.(result.data as T)
          } else if (result.error) {
            startTransition(() => {
              onError?.(result.error)
            })
          }
          return result
        } catch (error) {
          const detail =
            error instanceof Error ? [error.message] : ['Unknown error']

          return {
            data: form as T,
            error: {
              title: 'An unexpected error occurred submitting the form.',
              detail,
            },
            success: false,
          }
        }
      }

      return {
        data: validated.data as T,
        error: null,
        success: true,
      }
    },
    initialState
  )

  return [formAction, state, isPending] as const
}
