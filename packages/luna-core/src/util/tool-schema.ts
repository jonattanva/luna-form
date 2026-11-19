import { buildLengthLimits, buildNumberStep } from './build'
import {
  buildDateLimits,
  buildYearLimits,
  getMonth,
  getTimeFormat,
  getWeekDays,
} from './date'
import {
  isCheckbox,
  isChips,
  isChipsDays,
  isChipsMonths,
  isColumn,
  isDate,
  isDateRange,
  isEmail,
  isField,
  isList,
  isNumber,
  isOptions,
  isPassword,
  isSelectActive,
  isSelectDay,
  isSelectMonth,
  isSelectTimezone,
  isSelectYear,
  isTime,
} from './is-input'
import { getListBounds } from './list'
import { resolveTarget } from './path'
import { prepare } from './prepare'
import {
  collectSourceEvents,
  getOfferedOptions,
  withoutDeclarativeRules,
} from './schema'
import { isInterpolated } from './string'
import { translateOptional } from './translate'
import type {
  Date as DateField,
  Definition,
  Description,
  Field,
  Fields,
  List,
  Localization,
  Sections,
  Select,
  WhenRule,
} from '../type'

/**
 * A tool's input as JSON Schema, in the part of it every consumer reads:
 * WebMCP, MCP, and the model APIs, one of which takes only a subset of
 * OpenAPI. There is no `oneOf`, `const`, `$ref` or `multipleOf`: what they
 * would say goes in `description`.
 */
export type ToolSchema = Readonly<{
  additionalProperties?: false
  description?: string
  enum?: readonly string[]
  format?: 'date' | 'email'
  items?: ToolSchema
  maxItems?: number
  maxLength?: number
  maximum?: number
  minItems?: number
  minLength?: number
  minimum?: number
  pattern?: string
  properties?: Readonly<Record<string, ToolSchema>>
  required?: readonly string[]
  title?: string
  type: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
}>

export type ToolSchemaOptions = Readonly<{
  context?: Record<string, unknown>
  definition?: Definition
  localization?: Localization
  // The schema of each custom type, by type, for the fields no built-in type
  // describes. Without one such a field takes text.
  types?: Readonly<Record<string, ToolSchema>>
  // Whether a submit checks the values against the form's rules:
  // `validation.submit`. When it does not, the schema holds no rule only a
  // submit checks.
  validates?: boolean
}>

export type ToolSchemaResult = Readonly<{
  // The lists that keep the rows they have, by their whole name, through the
  // first row of a list they are in: a person can neither add nor remove one.
  fixed: readonly string[]
  // The fields whose options are not in the schema -- too many to list, or
  // only known at run time -- by their whole name.
  lookup: readonly string[]
  // The fields whose change fetches a field's options, by the target of the
  // `source` event as written. See `collectSourceEvents`.
  sources: Readonly<Record<string, readonly string[]>>
  // The fields a submit needs, at the top level. The schema does not mark
  // them: a fill names only the fields it changes.
  required: readonly string[]
  schema: ToolSchema
}>

// How many options a field lists in its schema. Past this a country or a time
// zone would be most of what an agent reads on every turn, so they are looked
// up instead.
const INLINE_OPTIONS = 25

// How much of a label and a description the schema keeps, and how long the
// list of a field's options can be for the schema to hold it. They come from
// the definition, and from the host through `#/context/` and the dictionary,
// which can hold text people wrote: a long one would be room for instructions
// in what every agent reads first. An option is never cut, since an agent
// names it by its value or its label: a field whose options do not fit is
// looked up instead, through a tool whose answer is marked as untrusted. What
// the form shows is not cut either.
const LABEL_LENGTH = 200
const DESCRIPTION_LENGTH = 500
const OPTIONS_LENGTH = 1000

const LOOKUP =
  'Its options are not listed here: find them with the options tool of this form.'

// What a schema cannot declare: a key for one leaf of one row. `name` is the
// list's whole name, through the first row of a list it is in.
function describeRoutes(name: string): string {
  const route = name.replace(/\.0\./g, '.<row>.')
  return `Sending the list replaces its rows. To write one field of one row, send its route instead, the row counted from 0: ${route}.<row>.<field>.`
}

