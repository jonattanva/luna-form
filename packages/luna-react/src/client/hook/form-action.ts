import { buildFormData, buildSchema, flatten } from '@luna-form/core'
import { reportErrorAtom } from '../lib/error-store'
import { startTransition } from 'react'
import { useSetAtom } from 'jotai'
import type { Schemas } from '@luna-form/core'

export function useFormAction(
  getSchema: () => Schemas,
  action?: (formData: FormData) => Promise<void> | void,
  options?: {
    enabled?: boolean
  }
) {
  const { enabled = true } = options ?? {}

  const setError = useSetAtom(reportErrorAtom)

  async function formAction(formData: FormData) {
    if (enabled === false) {
      if (action) {
        await action(formData)
      }
      return
    }

    const schemas = getSchema()
    const schema = buildSchema(schemas)

    const form = Object.fromEntries(formData)
    const validated = schema.safeParse(form)

    if (!validated.success) {
      const pretty = flatten(validated.error)
      startTransition(() => {
        setError(pretty)
      })
      return
    }

    if (action) {
      const formData = buildFormData(validated.data)
      await action(formData)
    }
  }

  return [formAction] as const
}
