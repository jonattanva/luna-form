import { MAX, MIN } from './constant'
import { buildLengthLimits, buildNumberStep, type LengthLimits } from './build'
import {
  buildDateLimits,
  buildYearLimits,
  checkDay,
  checkRange,
  displayDate,
  getDateFormat,
  toNativeDate,
  toRange,
  type DateIssue,
} from './date'
import {
  isCheckbox,
  isColumn,
  isDate,
  isDateRange,
  isEmail,
  isList,
  isNumber,
  isRadio,
  isSelectActive,
  isSelectMonth,
  isSelectYear,
  isChips,
  isChipsDays,
  isChipsMonths,
} from './is-input'
import { isEmpty, isObject, isString } from './is-type'
import { extract } from './extract'
import { isInterpolated } from './string'
import { logger } from './logger'
import { operators } from './operator'
import { resolveRefs } from './prepare'
import { z } from 'zod'
import type {
  AssertRule,
  CustomValidation,
  DateFormat,
  Definition,
  Field,
  Fields,
  Input,
  List,
  PatternRule,
  Schema,
  Schemas,
  Sections,
  WhenClause,
  WhenRule,
  ZodSchema,
} from '../type'
import { translate, translateOptional } from './translate'

type Coerced<T = unknown> = z.ZodCoercedString<T> | z.ZodCoercedNumber<T>

type SchemaChecker = (input: Input) => boolean
type SchemaGetter = (
  input: Input,
  translations?: Record<string, string>
) => z.ZodType

const approach: Array<[SchemaChecker, SchemaGetter]> = [
  [isCheckbox, getBoolean],
  [isDate, getDateSchema],
  [isEmail, getEmail],
  [isNumber, getNumber],
  [isRadio, getRadio],
  [isSelectActive, getBoolean],
  [isSelectMonth, getMonthSchema],
  [isSelectYear, getYearSchema],
  [isChips, getArraySchema],
  [isChipsDays, getArraySchema],
  [isChipsMonths, getArraySchema],
]

export function buildSchema(
  schemas: Schemas,
  fields: Field[] = [],
  translations?: Record<string, string>
) {
  const object = z.object(schemas)
  if (fields.length === 0) {
    return object
  }
  const withCustom = applyCustomValidation(object, fields, translations)
  return applyDeclarativeRules(withCustom, fields, translations)
}

export function flatten(error: z.ZodError<Record<string, unknown>>) {
  const results: Record<string, string[]> = {}
  const errors = z.flattenError(error).fieldErrors
  for (const [key, value] of Object.entries(errors)) {
    if (value !== undefined) {
      results[key] = value
    }
  }
  return results
}

export function getSchema(input: Input, translations?: Record<string, string>) {
  for (const [check, getSchema] of approach) {
    if (check(input)) {
      return getSchema(input, translations)
    }
  }
  return getText(input, translations)
}

// An optional leaf takes, besides its own values, `null` and nothing at all. A
// browser leaves out what it does not send -- a disabled control, a radio
// nobody picked -- and a missing key must neither fail the object nor come
// back coerced into the text "undefined". What the browser did send, even an
// empty string, still goes through the leaf's own schema. The checkbox and the
// chips read a missing key as unchecked and as nothing picked, and keep to it.
function optionalLeaf<T extends z.ZodType>(schema: T) {
  return schema.nullable().optional()
}

export function getEmail(input: Input, translations?: Record<string, string>) {
  // Bounds the form cannot read hold back an address as they hold back any
  // other text: whether it is an address is no longer the question.
  const limits = buildLengthLimits(input)
  if (limits.unreadable) {
    return getText(input, translations)
  }

  const baseSchema = z.string().trim()
  const address = applyEmail(input, limits, translations)

  if (input.required) {
    const message = getRequiredMessage(input, translations)
    const schema = baseSchema.min(1, message).pipe(address)

    return z.preprocess((value) => (isEmpty(value) ? '' : value), schema)
  }

  return optionalLeaf(baseSchema.pipe(address).or(z.literal('')))
}

