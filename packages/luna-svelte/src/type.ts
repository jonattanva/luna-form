import type {
  AriaAttributes,
  BaseConfig,
  CommonProps,
  DataAttributes,
  Field,
  Fields,
  FormStateError,
  Orientation,
} from '@luna-form/core'
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
      orientation?: Orientation
    },
  ]
>

export type AlertProps = Readonly<FormStateError>

export type Config = BaseConfig<Component<Record<string, unknown>>> & {
  alert?: Component<AlertProps>
}
