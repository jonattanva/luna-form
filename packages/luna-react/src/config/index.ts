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
  type Environment,
  type Protocol,
} from '@luna-form/core'
import type { AlertProps, Config, InputConfig } from '../type'

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

  options.inputs.forEach(({ types, input }) => {
    const type = Array.isArray(types) ? types : [types]
    type.forEach((t) => {
      config.inputs[t] = input
    })
  })

  return config
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

export function defineCustomInput<T extends React.ElementType>(
  types: string | string[],
  input: React.ComponentProps<T>
): InputConfig<T> {
  return createDefineFunction<T>(types)(input)
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
