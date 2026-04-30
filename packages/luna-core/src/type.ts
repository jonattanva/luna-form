import type { core, z, ZodObject } from 'zod'

export type Schema = z.ZodTypeAny
export type Schemas = Record<string, Schema>
export type ZodSchema = ZodObject<{ [x: string]: Schema }, core.$strip>

export type Nullable<T> = T | null

export type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean
}

export type AriaAttributes = {
  [key: `aria-${string}`]: string | number | boolean
}

export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm a' | 'hh:mm:ss a'
export type DateFormat = 'yyyy-MM-dd' | 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'MMMM d, yyyy'

export type DataSource = {
  body?: BodyInit | Record<string, unknown>
  cache?: RequestCache
  headers?: HeadersInit
  method?: string
  namespace?: string
  url: string
}

export type Source = {
  [key: string]: DataSource | Array<unknown>
}

export type Definition = Record<string, unknown>

export type Orderable = {
  order?: number
}

export type Hideable = {
  hidden?: boolean
}

export type Sections = Section[]
export type Multiple = readonly (string | number | boolean)[]

export type Value = string | number | Multiple
export type Option = {
  description?: string
  label: string
  value: string
}

export type OptionGroup = {
  items: Option[]
  label: string
}

export type List = {
  advanced?: {
    action?: string
    length?: Length<number>
  }
  description?: string
  fields: Array<Field | Column>
  label?: string
  name: string
  type: 'list' | (string & {})
} & Base

export type Fields = Array<Field | Column | List>
export type Base = Orderable & Hideable

export type CommonProps = {
  disabled?: boolean
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
}

export type Section = {
  advanced?: boolean
  compact?: boolean
  description?: string
  fields?: Fields
  id?: string | number
  separator?: boolean
  step?: number
  title?: string
} & Base

export type Column = {
  advanced?: {
    cols?: number
  }
  description?: string
  fields: Array<Field>
  type: 'column' | (string & {})
} & Base

export type Operator = 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte'

export type Condition = {
  field?: string
  operator?: Operator
  value: string | number | string[]
}

export type CustomValidation = {
  field: string
  message?: string
  operator?: Operator
}

export type FieldState = {
  disabled?: boolean
  hidden?: boolean
}

export type ActionEvent<T> = {
  action: T
}

export type SourceEvent = ActionEvent<'source'> & {
  source: DataSource
  target: string
}

export type ValueEvent = ActionEvent<'value'> & {
  value: Record<string, Value | Array<Record<string, unknown>>>
}

export type StateEvent = ActionEvent<'state'> & {
  state: FieldState
  target: string | string[]
  when?: string | string[] | Condition
}

export type ChangeEvent = Array<SourceEvent | ValueEvent | StateEvent>

export type Validation = {
  custom?: CustomValidation | Array<CustomValidation>
  email?: string
  length?: Length<string>
  required?: string
}

export type Field = CommonProps & {
  advanced?: {
    aria?: AriaAttributes
    autocomplete?: string
    cols?: number
    data?: DataAttributes
    entity?: string
    horizontal?: boolean
    reverse?: boolean
  }
  event?: {
    change?: ChangeEvent
  }
  description?: string
  fields?: never
  label?: string
  name: string
  readonly?: boolean
  type: string
  validation?: Validation
} & Base

export type Length<T> = {
  max?: T
  min?: T
}

export type Input = Field & {
  advanced?: {
    length?: Length<number>
  }
}

export type Select = Field & {
  advanced?: {
    autocomplete?: never
    length?: Length<number | string>
    options?: Option
    preselected?: boolean
  }
  source?: DataSource | Array<unknown>
}

export type Chips = Field & {
  advanced?: {
    multiple?: boolean
  }
}

type TemporalField<T> = Field & {
  advanced?: {
    format?: T
  }
}

export type Date = TemporalField<DateFormat>
export type Time = TemporalField<TimeFormat>

export type Environment = {
  [key: string]: Value
}

export type Protocol = 'http' | 'https'

export type RemotePattern = {
  hostname?: string
  port?: number
  protocol?: Protocol
}

export type FormStateError = {
  description?: string
  details?: Nullable<Record<string, string[]> | string[]>
  title: string
}

export type BaseConfig<T> = {
  env?: Environment
  fetcher: {
    provider: <T>(dataSource: DataSource) => Promise<T>
    remotePatterns?: Array<RemotePattern>
  }
  inputs: {
    [key: string]: T
  }
  style?: Style
  validation: {
    blur?: boolean
    change?: boolean
    showError?: boolean
    submit?: boolean
  }
}

export type Style = {
  compact?: boolean
  horizontal?: boolean
  showOptionalLabel?: boolean
}

export type Filterable = Base & { fields?: Filterable[] }

export type TimezoneItem = {
  label: string
  value: string
}

export type TimezoneGroup = {
  items: TimezoneItem[]
  label: string
}
