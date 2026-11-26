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
  type FormSchemaOptions,
  withoutDeclarativeRules,
} from './schema'
import { isInterpolated } from './string'
import { translateOptional } from './translate'
import type {
  Date as DateField,
  Description,
  Field,
  Fields,
  List,
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

export type ToolSchemaOptions = FormSchemaOptions &
  Readonly<{
    // What each type its registration speaks for says to agents, by type: the
    // schema of what an agent writes into a field of it, for a type no
    // built-in one describes, or `false` for a type kept from agents in every
    // form. Without either such a field takes text.
    types?: AgentTypes
    // Whether a submit checks the values against the form's rules:
    // `validation.submit`. When it does not, the schema holds no rule only a
    // submit checks.
    validates?: boolean
  }>

/** What a registration says to agents of each type, by type. */
export type AgentTypes = Readonly<Record<string, ToolSchema | false>>

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
// A pattern only the note can carry is quoted up to this length, and named
// otherwise: it comes from the definition, and is never cut, since a part of
// it would expect something else.
const PATTERN_LENGTH = 100

// A field looked up is a `string` with no `enum`, so a label passes the schema
// as a value does, and the fill takes either. A field whose options are listed
// keeps to its `enum`, which holds the values only.
const LOOKUP =
  'Its options are not listed here: find them with the options tool of this form. Pass an option by its value or its label.'

// What closes a sentence: `.`, `!`, `?`, `:`, an ellipsis, or their ideographic
// and full-width forms, before any quote or bracket that closes with it.
const SENTENCE_END =
  /[.!?:\u2026\u3002\uff01\uff1f\uff1a]["'\u2019\u201d\u00bb)\]]*$/u

/**
 * Text for an agent, from the host's and the form's: each piece in turn, one
 * that does not end a sentence closed with a period before the next, so a
 * host's text, which a dictionary key may leave open, never runs into the
 * sentence after it. A blank or missing piece is left out, and the last one is
 * kept as it was written.
 */
export function joinSentences(pieces: readonly (string | undefined)[]): string {
  const kept = pieces
    .map((piece) => piece?.trim() ?? '')
    .filter((piece) => piece !== '')
  return kept
    .map((piece, index) =>
      index === kept.length - 1 || SENTENCE_END.test(piece)
        ? piece
        : `${piece}.`
    )
    .join(' ')
}

// What a schema cannot declare: a key for one leaf of one row. `name` is the
// list's whole name, through the first row of a list it is in.
function describeRoutes(name: string): string {
  return `Sending the list replaces its rows. To write one field of one row, send its route instead, the row counted from 0: ${anyRow(name)}.<row>.<field>.`
}

// A whole name the walk wrote through the first row of each list, with each
// row as any row: what a note says holds in each of them.
function anyRow(name: string): string {
  return name.replace(/\.0\./g, '.<row>.')
}

// How a note on a slot of the row `row` (`items.0.`, or nothing at the top)
// names a field of that row, by its path from it: as this row's, since what
// the note says holds in each row, never through a row number.
function fromRow(row: string, path: string): string {
  return row === '' ? path : `this row's ${path}`
}

// A bound the form cannot read refuses whatever is written, and lets an
// optional field through only empty.
// Said of the form, not of a submit: an agent offered no submit tool reads
// it too.
const UNREADABLE =
  'The form cannot read its bounds, so it accepts no value for it.'

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
  types?: AgentTypes
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
        const list = buildList(entry, walk, prefix)
        if (!described) {
          properties.set(entry.name, list.schema)
        }
        if (list.required) {
          required.add(entry.name)
        }
        continue
      }

      if (!described) {
        properties.set(entry.name, buildLeaf(entry, walk, prefix))
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
    if (isKeptFromAgents(slot, walk.types)) {
      return false
    }

    if (isField(slot) && (slot.advanced?.transient || slot.readonly)) {
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

// Whether no agent is to know the slot exists, whatever the form does with
// it: a password, a slot its definition keeps from agents, or one of a type
// its registration does. Nothing in the definition opens one again.
function isKeptFromAgents(slot: Field | List, types?: AgentTypes): boolean {
  return (
    slot.advanced?.agent === false ||
    (isField(slot) && isPassword(slot)) ||
    declaredFor(types, slot.type) === false
  )
}

// What the registration of a type says to agents. Only a type it names
// itself: `toString` is no schema.
function declaredFor(
  types: AgentTypes | undefined,
  type: string
): ToolSchema | false | undefined {
  return types && Object.prototype.hasOwnProperty.call(types, type)
    ? types[type]
    : undefined
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
  row: string
): Readonly<{ required: boolean; schema: ToolSchema }> {
  const name = row + list.name
  const rows = buildLevel(list.fields, walk, `${name}.0.`)
  const { max, min } = getListBounds(list)

  const notes: string[] = []
  if (list.advanced?.fixed) {
    walk.fixed.add(name)
    notes.push('It keeps the rows it has: send each of them, in order.')
  }
  notes.push(describeRoutes(name))
  notes.push(...availabilityNotes(list, walk, row))

  const schema = withText(
    {
      items: {
        additionalProperties: false,
        properties: Object.fromEntries(rows.properties),
        ...(rows.required.size > 0 && { required: [...rows.required] }),
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
    required: !list.hidden && min > 0 && rows.required.size > 0,
    schema,
  }
}

function buildLeaf(field: Field, walk: Walk, row: string): ToolSchema {
  const name = row + field.name
  // A submit that checks nothing has none of the rules only a submit checks.
  const checked = walk.validates ? field : withoutDeclarativeRules(field)
  const notes: string[] = []
  const schema = describeValue(checked, walk, name, notes)

  notes.push(
    ...availabilityNotes(field, walk, row),
    ...ruleNotes(checked, walk, row)
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
  // too: the host knows what its own component takes. One it keeps from
  // agents never reaches here.
  const declared = declaredFor(walk.types, field.type)
  if (declared) {
    return declared
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
    return {
      ...describeText(field, notes, walk.dictionary),
      format: 'email',
    }
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

  return describeText(field, notes, walk.dictionary)
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

function describeText(
  field: Field,
  notes: string[],
  dictionary: Record<string, string> | undefined
): ToolSchema {
  const { max, min, unreadable } = buildLengthLimits(field)
  if (unreadable) {
    notes.push(UNREADABLE)
  }
  const pattern = readPattern(field, notes, dictionary)
  return {
    ...(!unreadable && min !== undefined && { minLength: min }),
    ...(!unreadable && max !== undefined && { maxLength: max }),
    ...(pattern !== undefined && { pattern }),
    type: 'string',
  }
}

// A field's pattern, when JSON Schema can carry it: a regular expression with
// no flags that compiles in Unicode mode, which is how JSON Schema reads one.
// Any other pattern is checked on submit and written in the note instead: a
// flag such as `i` has no place in the keyword, a pattern that lets a
// template through (`allowInterpolation`) takes values the keyword would
// refuse, and one written for JavaScript without `u`, such as `\#`, breaks a
// client that compiles the keyword. The note quotes it as a literal with its
// flags when it is short, and the author's message for it, so the agent knows
// what is expected. The literal is not filtered as text that interpolates a
// value: a quantifier such as `{2,}` would read as a placeholder. A `/` in it
// is escaped as a literal writes it, and one already escaped is left as it is:
// an escape is read whole, so its `/` is never taken for a bare one. The
// length counts the literal as the agent reads it, escapes included.
function readPattern(
  field: Field,
  notes: string[],
  dictionary: Record<string, string> | undefined
): string | undefined {
  const pattern = field.validation?.pattern
  if (!pattern) {
    return undefined
  }

  if (pattern.flags || pattern.allowInterpolation || !compiles(pattern.regex)) {
    const source = pattern.regex.replace(/\\.|\//g, (match) =>
      match === '/' ? '\\/' : match
    )
    const literal = `/${source}/${pattern.flags ?? ''}`
    notes.push(
      fits(literal, PATTERN_LENGTH)
        ? `It must match ${literal}.`
        : 'It must match a pattern the form checks.'
    )
    const message = readText(pattern.message, dictionary, LABEL_LENGTH)
    if (message) {
      notes.push(message)
    }
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
  row: string
): string[] {
  const name = row + slot.name
  const locked = isField(slot) && slot.disabled === true
  const shows = slot.hidden ? findRevealer(walk, name, 'shows') : undefined
  const unlocks = locked ? findRevealer(walk, name, 'unlocks') : undefined
  if (!shows && !unlocks) {
    return []
  }

  // A change in a row reaches its own row or one around it, so the field that
  // fires it is in the slot's row or under it, unless it is outside every
  // list: a target written as a whole name reaches a row from outside.
  const sources = [...new Set([shows?.source, unlocks?.source])]
    .filter((source) => source !== undefined)
    .map((source) =>
      anyRow(
        source.startsWith(row) ? fromRow(row, source.slice(row.length)) : source
      )
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
function ruleNotes(field: Field, walk: Walk, row: string): string[] {
  const notes: string[] = []
  const validation = field.validation

  // A rule in a row reads the fields of its own row.
  const requiredWhen = validation?.requiredWhen
  if (requiredWhen) {
    const rules = Array.isArray(requiredWhen) ? requiredWhen : [requiredWhen]
    notes.push(
      `Required when ${rules.map((rule) => fromRow(row, describeWhen(rule))).join(' or ')}.`
    )
  }

  if (validation?.rules?.length || validation?.custom) {
    notes.push(
      walk.validates
        ? 'The form checks more rules for it.'
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
  const text = joinSentences([own, schema.description, ...notes])

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