function getBoolean(input: Input, translations?: Record<string, string>) {
  let schema = z.preprocess((value) => {
    if (typeof value === 'string') {
      if (value === 'true') {
        return true
      }

      if (value === 'false') {
        return false
      }
    }
    return value
  }, z.coerce.boolean())

  if (input.required) {
    if (isCheckbox(input)) {
      schema = schema.refine((value) => value === true, {
        message: getRequiredMessage(input, translations),
      })
    } else {
      schema = schema.refine((value) => typeof value === 'boolean', {
        message: getRequiredMessage(input, translations),
      })
    }
    return z.preprocess((value) => (value === null ? false : value), schema)
  }
  return schema.nullable()
}

function getRadio(input: Input, translations?: Record<string, string>) {
  let schema = z.coerce.string()
  if (input.required) {
    schema = schema.min(1, getRequiredMessage(input, translations))
    return z.preprocess((value) => (isEmpty(value) ? '' : value), schema)
  }
  return optionalLeaf(schema.or(z.literal('')))
}

// Text left empty is no value for a bound to check, as the browser's
// `minlength` reads it: an optional field passes, and a required one asks for a
// value with its own message before its bounds, as a number does. Text that is
// there and fails a bound still says which one, as an email does: the empty
// literal's failure aborts and the bound's does not.
export function getText(input: Input, translations?: Record<string, string>) {
  const limits = buildLengthLimits(input)
  const text = z.coerce.string().trim()
  // The bounds check what `text` made of the value, already trimmed text.
  const read = z.coerce.string<string>()
  const bounded = limits.unreadable
    ? read.refine(() => false, UNREADABLE)
    : applyMinAndMax(read, limits, input, translations)

  if (input.required) {
    const message = getRequiredMessage(input, translations)
    return z.preprocess(
      (value) => (isEmpty(value) ? '' : value),
      text.min(1, message).pipe(bounded)
    )
  }
  return optionalLeaf(text.pipe(z.literal('').or(bounded)))
}

export function getNumber(input: Input, translations?: Record<string, string>) {
  const limits = buildLengthLimits(input)
  const number = z.coerce.number()
  // The step counts from `length.min`, so a bound that cannot be read leaves
  // no step to check either: one message says why.
  const schema = limits.unreadable
    ? number.refine(() => false, UNREADABLE)
    : applyStep(
        applyMinAndMax(number, limits, input, translations),
        limits,
        input,
        translations
      )

  return presentLeaf(schema, input, translations, normalize)
}

// The years a year select offers, read by the same `buildYearLimits` as its
// options: a host value or a payload outside them answers no question the
// field asks, and a field that offers no year takes none.
export function getYearSchema(
  input: Input,
  translations?: Record<string, string>
) {
  const { max, min } = buildYearLimits(input)
  const year = z.coerce.number().int()

  const schema =
    min === undefined || max === undefined
      ? year.refine(() => false, 'This year is not available')
      : year
          .min(
            min,
            translateOptional(input.validation?.length?.min, translations)
          )
          .max(
            max,
            translateOptional(input.validation?.length?.max, translations)
          )

  return presentLeaf(schema, input, translations, normalize)
}

export function getMonthSchema(
  input: Input,
  translations?: Record<string, string>
) {
  const message = getRequiredMessage(input, translations)
  const schema = z.coerce.number().int().min(1, message).max(12, message)

  return presentLeaf(schema, input, translations, normalize)
}

// A day is checked as `yyyy-MM-dd` however it arrived -- typed in the field's
// own format, picked from a calendar, handed back by the host -- and it leaves
// the schema in that shape. The submit sends what the schema returns, so this
// is the one place a date is converted on its way out, and `buildFormSchema`
// converts it the same way. Its bounds are the ones its component is handed,
// read by the same `buildDateLimits`, so what a calendar lets through and what
// is accepted cannot drift apart.
export function getDateSchema(
  field: Field,
  translations?: Record<string, string>
) {
  const format = getDateFormat(field)
  const limits = buildDateLimits(field)
  const invalid =
    translateOptional(field.validation?.date, translations) ?? 'Invalid date'

  if (isDateRange(field)) {
    const range = z.unknown().transform((value, context) => {
      const keepOut = (message: string) => {
        context.addIssue({ code: 'custom', message })
        return z.NEVER
      }

      const ends = toRange(value)
      if (!ends) {
        return keepOut(invalid)
      }

      const [fromText, toText] = ends
      if (fromText.trim() === '' || toText.trim() === '') {
        return keepOut(
          keptOutMessage(field, { issue: 'range' }, format, translations)
        )
      }

      const from = toNativeDate(fromText, format)
      const to = toNativeDate(toText, format)
      if (!from || !to) {
        return keepOut(invalid)
      }

      const kept = checkRange(from, to, limits)
      if (kept) {
        return keepOut(keptOutMessage(field, kept, format, translations))
      }

      const days: [string, string] = [from, to]
      return days
    })

    return presentLeaf(range, field, translations, rangeToAbsent)
  }

  const day = z.string().transform((text, context) => {
    const native = toNativeDate(text, format)
    if (!native) {
      context.addIssue({ code: 'custom', message: invalid })
      return z.NEVER
    }

    const kept = checkDay(native, limits)
    if (kept) {
      context.addIssue({
        code: 'custom',
        message: keptOutMessage(field, kept, format, translations),
      })
      return z.NEVER
    }

    return native
  })

  return presentLeaf(day, field, translations, blankToAbsent)
}

