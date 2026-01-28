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

export type DataSource = {
  url: string
  body?: BodyInit | Record<string, unknown>
  cache?: RequestCache
  headers?: HeadersInit
  method?: string
  namespace?: string
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

export type Sections = Array<Section>
export type Value = string | number | readonly string[]
export type Option = {
  label: string
  value: string
}
export type Fields = Array<Field | Column>
export type Base = Orderable & Hideable

export type CommonProps = {
  disabled?: boolean
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
}

export type Section = {
  compact?: boolean
  description?: string
  fields?: Fields
  id?: string | number
  separator?: boolean
  title?: string
} & Base

export type Column = {
  advanced?: {
    cols?: number
  }
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
  target: string
  when?: string | string[] | Condition
}

export type ChangeEvent = Array<SourceEvent | ValueEvent | StateEvent>

export type Orientation = 'horizontal' | 'vertical'

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
    orientation?: Orientation
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
  title: string
  description?: string
  details?: Nullable<Record<string, string[]> | string[]>
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
  orientation?: Orientation
}
