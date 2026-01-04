import {
  CHECKBOX,
  INPUTS,
  RADIO,
  SELECTS,
  TEXTAREA,
  fetcher,
  type Environment,
  type Orientation,
  type Protocol,
} from '@luna-form/core'
import type { Config, InputConfig } from '../type'

export function defineConfig<T extends React.ElementType>(
  options: Readonly<{
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
      orientation?: Orientation
    }
    validation?: {
      blur?: boolean
      change?: boolean
      submit?: boolean
    }
  }>
): Config {
  const config = {
    env: options.env,
    fetcher: {
      provider: fetcher,
      remotePatterns: options.fetcher?.remotePatterns,
    },
    inputs: {},
    style: options.style,
  } as Config

  config.validation = options.validation ?? {
    blur: true,
    change: true,
    submit: true,
  }

  options.inputs.forEach(({ types, input }) => {
    const type = Array.isArray(types) ? types : [types]
    type.forEach((t) => {
      config.inputs[t] = input
    })
  })

  return config
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

export const defineCheckbox = createDefineFunction([CHECKBOX])
export const defineInput = createDefineFunction(INPUTS)
export const defineRadio = createDefineFunction([RADIO])
export const defineSelect = createDefineFunction(SELECTS)
export const defineTextArea = createDefineFunction([TEXTAREA])

export function defineCustomInput<T extends React.ElementType>(
  types: string | string[],
  input: React.ComponentProps<T>
): InputConfig<T> {
  return {
    types,
    input,
  }
}