// A bound the form cannot read refuses whatever is written, and lets an
// optional field through only empty.
const UNREADABLE =
  'The form cannot read its bounds, so the submit refuses any value for it.'

// A `state` event that makes a slot available: shows it, unlocks it, or both.
// Kept under the slot it reaches, by the name the form resolves the event's
// target to from `source`, the field whose change fires it.
type Revealer = Readonly<{
  field: Field
  shows: boolean
  source: string
  unlocks: boolean
}>

// What the walk carries from one level to the next.
type Walk = Readonly<{
  dictionary?: Record<string, string>
  fixed: Set<string>
  lang?: string
  lookup: Set<string>
  // By the slot they reach.
  revealers: ReadonlyMap<string, readonly Revealer[]>
  sourceTargets: ReadonlySet<string>
  types?: Readonly<Record<string, ToolSchema>>
  validates: boolean
  // The slots whose writability is being decided, so that two fields that
  // reveal each other answer no instead of asking forever.
  visiting: Set<string>
  // What `isWritable` decided for each slot. See there.
  writable: Map<Field | List, boolean>
}>

// Keyed in a `Map`: a field named `__proto__` assigned to a plain object
// reaches its prototype's setter instead of becoming a property.
type Level = Readonly<{
  properties: Map<string, ToolSchema>
  required: Set<string>
}>

/**
 * The input schema of a tool that fills a form, from the definition that
 * renders it: one property per field an agent may write, in the order the form
 * shows them, keyed by the name the form submits.
 *
 * It reads the definition the way the form does -- `$ref`s resolved, every
 * level sorted by `order`, columns merged into the level that holds them,
 * lists as arrays of rows -- and the same options, bounds and formats the
 * submit checks. What JSON Schema cannot say, or says in keywords some
 * consumer does not read, goes in each field's `description`.
 *
 * The same definition in the same language gives the same schema, byte for
 * byte: nothing in it depends on the time or on what a person typed. A tool
 * registered with it is not registered again for nothing, and a model that
 * caches the start of its prompt keeps the cache.
 */
export function buildToolSchema(
  sections: Sections,
  options: ToolSchemaOptions = {}
): ToolSchemaResult {
  const fields = prepare(sections, options.definition, options.context).flatMap(
    (section) => prepare(section.fields)
  )

  const sources = collectSourceEvents(fields)
  const walk: Walk = {
    dictionary: options.localization?.translations,
    fixed: new Set(),
    lang: options.localization?.lang,
    lookup: new Set(),
    revealers: collectRevealers(fields),
    sourceTargets: new Set(sources.keys()),
    types: options.types,
    validates: options.validates !== false,
    visiting: new Set(),
    writable: new Map(),
  }

  const level = buildLevel(fields, walk, '')
  return {
    fixed: [...walk.fixed],
    lookup: [...walk.lookup],
    required: [...level.required],
    sources: Object.fromEntries(sources),
    schema: {
      additionalProperties: false,
      properties: Object.fromEntries(level.properties),
      type: 'object',
    },
  }
}

// One level of the form: the top, or a list's row. `prefix` names a row the
// way the rendered form does (`shipping.0.`), so an event's target matches the
// same field here as it does there.
//
// Two fields under one name hold one value, as they do in the form: the first
// the agent may write describes it, and it is required when either is.
function buildLevel(fields: Fields, walk: Walk, prefix: string): Level {
  const properties = new Map<string, ToolSchema>()
  const required = new Set<string>()

  const visit = (entries: Fields): void => {
    for (const entry of prepare(entries)) {
      if (isColumn(entry)) {
        visit(entry.fields)
        continue
      }

      const name = `${prefix}${entry.name}`
      if (!isWritable(entry, walk, name)) {
        continue
      }

      const described = properties.has(entry.name)
      if (isList(entry)) {
        const list = buildList(entry, walk, name)
        if (!described) {
          properties.set(entry.name, list.schema)
        }
        if (list.required) {
          required.add(entry.name)
        }
        continue
      }

      if (!described) {
        properties.set(entry.name, buildLeaf(entry, walk, name))
      }
      // A field nothing shows or unlocks yet is not required yet, as the submit
      // reads it. Its note says when it will be.
      if (entry.required && !entry.hidden && !entry.disabled) {
        required.add(entry.name)
      }
    }
  }

  visit(fields)
  return { properties, required }
}

