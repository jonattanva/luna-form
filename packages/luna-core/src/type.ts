import type { core, z, ZodObject } from 'zod'

export type Schema = z.ZodTypeAny
export type Schemas = Record<string, Schema>
export type ZodSchema = ZodObject<{ [x: string]: Schema }, core.$strip>

export type Nullable<T> = T | null

// `advanced.data` / `advanced.aria` are authored with BARE keys; the runtime
// (`getDataAttributes` / `getAriaAttributes`) prefixes each key with `data-` /
// `aria-` on render. So the authored shape is a plain record — a `data-*`/`aria-*`
// keyed type would be wrong here (it would double-prefix to `data-data-*`).
export type DataAttributes = Record<string, string | number | boolean>

export type AriaAttributes = Record<string, string | number | boolean>

export type Description =
  | string
  | {
      collapsed?: boolean
      message: string
      title: string
    }

export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm a' | 'hh:mm:ss a'
export type DateFormat =
  'yyyy-MM-dd' | 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'MMMM d, yyyy'

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

export type Value = string | number | boolean | Multiple
export type Option = {
  description?: string
  label: string
  value: string
}

export type OptionGroup = {
  items: Option[]
  label: string
}

export type PreviewItem =
  | string
  | {
      field?: string
      label?: string
      when?: string | string[] | Condition
    }

export type List = {
  advanced?: {
    title?: string
    action?: string
    collapsed?: boolean
    length?: Length<number>
    preview?: {
      label?: PreviewItem
      tags?: PreviewItem[]
      badge?: PreviewItem
    }
  }
  description?: string
  fields: Array<AnyField | Column>
  label?: string
  name: string
  type: 'list' | (string & {})
  validation?: {
    length?: Length<string>
  }
} & Base

// The renderable field variants. `Field` is the base shape; the specialized
// variants (`Input`, `Select`, `Chips`, `Date`, `Time`) refine `advanced` with
// type-specific keys (`length`, `transform`, `options`, `format`, …) and, for
// `Select`/`Chips`, add `source`. A JSON form declares those keys directly, so
// `Fields`/`Column`/`List` accept the whole union: a base `Field` alone has a
// weak (all-optional) `advanced`, and a leaf such as a `textarea` carrying
// `advanced.length` would fail the "no properties in common" check against it.
export type AnyField = Field | Input | Select | Chips | Date | Time
export type Fields = Array<AnyField | Column | List>
export type Base = Orderable & Hideable

export type CommonProps = {
  disabled?: boolean
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
}

export type Section = {
  advanced?: {
    collapsible?: boolean
    compact?: boolean
    separator?: boolean
  }
  description?: string
  fields?: Fields
  id?: string | number
  title?: string
} & Base

export type Column = {
  advanced?: {
    cols?: number
  }
  description?: Description
  fields: Array<AnyField>
  type: 'column' | (string & {})
} & Base

export type Operator =
  | 'eq'
  | 'neq'
  | 'in'
  | 'nin'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'exists'
  | 'empty'
  | 'truthy'

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
  description?: Description
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
  onlyIfTargetEmpty?: boolean
  value: Record<string, Value | Array<Record<string, unknown>>>
}

export type StateEvent = ActionEvent<'state'> & {
  state: FieldState
  target: string | string[]
  when?: string | string[] | Condition
}

export type ChangeEvent = Array<SourceEvent | ValueEvent | StateEvent>

// A condition evaluated against sibling data (item scope inside lists, root
// otherwise). Shares the `Condition` shape so `evaluateCondition` can reuse it.
export type WhenRule = {
  field: string
  operator?: Operator
  value?: string | number | boolean | Array<string | number>
  message?: string
}

// Regex/format assertion. `allowInterpolation` skips the check when the value
// is an interpolation template (e.g. `@{...}`), mirroring how http URLs allow
// dynamic values to bypass the `https?://` scheme check.
export type PatternRule = {
  regex: string
  flags?: string
  message?: string
  allowInterpolation?: boolean
}

export type WhenClause =
  WhenRule | WhenRule[] | { all?: WhenRule[]; any?: WhenRule[] }

// General declarative rule: assert something about a field's value, optionally
// gated by a `when` condition over sibling data.
export type AssertRule = {
  when?: WhenClause
  assert:
    'required' | 'minItems' | 'maxItems' | 'pattern' | 'oneOf' | 'min' | 'max'
  value?: string | number | Array<string | number> | PatternRule
  message: string
}

export type Validation = {
  custom?: CustomValidation | Array<CustomValidation>
  email?: string
  length?: Length<string>
  required?: string
  // Field is required only when the condition(s) hold. Multiple rules OR together.
  requiredWhen?: WhenRule | Array<WhenRule>
  pattern?: PatternRule
  // Escape-hatch-in-JSON: a general list of gated assertions (see AssertRule).
  rules?: Array<AssertRule>
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
  defaultValue?: Value
  event?: {
    change?: ChangeEvent
  }
  description?: Description
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

export type Transform =
  'lowercase' | 'uppercase' | 'remove-space' | 'remove-accent'

export type Input = Field & {
  advanced?: {
    length?: Length<number>
    transform?: Transform | Transform[]
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

export type Chips = Select & {
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