// The field's own message for what kept a day out, or one that says it: a
// bound is named the way the field shows a day.
function keptOutMessage(
  field: Field,
  kept: DateIssue,
  format: DateFormat,
  translations?: Record<string, string>
) {
  // A rule the field declares that the form cannot read: it is the form's to
  // fix, not the person's, and no day passes until it is.
  if (kept.issue === 'unreadable') {
    return 'This date cannot be checked'
  }

  if (kept.issue === 'reserved') {
    return (
      translateOptional(field.validation?.reserved, translations) ??
      'This date is not available'
    )
  }

  if (kept.issue === 'range') {
    return (
      translateOptional(field.validation?.range, translations) ??
      'Invalid date range'
    )
  }

  const day = displayDate(kept.limit, format)
  return (
    translateOptional(field.validation?.length?.[kept.issue], translations) ??
    `Date must be on or ${kept.issue === 'min' ? 'after' : 'before'} ${day}`
  )
}

// Nothing picked is no range: no value at all, or two ends that are both blank,
// which is what the two hidden inputs of an untouched range submit.
function rangeToAbsent(value: unknown) {
  if (value == null) {
    return undefined
  }

  const ends = toRange(value)
  return ends?.every((end) => end.trim() === '') ? undefined : value
}

// Blank text is no day, the way `required` reads whitespace on every other
// field.
function blankToAbsent(value: unknown) {
  return value === null || (isString(value) && value.trim() === '')
    ? undefined
    : value
}

function normalize(value: unknown) {
  return value === null || value === '' ? undefined : value
}

// Absent until it is a value: an optional leaf nobody gave is not submitted at
// all, and a required one asks for it. `absent` says what counts as nothing for
// this kind of value.
//
// A number arrives as text, and as "" when nobody gave one: absent until it is
// a value, never 0. "Required" means present, not "at least 1", so 0 and every
// negative number pass it, and the bounds and the step only ever look at a
// value that is there. A number, a year, a month and a date all read their
// text that way.
function presentLeaf<T>(
  schema: z.ZodType<T>,
  input: Input,
  translations: Record<string, string> | undefined,
  absent: (value: unknown) => unknown
) {
  if (!input.required) {
    return z.preprocess(absent, optionalLeaf(schema))
  }

  const message = getRequiredMessage(input, translations)
  return z.preprocess(
    absent,
    z
      .unknown()
      // `boolean`, not the predicate TypeScript would infer: narrowing the
      // output to `{} | null` would no longer pipe into a number schema.
      .refine((value): boolean => value !== undefined, { message })
      .pipe(schema)
  )
}

// Whole unless the number declares a step, which is the browser's own default
// of 1. The step is read by `buildNumberStep`, the same reading
// `defineNumberStep` renders on the input, and it counts from `length.min` when
// there is one, as the input's arrows do. `validation.step` is what a value off
// it says, whichever of the two steps it is off.
function applyStep(
  schema: z.ZodCoercedNumber,
  limits: LengthLimits,
  input: Input,
  translations?: Record<string, string>
) {
  const message = translateOptional(input.validation?.step, translations)
  const step = buildNumberStep(input)
  if (step === undefined) {
    return schema.int(message)
  }

  const base = limits.min ?? 0
  return schema.refine((value) => isOnStep(value, step, base), {
    message:
      message ??
      (base === 0
        ? `Invalid number: must be a multiple of ${step}`
        : `Invalid number: must be ${base} plus a multiple of ${step}`),
  })
}

