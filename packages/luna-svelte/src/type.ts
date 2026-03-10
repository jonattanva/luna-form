import type {
  AriaAttributes,
  BaseConfig,
  CommonProps,
  DataAttributes,
  Field,
  Fields,
  FormStateError,
} from '@luna-form/core'

export type { FormStateError }
import type { Component, Snippet } from 'svelte'

export type Slot = Snippet<
  [
    {
      disabled?: boolean
      fields?: Fields
    },
  ]
>

export type Control = Snippet<[{ isPending?: boolean }]>

export type Children = Snippet<
  [
    {
      ariaAttributes?: AriaAttributes
      commonProps: CommonProps
      dataAttributes?: DataAttributes
      field: Field
      horizontal?: boolean
    },
  ]
>

export type AlertProps = Readonly<FormStateError>

export type Config = BaseConfig<Component<Record<string, unknown>>> & {
  alert?: Component<AlertProps>
}
