import { buildLengthLimits, buildNumberStep } from './build'
import { LABEL, VALUE } from './constant'
import {
  buildDateLimits,
  buildYearLimits,
  getMonth,
  getTimeFormat,
  getWeekDays,
} from './date'
import { extract } from './extract'
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
import { isObject, isValue } from './is-type'
import { getListBounds } from './list'
import { isTargetOf, resolveTarget } from './path'
import { prepare } from './prepare'
import { collectSourceTargets } from './schema'
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
}>

export type ToolSchemaResult = Readonly<{
  // The fields whose options are not in the schema -- too many to list, or
  // only known at run time -- by their whole name.
  lookup: readonly string[]
  // The fields a submit needs, at the top level. The schema does not mark
  // them: a fill names only the fields it changes.
  required: readonly string[]
  schema: ToolSchema
}>

// How many options a field lists in its schema. Past this a country or a time
// zone would be most of what an agent reads on every turn, so they are looked
// up instead.
const INLINE_OPTIONS = 25

const LOOKUP =
  'Its options are not listed here: find them with the options tool of this form.'

// A `state` event that makes a slot available: shows it, unlocks it, or both.
// `target` is the slot it reaches, by the name the form resolves the event's
// target to from `source`, the field whose change fires it.
type Revealer = Readonly<{
  field: Field
  shows: boolean
  source: string
  target: string
  unlocks: boolean
}>

// What the walk carries from one level to the next.
type Walk = Readonly<{
  dictionary?: Record<string, string>
  lang?: string
  lookup: string[]
  revealers: readonly Revealer[]
  sourceTargets: ReadonlySet<string>
  types?: Readonly<Record<string, ToolSchema>>
  // The slots whose writability is being decided, so that two fields that
  // reveal each other answer no instead of asking forever.
  visiting: Set<string>
}>

type Level = Readonly<{
  properties: Record<string, ToolSchema>
  required: string[]
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

  const walk: Walk = {
    dictionary: options.localization?.translations,
    lang: options.localization?.lang,
    lookup: [],
    revealers: collectRevealers(fields),
    sourceTargets: collectSourceTargets(fields),
    types: options.types,
    visiting: new Set(),
  }

  const level = buildLevel(fields, walk, '')
  return {
    lookup: walk.lookup,
    required: level.required,
    schema: {
      additionalProperties: false,
      properties: level.properties,
      type: 'object',
    },
  }
}

// One level of the form: the top, or a list's row. `prefix` names a row the
// way the rendered form does (`shipping.0.`), so an event's target matches the
// same field here as it does there.
function buildLevel(fields: Fields, walk: Walk, prefix: string): Level {
  const properties: Record<string, ToolSchema> = {}
  const required: string[] = []

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

      if (isList(entry)) {
        const list = buildList(entry, walk, name)
        properties[entry.name] = list.schema
        if (list.required) {
          required.push(entry.name)
        }
        continue
      }

      properties[entry.name] = buildLeaf(entry, walk, name)
      // A field nothing shows or unlocks yet is not required yet, as the submit
      // reads it. Its note says when it will be.
      if (entry.required && !entry.hidden && !entry.disabled) {
        required.push(entry.name)
      }
    }
  }

  visit(fields)
  return { properties, required }
}

