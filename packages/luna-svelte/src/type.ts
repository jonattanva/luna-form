import type { BaseConfig, FormStateError } from '@luna-form/core'
import type { Component } from 'svelte'

export type AlertProps = Readonly<FormStateError>

export type Config = BaseConfig<Component<Record<string, unknown>>> & {
  alert?: Component<AlertProps>
}
