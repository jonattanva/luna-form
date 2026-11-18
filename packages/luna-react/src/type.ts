import type {
  AriaAttributes,
  BaseConfig,
  CommonProps,
  DataAttributes,
  Field,
  Fields,
  FormStateError,
  Localization,
  ToolSchema,
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
  // The value an agent writes into a field of these types, for a type no
  // built-in one describes. See `defineCustomInput`.
  agent?: InputAgentOptions
  types: string | string[]
  input: React.ComponentProps<T>
}

/** How the tools of a form with `agent` describe a custom type. */
export type InputAgentOptions = Readonly<{
  /**
   * The value the field takes, in the part of JSON Schema every consumer
   * reads. Without it the field takes text.
   */
  schema: ToolSchema
}>

export type AlertProps = Readonly<FormStateError>

export type Config = BaseConfig<React.ComponentProps<React.ElementType>> & {
  // The schema each custom type declares for agents, by type.
  agentTypes?: Readonly<Record<string, ToolSchema>>
  alert?: React.ComponentType<AlertProps>
}

export type InputChange = {
  data?: DataAttributes
  name: string
  type: string
  value: unknown
}
