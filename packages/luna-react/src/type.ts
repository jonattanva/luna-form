import type {
  AriaAttributes,
  BaseConfig,
  CommonProps,
  DataAttributes,
  Field,
  Fields,
  FormStateError,
  Localization,
} from '@luna-form/core'

export type Slot = (props: {
  disabled?: boolean
  fields?: Fields
}) => React.ReactNode

export type Control =
  ((props: { isPending?: boolean }) => React.ReactNode) | React.ReactNode

export type Children = (props: {
  ariaAttributes?: AriaAttributes
  commonProps: CommonProps
  dataAttributes?: DataAttributes
  field: Field
  horizontal?: boolean
  // The form's language and dictionary, which the field's label, description
  // and change events write with.
  localization?: Localization
  readOnly?: boolean
}) => React.ReactNode

export type InputConfig<T extends React.ElementType> = {
  types: string | string[]
  input: React.ComponentProps<T>
}

export type AlertProps = Readonly<FormStateError>

export type Config = BaseConfig<React.ComponentProps<React.ElementType>> & {
  alert?: React.ComponentType<AlertProps>
}

export type InputChange = {
  data?: DataAttributes
  name: string
  type: string
  value: unknown
}
