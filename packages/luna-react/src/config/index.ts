import {
  CHECKBOX,
  CHIPS,
  CHIPS_DAYS,
  CHIPS_MONTHS,
  INPUTS,
  RADIO,
  SELECTS,
  TEXTAREA,
  fetcher,
  logger,
  type Environment,
  type Protocol,
  type ToolSchema,
} from '@luna-form/core'
import type {
  AlertProps,
  Config,
  InputAgentOptions,
  InputConfig,
} from '../type'

// For whoever writes the component a date field renders with: it reads back
// what the form put on its props. Exported beside `defineCustomInput`, which is
// where that component is registered.
export { readDateProps, type DateProps } from '@luna-form/core'

const DEFAULT_VALIDATION = {
  blur: true,
  change: true,
  showError: true,
  submit: true,
}

export function defineConfig<T extends React.ElementType>(
  options: Readonly<{
    alert?: React.ComponentType<AlertProps>
    env?: Environment
    fetcher?: {
      remotePatterns?: Array<{
        hostname?: string
        port?: number
        protocol?: Protocol
      }>
    }
    inputs: Array<InputConfig<T>>
    style?: {
      compact?: boolean
      horizontal?: boolean
      showOptionalLabel?: boolean
    }
    validation?: {
      blur?: boolean
      change?: boolean
      showError?: boolean
      submit?: boolean
    }
  }>
): Config {
  const config = {
    alert: options.alert,
    env: options.env,
    fetcher: {
      provider: fetcher,
      remotePatterns: options.fetcher?.remotePatterns,
    },
    inputs: {},
    style: options.style,
  } as Config

  // Merged, not replaced. Passing one key used to turn the other three off:
  // `{ submit: false }` also stopped the form validating on blur and on change
  // and took away its error summary, with nothing on screen to say why. Whoever
  // passes all four notices no difference; whoever passes fewer gets what they
  // wrote.
  config.validation = { ...DEFAULT_VALIDATION, ...options.validation }

  // The language lives in the form's `lang`, which also picks its translations
  // and names its months; an `env.locale` left from before formats nothing.
  if (options.env && 'locale' in options.env) {
    logger.warn(
      'env.locale is no longer read: pass the language to the form as lang'
    )
  }

  // The last registration of a type is the one it renders with, so it is the
  // one that says what an agent writes into it, that no agent may, or neither.
  const agentTypes: Record<string, ToolSchema | false> = {}
  options.inputs.forEach(({ agent, types, input }) => {
    const type = Array.isArray(types) ? types : [types]
    type.forEach((t) => {
      config.inputs[t] = input
      if (agent === false) {
        agentTypes[t] = false
      } else if (agent && holdsValues(t, agent.schema)) {
        agentTypes[t] = agent.schema
      } else {
        delete agentTypes[t]
      }
    })
  })

  if (Object.keys(agentTypes).length > 0) {
    config.agentTypes = agentTypes
  }

  return config
}

// A field holds a value or a list of values, never an object: a schema that
// asks for one could be described to an agent and never written.
function holdsValues(type: string, schema: ToolSchema): boolean {
  const item = schema.type === 'array' ? schema.items : schema
  if (item && item.type !== 'object' && item.type !== 'array') {
    return true
  }

  logger.warn(
    `The agent schema of "${type}" is left out: a field holds a value, or a list of values its items describe.`
  )
  return false
}

export const defineCheckbox = createDefineFunction([CHECKBOX])
export const defineChips = createDefineFunction([
  CHIPS,
  CHIPS_DAYS,
  CHIPS_MONTHS,
])
export const defineInput = createDefineFunction(INPUTS)
export const defineRadio = createDefineFunction([RADIO])
export const defineSelect = createDefineFunction(SELECTS)
export const defineTextArea = createDefineFunction([TEXTAREA])

/**
 * Registers a component under types of your own. For a form offered to agents,
 * `options.agent.schema` is the value an agent writes into a field of those
 * types; without it such a field takes text. `options.agent: false` keeps
 * every field of them out of the tools of every form, as a password is. See
 * `docs/agents/tools.md`.
 */
export function defineCustomInput<T extends React.ElementType>(
  types: string | string[],
  input: React.ComponentProps<T>,
  options?: Readonly<{ agent?: InputAgentOptions | false }>
): InputConfig<T> {
  const config = createDefineFunction<T>(types)(input)
  return options?.agent === undefined
    ? config
    : { ...config, agent: options.agent }
}

function createDefineFunction<T extends React.ElementType>(
  types: string | string[]
) {
  return (input: React.ComponentProps<T>): InputConfig<T> => {
    return {
      types,
      input,
    }
  }
}
