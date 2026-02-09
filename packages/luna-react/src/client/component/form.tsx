import { FormContent } from './form-content'
import { Provider } from 'jotai'
import type { Config, Control } from '../../type'
import type { Definition, Nullable, Sections, ZodSchema } from '@luna-form/core'
import type { FormState } from '../hook/use-form-action'

export function Form<
  T extends Record<string, unknown> = Record<string, unknown>,
  F = Record<string, unknown>,
>(
  props: Readonly<{
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
  return (
    <Provider>
      <FormContent {...props} />
    </Provider>
  )
}
