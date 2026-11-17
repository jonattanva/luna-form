import { FormContent } from './form-content'
import { Provider } from 'jotai'
import type { Config, Control } from '../../type'
import type { Definition, Nullable, Sections, ZodSchema } from '@luna-form/core'
import type { AgentOptions } from '../lib/agent-tools'
import type { FormState } from '../hook/use-form-action'

export function Form<
  T extends Record<string, unknown> = Record<string, unknown>,
  F = Record<string, unknown>,
>(
  props: Readonly<{
    advanced?: {
      step?: boolean
    }
    action?: (formData: F, schema?: ZodSchema) => Promise<FormState<T>>
    /**
     * Offers the form to AI agents as tools: through WebMCP when the browser
     * has it, and through `listTools()` and `callTool()` always. See
     * `docs/agents/tools.md`.
     */
    agent?: AgentOptions
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