// Compared in whole units of the finest precision among the three, so 19.99 is
// on a step of 0.01 whatever floating point makes of 19.99 * 100.
function isOnStep(value: number, step: number, base: number): boolean {
  const scale =
    10 ** Math.max(decimalsOf(value), decimalsOf(step), decimalsOf(base))
  return Math.round((value - base) * scale) % Math.round(step * scale) === 0
}

function decimalsOf(value: number): number {
  const [mantissa, exponent = '0'] = String(value).split('e')
  const fraction = mantissa.split('.')[1]?.length ?? 0
  return Math.max(0, fraction - Number(exponent))
}

// The bounds are checks on the address itself, after the one that says it is
// an address. When every option of a union fails, zod passes on the issues of
// the one option whose failure did not abort, and says only `Invalid input`
// otherwise. A pipe aborts when what it pipes fails, so bounds in front of the
// address would leave an optional email out of them unable to say which one.
function applyEmail(
  input: Input,
  limits: LengthLimits,
  translations?: Record<string, string>
) {
  const message = input.validation?.email
    ? translate(input.validation?.email, translations)
    : undefined

  return applyMinAndMax(z.email(message), limits, input, translations)
}

// What a field whose bounds cannot be read says about any value it is given.
// It is the form's to fix, not the person's, and no value passes until it is.
const UNREADABLE = 'This value cannot be checked'

// The bounds are read by `buildLengthLimits`, the same reading
// `defineConstraints` renders on the input, so the browser and the schema
// check the same numbers.
function applyMinAndMax<T extends Coerced | z.ZodEmail>(
  schema: T,
  limits: LengthLimits,
  input: Input,
  translations?: Record<string, string>
): T {
  for (const method of [MIN, MAX] as const) {
    const value = limits[method]
    if (value !== undefined) {
      const message = translateOptional(
        input.validation?.length?.[method],
        translations
      )
      schema = schema[method](value, message) as T
    }
  }
  return schema
}

export function applyCustomValidation(
  schema: ZodSchema,
  fields: Field[] = [],
  translations?: Record<string, string>
) {
  const rules = getRules(fields)
  if (rules.length === 0) {
    return schema
  }

  return schema.superRefine((data, context) => {
    for (const { name, rule } of rules) {
      if (!evaluate(data, name, rule)) {
        const message = translate(rule.message, translations)
        context.addIssue({
          code: 'custom',
          message,
          path: [name],
        })
      }
    }
  })
}

function evaluate(
  data: Record<string, unknown>,
  name: string,
  rule: CustomValidation
): boolean {
  const operator = rule.operator ?? 'eq'
  const operation = operators[operator]
  if (operation) {
    return operation(readValue(data, name), readValue(data, rule.field))
  }
  return false
}

function getRules(fields: Field[]) {
  const results: Array<{ name: string; rule: CustomValidation }> = []
  for (const field of fields) {
    const custom = field.validation?.custom
    if (!custom) {
      continue
    }

    const rules = Array.isArray(custom) ? custom : [custom]
    for (const rule of rules) {
      results.push({ name: field.name, rule })
    }
  }
  return results
}

export function validateCustom(
  value: unknown,
  rules: CustomValidation | Array<CustomValidation>,
  getValue: (name: string) => unknown,
  translations?: Record<string, string>
) {
  const errors: string[] = []
  const collections = Array.isArray(rules) ? rules : [rules]

  for (const rule of collections) {
    const operator = rule.operator ?? 'eq'
    const operation = operators[operator]
    if (operation && !operation(value, getValue(rule.field))) {
      if (rule.message) {
        const message = translate(rule.message, translations)
        errors.push(message)
      }
    }
  }

  return errors
}

function getRequiredMessage(
  input: Input,
  translations?: Record<string, string>
) {
  return input.validation?.required
    ? translate(input.validation?.required, translations)
    : undefined
}

function getArraySchema(input: Input, translations?: Record<string, string>) {
  let baseSchema = z.array(z.string())

  if (input.required) {
    baseSchema = baseSchema.min(1, getRequiredMessage(input, translations))
  }

  return z.preprocess((value) => {
    if (isEmpty(value)) {
      return []
    }
    return Array.isArray(value) ? value.map(String) : [String(value)]
  }, baseSchema)
}

