import type {
  AriaAttributes,
  CommonProps,
  DataAttributes,
  Field,
  Fields,
  BaseConfig,
  Orientation,
} from '@luna-form/core'

export type Slot = (props: {
  disabled?: boolean
  fields?: Fields
  style?: {
    compact?: boolean
    orientation?: Orientation
  }
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

export type Config = BaseConfig<React.ComponentProps<React.ElementType>>
