import type {
  AriaAttributes,
  BaseConfig,
  CommonProps,
  DataAttributes,
  Field,
  Fields,
  FormStateError,
} from '@luna-form/core'

export type Slot = (props: {
  disabled?: boolean
  fields?: Fields
}) => React.ReactNode

export type Children = (props: {
  ariaAttributes?: AriaAttributes
  commonProps: CommonProps
  dataAttributes?: DataAttributes
  field: Field
}) => React.ReactNode

export type InputConfig<T extends React.ElementType> = {
  types: string | string[]
  input: React.ComponentProps<T>
}

export type AlertProps = Readonly<FormStateError>

export type Config = BaseConfig<React.ComponentProps<React.ElementType>> & {
  alert?: React.ComponentType<AlertProps>
}