// ---------------------------------------------------------------------------
// Headless schema builder: derives a Zod object schema from a form definition
// (the same `sections`/`definition` the <Form> renders from) WITHOUT React.
//
// It walks the resolved tree (sections -> columns -> lists -> leaves) and
// produces a NESTED object schema (`z.array(z.object(...))` for lists), reusing
// the per-field `getSchema`. This is the single source of truth consumed both
// by the runtime (submit validation) and headless callers (server-side).
//
// PHASE 0 scope: structural walk + per-field schema + nested arrays for lists.
// The declarative rule vocabulary (requiredWhen, pattern, rules, list min/max)
// lands in the next phase on top of this walker.
// ---------------------------------------------------------------------------

// `context` is what the host knows when it renders -- the same object the form
// was given -- and a `$ref` into `#/context/` reads it. Pass it here as well,
// or the server validates against values the form never saw.
export function buildFormSchema(
  sections: Sections,
  translations?: Record<string, string>,
  definition?: Definition,
  context?: Record<string, unknown>
): z.ZodType {
  const resolved = resolveRefs(sections, definition, context) as Sections

  return buildObject(collectSectionFields(resolved), translations)
}

// Sections are visual grouping only: every field shares one object namespace,
// so we flatten their `fields` into a single list before building the shape.
function collectSectionFields(sections: Sections): Fields {
  const fields: Fields = []
  for (const section of sections) {
    for (const entry of section.fields ?? []) {
      fields.push(entry)
    }
  }
  return fields
}

// Builds one object level of the schema, reusing the per-field `getSchema` and
// `buildSchema` (z.object + applyCustomValidation) so field-level AND cross-field
// (`validation.custom`) rules live in ONE place instead of being re-derived here.
// Lists recurse into arrays of objects; columns are structural and merge their
// children into the current level.
function buildObject(
  fields: Fields,
  translations?: Record<string, string>
): z.ZodType {
  const shape: Schemas = {}
  const leaves: Field[] = []

  const visit = (entries: Fields): void => {
    for (const entry of entries) {
      if (isColumn(entry)) {
        visit(entry.fields)
      } else if (isList(entry)) {
        const items = applyListLength(
          z.array(buildObject(entry.fields, translations)),
          entry,
          translations
        )
        // A missing list key is an empty list (not an error) so length rules
        // still fire on absent configs, not just present-but-short ones.
        shape[entry.name] = z.preprocess(
          (value) => (value === undefined ? [] : value),
          items
        )
      } else {
        // Non-required leaves tolerate absent keys: stored configs are sparse
        // (only fields the user touched). Matches luna-flow's `.optional()`
        // config schemas; required leaves already fail on absence via getSchema.
        // A `hidden` field is only shown (and required) once an event reveals it,
        // so headless it is NOT structurally required — its conditional
        // requirement is expressed via `requiredWhen`/`rules`. Without this the
        // deriver over-requires hidden fields the rendered form never mounts.
        // The specialized variants (`Input`/`Select`/…) only add optional
        // `advanced` keys, so build the leaf from its base `Field` shape.
        const field: Field = entry
        const required = Boolean(field.required) && !field.hidden
        const leaf = getSchema(
          required ? field : { ...field, required: false },
          translations
        )
        shape[field.name] = required ? leaf : leaf.optional()
        leaves.push(field)
      }
    }
  }

  visit(fields)
  // Dotted field names (`basicAuth.username`) become nested objects so the
  // schema matches the nested config the runtime persists (see `nestSchemas`).
  return buildSchema(nestSchemas(shape), leaves, translations)
}

// Groups dotted field names (e.g. `basicAuth.username`) into nested objects so
// the headless schema matches the NESTED config the runtime persists: the
// `<Form>` submits flat keys and then `unflatten`s them (see `useFormState`).
// Runtime validation stays flat — only `buildObject` calls this — so it never
// runs on live submit data.
type SchemaGroup = Map<string, Schema | SchemaGroup>

