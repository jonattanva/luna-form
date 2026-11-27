import type {
  AgentTypes,
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
  // built-in one describes, or `false` to keep every field of them from
  // agents. See `defineCustomInput`.
  agent?: InputAgentOptions | false
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
  // What each custom type says to agents, by type: the schema it declares,
  // or `false` for one kept from them.
  agentTypes?: AgentTypes
  alert?: React.ComponentType<AlertProps>
}

/**
 * Who changed a value: a person in the field (`user`), an agent through the
 * form's tools (`agent`), or a change event of the definition, a `value` that
 * writes it or a `state` that hides it (`event`).
 */
export type ValueSource = 'agent' | 'event' | 'user'

/** A value that changed, as `onValueChange` hands it to the host. */
export type ValueChange = Readonly<{
  name: string
  source: ValueSource
  value: unknown
}>

export type InputChange = ValueChange &
  Readonly<{
    data?: DataAttributes
    type: string
  }>
