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
  // A list among a row's fields is a list nested inside this one, which the
  // renderer has always supported: `SlotList` renames it by its dotted path
  // like any other leaf, and it registers and answers under that path. The
  // type left it out, so nothing that walks a row's fields could tell one
  // apart from a plain leaf without the compiler calling the branch dead.
  fields: Array<AnyField | Column | List>
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

// How a form renders text. The two always travel together — `lang` drives the
// locale-derived labels (months, weekdays) and `translations` the dictionary —
// so they are one argument rather than a pair every signature has to repeat and
// every call site has to order correctly.
export type Localization = {
  lang?: string
  translations?: Record<string, string>
}

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
  fields: Array<AnyField | List>
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

/**
 * One row of a list, as a `value` event assigns it.
 *
 * Recursive because a row's leaf can be a list of its own: assigning `groups`
 * a row whose `checks` leaf is a list is assigning that list too, so the tree
 * an event carries is as deep as the lists it is aimed at. That was always
 * reachable through `Record<string, unknown>`, which typechecks a nested array
 * without saying anything about it -- naming it is what makes the contract say
 * out loud how far down an assignment goes.
 */
export type ValueRow = {
  [leaf: string]: Value | ValueRow[] | null | undefined
}

export type ValueEvent = ActionEvent<'value'> & {
  onlyIfTargetEmpty?: boolean
  value: Record<string, Value | ValueRow[]>
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
    /**
     * Marks a field that fires its change events and keeps nothing of its own:
     * not stored, and never reported to the consumer.
     *
     * For a control whose whole job is to act on *another* field -- a button
     * that adds a row, a picker that fills a sibling. Without it the emitter
     * also saves whatever it emitted, so a value the user can neither see nor
     * edit ends up in the submitted form and in whatever the consumer
     * persists.
     *
     * Three consequences to know before reaching for it. The field shows
     * nothing back, because there is no value to show -- put it on a visible
     * text input and the typing will not stick. Choosing the same value twice
     * in a row fires twice, where an ordinary field swallows the second as a
     * no-op: for a command that is the point, since pressing a button again is
     * meant to do the thing again. And it does not go with `required` or
     * `validation`, which would demand a value that by definition never
     * arrives and block the submit with nothing on screen to explain it --
     * nothing stops you writing that pair, so this note is the only thing
     * standing between you and an afternoon.
     */
    transient?: boolean
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