function nestSchemas(shape: Schemas): Schemas {
  if (!Object.keys(shape).some((key) => key.includes('.'))) {
    return shape
  }

  const root: SchemaGroup = new Map()
  for (const [key, schema] of Object.entries(shape)) {
    const segments = key.split('.')
    let node = root
    for (let index = 0; index < segments.length - 1; index++) {
      const existing = node.get(segments[index])
      if (existing instanceof Map) {
        node = existing
      } else {
        const child: SchemaGroup = new Map()
        node.set(segments[index], child)
        node = child
      }
    }
    node.set(segments[segments.length - 1], schema)
  }

  return materialize(root)
}

function materialize(group: SchemaGroup): Schemas {
  const shape: Schemas = {}
  for (const [key, value] of group) {
    // A nested group is optional: a config may omit the whole object (e.g. no
    // `basicAuth` when auth is off). Requirements live in `requiredWhen`.
    shape[key] =
      value instanceof Map ? z.object(materialize(value)).optional() : value
  }
  return shape
}

// Maps a ZodError to flat, dotted-path issues (e.g. `rules.0.rule.0.value`).
// That path shape is what the runtime error store and headless callers key on,
// unlike `flatten` which only surfaces top-level field errors.
export function collectIssues(
  error: z.ZodError
): Array<{ path: string; message: string }> {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }))
}

// ---------------------------------------------------------------------------
// Declarative validation vocabulary (requiredWhen / pattern / rules) + list
// length. Orchestration only: condition evaluation reuses `operators` + `extract`
// (the same primitives as `evaluateCondition`), interpolation reuses
// `isInterpolated`, so no evaluation logic is re-implemented here.
// ---------------------------------------------------------------------------

type RuleIssue = { path: Array<string | number>; message?: string }

// Generic over the schema type so it preserves ZodObject (Zod v4 `.superRefine`
// keeps the type), letting `buildSchema` stay ZodObject-typed for the runtime.
function applyDeclarativeRules<T extends z.ZodType>(
  schema: T,
  fields: Field[] = [],
  translations?: Record<string, string>
): T {
  const relevant = fields.filter(hasDeclarativeRules)
  if (relevant.length === 0) {
    return schema
  }

  return schema.superRefine((value, ctx) => {
    const data = (isObject(value) ? value : {}) as Record<string, unknown>
    for (const field of relevant) {
      for (const issue of fieldIssues(data, field, translations)) {
        ctx.addIssue({
          code: 'custom',
          path: issue.path,
          message: issue.message,
        })
      }
    }
  })
}

function hasDeclarativeRules(field: Field): boolean {
  const validation = field.validation
  return (
    validation !== undefined &&
    (validation.requiredWhen !== undefined ||
      validation.pattern !== undefined ||
      validation.rules !== undefined)
  )
}

function fieldIssues(
  data: Record<string, unknown>,
  field: Field,
  translations?: Record<string, string>
): RuleIssue[] {
  const issues: RuleIssue[] = []
  const value = readValue(data, field.name)

  const requiredWhen = field.validation?.requiredWhen
  if (requiredWhen) {
    const rules = Array.isArray(requiredWhen) ? requiredWhen : [requiredWhen]
    const firing = rules.find((rule) => conditionHolds(data, rule))
    if (firing && !hasValue(value)) {
      issues.push({
        path: [field.name],
        message: translateOptional(
          firing.message ?? field.validation?.required,
          translations
        ),
      })
    }
  }

  const pattern = field.validation?.pattern
  if (pattern && !matchesPattern(pattern, value)) {
    issues.push({
      path: [field.name],
      message: translateOptional(pattern.message, translations),
    })
  }

  for (const rule of field.validation?.rules ?? []) {
    if (whenHolds(data, rule.when) && !runAssert(rule, value)) {
      issues.push({
        path: [field.name],
        message: translateOptional(rule.message, translations),
      })
    }
  }

  return issues
}

// Evaluates a single WhenRule against sibling data. Reuses `extract` (path
// resolution, incl. item scope inside lists) and `operators` (shared map).
function conditionHolds(
  data: Record<string, unknown>,
  rule: WhenRule
): boolean {
  const operation = operators[rule.operator ?? 'eq']
  if (!operation) {
    return false
  }
  return operation(readValue(data, rule.field), rule.value)
}

// Resolves a field's value whether the data is FLAT (the runtime submits keys
// by their literal—possibly dotted—name) or NESTED (headless `buildFormSchema`
// groups dotted names into objects). Tries the literal key first, then a dotted
// path walk, so both `{'a.b': x}` and `{a:{b:x}}` resolve the same way.
function readValue(data: Record<string, unknown>, name: string): unknown {
  if (name in data) {
    return data[name]
  }
  return extract(data, name) ?? undefined
}