// Whether an agent may write the slot: it is not kept from it, it holds a
// value of its own that a person could change, and it is on screen and
// unlocked, or a field the agent may write can make it so.
//
// Asked again for each revealer, each note and each slot that names the same
// source, so the answer is kept. Only an answer reached with nothing else being
// decided, though: one reached inside a loop of revealers counts the slot that
// started it as not writable, which it may yet turn out to be.
function isWritable(slot: Field | List, walk: Walk, name: string): boolean {
  const known = walk.writable.get(slot)
  if (known !== undefined) {
    return known
  }

  if (walk.visiting.has(name)) {
    return false
  }

  const outermost = walk.visiting.size === 0
  const writable = decideWritable(slot, walk, name)
  if (outermost) {
    walk.writable.set(slot, writable)
  }
  return writable
}

function decideWritable(slot: Field | List, walk: Walk, name: string): boolean {
  walk.visiting.add(name)
  try {
    if (slot.advanced?.agent === false) {
      return false
    }

    if (
      isField(slot) &&
      (isPassword(slot) || slot.advanced?.transient || slot.readonly)
    ) {
      return false
    }

    if (slot.hidden && !findRevealer(walk, name, 'shows')) {
      return false
    }

    return !(
      isField(slot) &&
      slot.disabled &&
      !findRevealer(walk, name, 'unlocks')
    )
  } finally {
    walk.visiting.delete(name)
  }
}

// A field the agent may write whose change shows, or unlocks, the slot.
function findRevealer(
  walk: Walk,
  name: string,
  does: 'shows' | 'unlocks'
): Revealer | undefined {
  return walk.revealers
    .get(name)
    ?.find(
      (revealer) =>
        revealer[does] && isWritable(revealer.field, walk, revealer.source)
    )
}

// A list as rows. The rendered list always holds `min` rows, one when it
// declares none, and a submit checks the required leaves of each: a list is
// required when its rows have one.
function buildList(
  list: List,
  walk: Walk,
  name: string
): Readonly<{ required: boolean; schema: ToolSchema }> {
  const row = buildLevel(list.fields, walk, `${name}.0.`)
  const { max, min } = getListBounds(list)

  const notes: string[] = []
  if (list.advanced?.fixed) {
    walk.fixed.add(name)
    notes.push('It keeps the rows it has: send each of them, in order.')
  }
  notes.push(describeRoutes(name))
  notes.push(...availabilityNotes(list, walk, name))

  const schema = withText(
    {
      items: {
        additionalProperties: false,
        properties: Object.fromEntries(row.properties),
        ...(row.required.size > 0 && { required: [...row.required] }),
        type: 'object',
      },
      ...(Number.isFinite(max) && { maxItems: max }),
      minItems: min,
      type: 'array',
    },
    list,
    notes,
    walk
  )

  return {
    required: !list.hidden && min > 0 && row.required.size > 0,
    schema,
  }
}

function buildLeaf(field: Field, walk: Walk, name: string): ToolSchema {
  // A submit that checks nothing has none of the rules only a submit checks.
  const checked = walk.validates ? field : withoutDeclarativeRules(field)
  const notes: string[] = []
  const schema = describeValue(checked, walk, name, notes)

  notes.push(
    ...availabilityNotes(field, walk, name),
    ...ruleNotes(checked, walk, name !== field.name)
  )
  return withText(schema, field, notes, walk)
}