// Whether an agent may write the slot: it is not kept from it, it holds a
// value of its own that a person could change, and it is on screen and
// unlocked, or a field the agent may write can make it so.
function isWritable(slot: Field | List, walk: Walk, name: string): boolean {
  if (walk.visiting.has(name)) {
    return false
  }

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
  return walk.revealers.find(
    (revealer) =>
      revealer[does] &&
      revealer.target === name &&
      isWritable(revealer.field, walk, revealer.source)
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
    notes.push('It keeps the rows it has: send each of them, in order.')
  }
  notes.push(...availabilityNotes(list, walk, name))

  const schema = withText(
    {
      items: {
        additionalProperties: false,
        properties: row.properties,
        ...(row.required.length > 0 && { required: row.required }),
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
    required: !list.hidden && min > 0 && row.required.length > 0,
    schema,
  }
}

function buildLeaf(field: Field, walk: Walk, name: string): ToolSchema {
  const notes: string[] = []
  const schema = describeValue(field, walk, name, notes)

  notes.push(...availabilityNotes(field, walk, name), ...ruleNotes(field))
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
  if (isCheckbox(field) || isSelectActive(field)) {
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
    walk.lookup.push(name)
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

  return walk.types?.[field.type] ?? describeText(field, notes)
}

function describeDate(field: DateField, notes: string[]): ToolSchema {
  const { max, min, reserved } = buildDateLimits(field)
  const range = isDateRange(field)

  if (min !== undefined || max !== undefined) {
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

  if (step !== undefined) {
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
// writes them and they are few, and looked up otherwise.
function describeChoice(
  field: Select,
  walk: Walk,
  name: string,
  notes: string[]
): ToolSchema {
  const options = readOptions(field, walk, name)

  let choice: ToolSchema
  if (options === undefined || options.length > INLINE_OPTIONS) {
    walk.lookup.push(name)
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

// The options the definition writes for the field, read the way the field
// reads them -- through `advanced.options` -- once each, with their labels
// translated. `undefined` when they are fetched, or when a `source` event
// installs them: nothing here knows them.
function readOptions(
  field: Select,
  walk: Walk,
  name: string
): Choice[] | undefined {
  if (!Array.isArray(field.source)) {
    return undefined
  }
  for (const target of walk.sourceTargets) {
    if (isTargetOf(name, target)) {
      return undefined
    }
  }

  const keys = field.advanced?.options
  const choices: Choice[] = []
  const seen = new Set<string>()
  for (const option of field.source) {
    const value = isObject(option)
      ? extract(option, keys?.value ?? VALUE)
      : option
    const label = isObject(option)
      ? extract(option, keys?.label ?? LABEL)
      : option
    if (!isValue(value) || seen.has(`${value}`)) {
      continue
    }

    seen.add(`${value}`)
    const text = isValue(label) ? `${label}` : `${value}`
    choices.push({
      label: translateOptional(text, walk.dictionary) ?? text,
      value: `${value}`,
    })
  }
  return choices
}

function describeEnum(choices: readonly Choice[], notes: string[]): ToolSchema {
  notes.push(describeOptions(choices))
  return { enum: choices.map((choice) => choice.value), type: 'string' }
}

// The values and what each one reads as on screen, which is how a person will
// name them: `co (Colombia), mx (México)`.
function describeOptions(choices: readonly Choice[]): string {
  const listed = choices.map(({ label, value }) =>
    label === value ? value : `${value} (${label})`
  )
  return `Options: ${listed.join(', ')}.`
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

function ruleNotes(field: Field): string[] {
  const notes: string[] = []
  const validation = field.validation

  const requiredWhen = validation?.requiredWhen
  if (requiredWhen) {
    const rules = Array.isArray(requiredWhen) ? requiredWhen : [requiredWhen]
    notes.push(`Required when ${rules.map(describeWhen).join(' or ')}.`)
  }

  if (validation?.rules?.length || validation?.custom) {
    notes.push('The submit checks more rules for it.')
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
  const title = readText(slot.label, walk.dictionary)
  const own = readText(
    typeof slot.description === 'string'
      ? slot.description
      : slot.description?.message,
    walk.dictionary
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
  dictionary?: Record<string, string>
): string | undefined {
  const translated = translateOptional(text, dictionary)
  return translated && !isInterpolated(translated) ? translated : undefined
}

// The `state` events that make a slot available, from every field of the
// form, with their targets resolved the way the form resolves them: a target
// in a list's row (`items/note`) reaches the row the change happened in, and
// from outside any row it reaches the top-level field of that name.
function collectRevealers(fields: Fields): Revealer[] {
  const revealers: Revealer[] = []

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
          revealers.push({
            field: entry,
            shows,
            source,
            target: resolveTarget(target, source),
            unlocks,
          })
        }
      }
    }
  }

  visit(fields, '')
  return revealers
}