function whenHolds(data: Record<string, unknown>, when?: WhenClause): boolean {
  if (!when) {
    return true
  }
  if (Array.isArray(when)) {
    return when.every((rule) => conditionHolds(data, rule))
  }
  if ('field' in when) {
    return conditionHolds(data, when)
  }
  const all = when.all
    ? when.all.every((rule) => conditionHolds(data, rule))
    : true
  const any = when.any
    ? when.any.some((rule) => conditionHolds(data, rule))
    : true
  return all && any
}

function runAssert(rule: AssertRule, value: unknown): boolean {
  switch (rule.assert) {
    case 'required':
      return hasValue(value)
    case 'minItems':
      return Array.isArray(value) && value.length >= Number(rule.value)
    case 'maxItems':
      return Array.isArray(value) && value.length <= Number(rule.value)
    case 'min':
      return sizeOf(value) >= Number(rule.value)
    case 'max':
      return sizeOf(value) <= Number(rule.value)
    case 'oneOf':
      return (
        Array.isArray(rule.value) &&
        rule.value.map(String).includes(String(value))
      )
    case 'pattern':
      return isPatternRule(rule.value)
        ? matchesPattern(rule.value, value)
        : true
    default:
      return true
  }
}

function matchesPattern(pattern: PatternRule, value: unknown): boolean {
  if (!hasValue(value)) {
    return true // emptiness is a `required`/`requiredWhen` concern, not pattern's
  }
  if (typeof value !== 'string') {
    return true
  }
  if (
    pattern.allowInterpolation &&
    (isInterpolated(value) || isReference(value))
  ) {
    return true
  }
  const expression = compilePattern(pattern)
  return expression !== null && expression.test(value)
}

// A pattern is written by whoever defines the form, and one that does not
// compile is a bug in that definition, not in the value. It is reported for the
// author and read as a mismatch, so the rule holds the value back with its own
// message instead of throwing out of `safeParse`, which on a rendered form
// escaped the submit and unmounted the form. Compiled on every check, as it
// always was: a cached expression would carry `lastIndex` from one value to the
// next under `g` and `y`.
function compilePattern({ regex, flags }: PatternRule): RegExp | null {
  try {
    return new RegExp(regex, flags)
  } catch (error) {
    logger.error(
      `A validation pattern does not compile, so it holds back every value: /${regex}/${flags ?? ''}`,
      error
    )
    return null
  }
}

// `input/expression` fields let users insert a dynamic reference with a leading
// `@` (e.g. `@Trigger.url`). Like a `{...}` template, its concrete value is only
// known at run time, so `allowInterpolation` skips the format check for it.
function isReference(value: unknown): boolean {
  return isString(value) && value.trimStart().startsWith('@')
}

// "Has a meaningful value" for required-style checks. Trims strings so a
// whitespace-only value counts as empty (matching the legacy `hasText`), while
// delegating arrays/other types to the shared `exists` operator. The trim lives
// here, not in `exists`, so the operator's semantics stay pure for conditions.
function hasValue(value: unknown): boolean {
  if (isString(value)) {
    return value.trim().length > 0
  }
  return operators.exists(value, undefined)
}

function sizeOf(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }

  if (isString(value) || Array.isArray(value)) {
    return value.length
  }

  return 0
}

function isPatternRule(value: unknown): value is PatternRule {
  return isObject(value) && 'regex' in value
}

// A list has no `required` of its own: its `length.min` is how it asks for
// rows, so when its bounds cannot be read no list passes, not even an empty
// one.
function applyListLength<T extends z.ZodType>(
  items: z.ZodArray<T>,
  list: List,
  translations?: Record<string, string>
): z.ZodArray<T> {
  const { max, min, unreadable } = buildLengthLimits(list)
  if (unreadable) {
    return items.refine(() => false, 'This list cannot be checked')
  }

  let schema = items
  if (min !== undefined) {
    schema = schema.min(
      min,
      translateOptional(list.validation?.length?.min, translations)
    )
  }
  if (max !== undefined) {
    schema = schema.max(
      max,
      translateOptional(list.validation?.length?.max, translations)
    )
  }
  return schema
}