// The value a field holds, by type. The order matters where types overlap:
// `select/month` is a `select` too, and `chips/day` a `chips`.
function describeValue(
  field: Field,
  walk: Walk,
  name: string,
  notes: string[]
): ToolSchema {
  // A type the host declares a schema for is described by it, a built-in one
  // too: the host knows what its own component takes. Only a type it names
  // itself: `toString` is no schema.
  const types = walk.types
  if (types && Object.prototype.hasOwnProperty.call(types, field.type)) {
    return types[field.type]
  }

  // A required checkbox is a box someone has to tick: the submit takes `true`
  // only. A Yes/No answers either way.
  if (isCheckbox(field) || isSelectActive(field)) {
    if (isCheckbox(field) && field.required) {
      notes.push('Required to be true.')
    }
    return { type: 'boolean' }
  }

  if (isDate(field)) {
    return describeDate(field, notes)
  }

  if (isTime(field)) {
    // Written the way a time input takes it, whatever format the field shows.
    const seconds = getTimeFormat(field).includes('ss')
    notes.push(`A time of day, 24-hour, as ${seconds ? 'HH:mm:ss' : 'HH:mm'}.`)
    return {
      pattern: seconds ? '^\\d{2}:\\d{2}:\\d{2}$' : '^\\d{2}:\\d{2}$',
      type: 'string',
    }
  }

  if (isEmail(field)) {
    return { ...describeText(field, notes), format: 'email' }
  }

  if (isNumber(field)) {
    return describeNumber(field, notes)
  }

  if (isSelectMonth(field)) {
    notes.push(describeOptions(getMonth(walk.lang)))
    return { maximum: 12, minimum: 1, type: 'integer' }
  }

  if (isSelectYear(field)) {
    const { max, min } = buildYearLimits(field)
    if (min === undefined || max === undefined) {
      notes.push('It offers no year: the form does not give it both bounds.')
    }
    return {
      ...(min !== undefined && { minimum: min }),
      ...(max !== undefined && { maximum: max }),
      type: 'integer',
    }
  }

  if (isSelectDay(field)) {
    return describeEnum(getWeekDays(walk.lang), notes)
  }

  if (isSelectTimezone(field)) {
    walk.lookup.add(name)
    notes.push('A time zone by its IANA name, such as America/Bogota.', LOOKUP)
    return { type: 'string' }
  }

  if (isChipsDays(field) || isChipsMonths(field)) {
    const days = isChipsDays(field)
      ? getWeekDays(walk.lang)
      : getMonth(walk.lang)
    return {
      items: describeEnum(days, notes),
      ...(field.required && { minItems: 1 }),
      type: 'array',
    }
  }

  if (isOptions(field)) {
    return describeChoice(field, walk, name, notes)
  }

  return describeText(field, notes)
}

function describeDate(field: DateField, notes: string[]): ToolSchema {
  const { max, min, reserved, unreadable } = buildDateLimits(field)
  const range = isDateRange(field)

  if (unreadable) {
    notes.push(UNREADABLE)
  } else if (min !== undefined || max !== undefined) {
    notes.push(
      `Days ${[min && `from ${min}`, max && `until ${max}`]
        .filter(Boolean)
        .join(' ')}.`
    )
  }

  // A range is checked day by day: a reserved day between its ends refuses it
  // as much as one at either end.
  if (reserved.length > 0) {
    notes.push(
      range
        ? `No day from the first to the last may be one of these: ${reserved.join(', ')}.`
        : `Not these days: ${reserved.join(', ')}.`
    )
  }

  const day: ToolSchema = { format: 'date', type: 'string' }
  if (range) {
    notes.push('The first and the last day, as yyyy-MM-dd.')
    return { items: day, maxItems: 2, minItems: 2, type: 'array' }
  }

  notes.push('A day as yyyy-MM-dd.')
  return day
}

// A number is whole unless its step says otherwise: without a step the submit
// takes integers only, and a whole step counted from a whole bound lands on
// whole numbers too.
function describeNumber(field: Field, notes: string[]): ToolSchema {
  const { max, min, unreadable } = buildLengthLimits(field)
  const step = buildNumberStep(field)
  const whole =
    step === undefined || (Number.isInteger(step) && Number.isInteger(min ?? 0))

  if (unreadable) {
    notes.push(UNREADABLE)
  } else if (step !== undefined) {
    notes.push(`In steps of ${step}${min === undefined ? '' : ` from ${min}`}.`)
  }

  return {
    ...(!unreadable && min !== undefined && { minimum: min }),
    ...(!unreadable && max !== undefined && { maximum: max }),
    type: whole ? 'integer' : 'number',
  }
}

function describeText(field: Field, notes: string[]): ToolSchema {
  const { max, min, unreadable } = buildLengthLimits(field)
  if (unreadable) {
    notes.push(UNREADABLE)
  }
  const pattern = readPattern(field, notes)
  return {
    ...(!unreadable && min !== undefined && { minLength: min }),
    ...(!unreadable && max !== undefined && { maxLength: max }),
    ...(pattern !== undefined && { pattern }),
    type: 'string',
  }
}

// A field's pattern, when JSON Schema can carry it: a regular expression with
// no flags that compiles in Unicode mode, which is how JSON Schema reads one.
// Any other pattern is checked on submit and only mentioned here.
function readPattern(field: Field, notes: string[]): string | undefined {
  const pattern = field.validation?.pattern
  if (!pattern) {
    return undefined
  }

  if (pattern.flags || pattern.allowInterpolation || !compiles(pattern.regex)) {
    notes.push('It must match a pattern the submit checks.')
    return undefined
  }
  return pattern.regex
}

function compiles(regex: string): boolean {
  try {
    new RegExp(regex, 'u')
    return true
  } catch {
    return false
  }
}

// A `select`, `radio` or `chips`: its options listed when the definition
// writes them and they are few and short, and looked up otherwise.
function describeChoice(
  field: Select,
  walk: Walk,
  name: string,
  notes: string[]
): ToolSchema {
  const options = readOptions(field, walk, name)

  let choice: ToolSchema
  if (
    options === undefined ||
    options.length > INLINE_OPTIONS ||
    !fits(listOptions(options), OPTIONS_LENGTH)
  ) {
    walk.lookup.add(name)
    notes.push(LOOKUP)
    choice = { type: 'string' }
  } else if (options.length === 0) {
    notes.push('It offers no options.')
    choice = { type: 'string' }
  } else {
    choice = describeEnum(options, notes)
  }

  if (!isChips(field)) {
    return choice
  }

  notes.push('No option twice.')
  return {
    items: choice,
    ...(field.advanced?.multiple === false && { maxItems: 1 }),
    ...(field.required && { minItems: 1 }),
    type: 'array',
  }
}

type Choice = Readonly<{ label: string; value: string }>

// The options the definition writes for the field, as the submit reads them
// (`getOfferedOptions`), once each, with their labels translated. `undefined`
// when they are fetched, or when a `source` event installs them: nothing here
// knows them.
function readOptions(
  field: Select,
  walk: Walk,
  name: string
): Choice[] | undefined {
  const offered = getOfferedOptions(field, walk.sourceTargets, name)
  if (!offered) {
    return undefined
  }

  const choices: Choice[] = []
  const seen = new Set<string>()
  for (const { label, value } of offered) {
    if (seen.has(value)) {
      continue
    }

    seen.add(value)
    const text = label ?? value
    choices.push({
      label: translateOptional(text, walk.dictionary) ?? text,
      value,
    })
  }
  return choices
}

function describeEnum(choices: readonly Choice[], notes: string[]): ToolSchema {
  notes.push(describeOptions(choices))
  return { enum: choices.map((choice) => choice.value), type: 'string' }
}

function describeOptions(choices: readonly Choice[]): string {
  return `Options: ${listOptions(choices)}.`
}

/**
 * Options by their values and what each one reads as on screen, which is how
 * a person will name them: `co (Colombia), mx (México)`.
 */
export function listOptions(choices: readonly Choice[]): string {
  return choices
    .map(({ label, value }) =>
      label === value ? value : `${value} (${label})`
    )
    .join(', ')
}

// What it takes for a slot that is hidden or locked to be written: which
// field's change makes it available, and that it is required once it is.
function availabilityNotes(
  slot: Field | List,
  walk: Walk,
  name: string
): string[] {
  const locked = isField(slot) && slot.disabled === true
  const shows = slot.hidden ? findRevealer(walk, name, 'shows') : undefined
  const unlocks = locked ? findRevealer(walk, name, 'unlocks') : undefined
  if (!shows && !unlocks) {
    return []
  }

  const sources = [...new Set([shows?.source, unlocks?.source])].filter(
    (source) => source !== undefined
  )
  const state =
    shows && unlocks ? 'Hidden and locked' : shows ? 'Hidden' : 'Locked'
  const notes = [
    `${state} until a change to ${sources.join(' or ')} makes it available: send it in the same call.`,
  ]

  if (isField(slot) && slot.required) {
    notes.push('Required once it is available.')
  }
  return notes
}

// The rules of a field no keyword says. A `custom` the field checks as it is
// written, and the submit again when it checks.
function ruleNotes(field: Field, walk: Walk, inRow: boolean): string[] {
  const notes: string[] = []
  const validation = field.validation

  // A rule in a row reads the fields of its own row.
  const requiredWhen = validation?.requiredWhen
  if (requiredWhen) {
    const rules = Array.isArray(requiredWhen) ? requiredWhen : [requiredWhen]
    const scope = inRow ? "this row's " : ''
    notes.push(
      `Required when ${rules.map((rule) => scope + describeWhen(rule)).join(' or ')}.`
    )
  }

  if (validation?.rules?.length || validation?.custom) {
    notes.push(
      walk.validates
        ? 'The submit checks more rules for it.'
        : 'More rules are checked as it is written.'
    )
  }
  return notes
}

function describeWhen(rule: WhenRule): string {
  const operator = rule.operator ?? 'eq'
  return rule.value === undefined
    ? `${rule.field} ${operator}`
    : `${rule.field} ${operator} ${JSON.stringify(rule.value)}`
}

// A field's title and description, translated, with the notes the walk wrote
// for it after its own description. Text that interpolates a value is left
// out: the agent would read the placeholder, or a value someone typed.
function withText(
  schema: ToolSchema,
  slot: Readonly<{ description?: Description; label?: string }>,
  notes: readonly string[],
  walk: Walk
): ToolSchema {
  const title = readText(slot.label, walk.dictionary, LABEL_LENGTH)
  const own = readText(
    typeof slot.description === 'string'
      ? slot.description
      : slot.description?.message,
    walk.dictionary,
    DESCRIPTION_LENGTH
  )
  const text = [own, schema.description, ...notes]
    .filter((part) => part !== undefined && part !== '')
    .join(' ')

  return {
    ...schema,
    ...(title && { title }),
    ...(text && { description: text }),
  }
}

function readText(
  text: string | undefined,
  dictionary: Record<string, string> | undefined,
  length: number
): string | undefined {
  const translated = translateOptional(text, dictionary)
  return translated && !isInterpolated(translated)
    ? clip(translated, length)
    : undefined
}

// At most `length` characters, with `...` where it was cut.
function clip(text: string, length: number): string {
  if (fits(text, length)) {
    return text
  }
  const kept = Array.from(text)
    .slice(0, length - 3)
    .join('')
  return `${kept.trimEnd()}...`
}

// Counted in code points, so a cut never splits one in two. A text is never
// fewer UTF-16 units than code points, so a short one is not split to count.
function fits(text: string, length: number): boolean {
  return text.length <= length || Array.from(text).length <= length
}

// The `state` events that make a slot available, from every field of the
// form, with their targets resolved the way the form resolves them: a target
// in a list's row (`items/note`) reaches the row the change happened in, and
// from outside any row it reaches the top-level field of that name.
function collectRevealers(fields: Fields): Map<string, Revealer[]> {
  const revealers = new Map<string, Revealer[]>()

  const visit = (entries: Fields, prefix: string): void => {
    for (const entry of entries) {
      if (isColumn(entry)) {
        visit(entry.fields, prefix)
        continue
      }
      if (isList(entry)) {
        visit(entry.fields, `${prefix}${entry.name}.0.`)
        continue
      }

      const source = `${prefix}${entry.name}`
      for (const event of entry.event?.change ?? []) {
        if (event.action !== 'state') {
          continue
        }

        const shows = event.state.hidden === false
        const unlocks = event.state.disabled === false
        if (!shows && !unlocks) {
          continue
        }

        const targets = Array.isArray(event.target)
          ? event.target
          : [event.target]
        for (const target of targets) {
          const resolved = resolveTarget(target, source)
          const reaching = revealers.get(resolved) ?? []
          reaching.push({ field: entry, shows, source, unlocks })
          revealers.set(resolved, reaching)
        }
      }
    }
  }

  visit(fields, '')
  return revealers
}
