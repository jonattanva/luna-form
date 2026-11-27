import { LABEL, MAX, MIN, VALUE } from './constant'
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
  isField,
  isOptions,
} from './is-input'
import { isEmpty, isObject, isString, isValue } from './is-type'
import { extract } from './extract'
import { isInterpolated } from './string'
import { logger } from './logger'
import { operators } from './operator'
import { resolveRefs } from './prepare'
import { isTargetOf } from './path'
import * as z from 'zod'
import type {
  AnyField,
  AssertRule,
  CustomValidation,
  DateFormat,
  Definition,
  Field,
  Fields,
  Input,
  List,
  Localization,
  PatternRule,
  Schema,
  Schemas,
  Sections,
  WhenClause,
  WhenRule,
  ZodSchema,
} from '../type'
import {
  translate,
  translateBuiltIn,
  translateOptional,
  type BuiltInKey,
} from './translate'

// What `advanced.length` bounds: the characters of a text or an address, the
// value of a number.
type Bounded = z.ZodString | z.ZodEmail | z.ZodCoercedNumber

type SchemaChecker = (input: Input) => boolean
// `lang` is the form's language, for a date that names its month in a message.
type SchemaGetter = (
  input: Input,
  translations?: Record<string, string>,
  lang?: string
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

// A field's schema, wherever it is validated: the browser, on a change and on
// a submit, and `buildFormSchema` on the server. `sourceTargets` are the
// targets of the form's `source` events (see `collectSourceTargets`), whose
// options are only known at run time. `lang` is the form's language: a message
// that names a day writes its month in it, as the field shows it.
export function getSchema(
  input: Input,
  translations?: Record<string, string>,
  sourceTargets?: ReadonlySet<string>,
  lang?: string
) {
  return applyOffered(
    getLeafSchema(input, translations, lang),
    getOfferedValues(input, sourceTargets),
    translateOptional(input.validation?.option, translations) ??
      builtInMessage('This option is not available', translations)
  )
}

function getLeafSchema(
  input: Input,
  translations?: Record<string, string>,
  lang?: string
) {
  for (const [check, getSchema] of approach) {
    if (check(input)) {
      return getSchema(input, translations, lang)
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

// What a Yes/No holds, read the way its select sends it: `'true'` and
// `'false'` are the two answers, and an empty select is none at all. Any
// other value is coerced, as before.
function toBoolean(value: unknown) {
  if (isEmpty(value)) {
    return undefined
  }
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  return Boolean(value)
}

function getBoolean(input: Input, translations?: Record<string, string>) {
  const required = Boolean(input.required)
  const message = getRequiredMessage(input, translations)
  const fallback = toBoolean(input.defaultValue)

  // A checkbox left unticked is an answer, «no»; a Yes/No left empty is none,
  // and must not reach the action as a `false` nobody chose.
  if (isCheckbox(input)) {
    const schema = z.preprocess(
      (value) => toBoolean(value) ?? false,
      z.boolean()
    )
    return required
      ? schema.refine((value) => value === true, { message })
      : schema
  }

  // A Yes/No left empty takes the answer it shows by default, as a value saved
  // before the field existed does; only one with no default is unanswered.
  // Not optional when required, so a key left out is checked too, and an
  // empty answer is asked for in the field's own words.
  const read = (value: unknown) => toBoolean(value) ?? fallback
  return required
    ? z.preprocess(read, z.boolean({ error: () => message }))
    : z.preprocess(read, z.boolean().optional())
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
  // The bounds check what `text` made of the value: text, already trimmed.
  const read = z.string()
  const bounded = limits.unreadable
    ? read.refine(() => false, builtInMessage(UNREADABLE, translations))
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
  const number = z.coerce.number({
    error: builtInMessage('Enter a number', translations),
  })
  // The step counts from `length.min`, so a bound that cannot be read leaves
  // no step to check either: one message says why.
  const schema = limits.unreadable
    ? number.refine(() => false, builtInMessage(UNREADABLE, translations))
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
  const year = z.coerce
    .number({ error: builtInMessage('Enter a number', translations) })
    .int(builtInMessage('Enter a whole number', translations))

  const schema =
    min === undefined || max === undefined
      ? year.refine(
          () => false,
          builtInMessage('This year is not available', translations)
        )
      : year
          .min(
            min,
            translateOptional(input.validation?.length?.min, translations) ??
              builtInMessage('Enter {min} or more', translations, { min })
          )
          .max(
            max,
            translateOptional(input.validation?.length?.max, translations) ??
              builtInMessage('Enter {max} or less', translations, { max })
          )

  return presentLeaf(schema, input, translations, normalize)
}

export function getMonthSchema(
  input: Input,
  translations?: Record<string, string>
) {
  // A month the field declares its required message for says it about any
  // value that is no month, as it always has; otherwise each check says what
  // is wrong, and an optional month holding 13 is not called required.
  const declared = translateOptional(input.validation?.required, translations)
  const schema = z.coerce
    .number({
      error: declared ?? builtInMessage('Enter a number', translations),
    })
    .int(declared ?? builtInMessage('Enter a whole number', translations))
    .min(
      1,
      declared ??
        builtInMessage('Enter {min} or more', translations, { min: 1 })
    )
    .max(
      12,
      declared ??
        builtInMessage('Enter {max} or less', translations, { max: 12 })
    )

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
  translations?: Record<string, string>,
  lang?: string
) {
  const format = getDateFormat(field)
  const shown = { format, lang, translations }
  const limits = buildDateLimits(field)
  const invalid =
    translateOptional(field.validation?.date, translations) ??
    builtInMessage('Invalid date', translations)

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
        return keepOut(keptOutMessage(field, { issue: 'range' }, shown))
      }

      const from = toNativeDate(fromText, format)
      const to = toNativeDate(toText, format)
      if (!from || !to) {
        return keepOut(invalid)
      }

      const kept = checkRange(from, to, limits)
      if (kept) {
        return keepOut(keptOutMessage(field, kept, shown))
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
        message: keptOutMessage(field, kept, shown),
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
  shown: Readonly<{
    format: DateFormat
    lang?: string
    translations?: Record<string, string>
  }>
) {
  const { format, lang, translations } = shown
  // A rule the field declares that the form cannot read: it is the form's to
  // fix, not the person's, and no day passes until it is.
  if (kept.issue === 'unreadable') {
    return builtInMessage('This date cannot be checked', translations)
  }

  if (kept.issue === 'reserved') {
    return (
      translateOptional(field.validation?.reserved, translations) ??
      builtInMessage('This date is not available', translations)
    )
  }

  if (kept.issue === 'range') {
    return (
      translateOptional(field.validation?.range, translations) ??
      builtInMessage('Invalid date range', translations)
    )
  }

  const date = displayDate(kept.limit, format, lang)
  return (
    translateOptional(field.validation?.length?.[kept.issue], translations) ??
    builtInMessage(
      kept.issue === 'min'
        ? 'Date must be on or after {date}'
        : 'Date must be on or before {date}',
      translations,
      { date }
    )
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
    return schema.int(
      message ?? builtInMessage('Enter a whole number', translations)
    )
  }

  const base = limits.min ?? 0
  return schema.refine((value) => isOnStep(value, step, base), {
    message:
      message ??
      (base === 0
        ? builtInMessage(
            'Invalid number: must be a multiple of {step}',
            translations,
            { step }
          )
        : builtInMessage(
            'Invalid number: must be {base} plus a multiple of {step}',
            translations,
            { base, step }
          )),
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
    : builtInMessage('Invalid email address', translations)

  return applyMinAndMax(z.email(message), limits, input, translations)
}

// What a field whose bounds cannot be read says about any value it is given.
// It is the form's to fix, not the person's, and no value passes until it is.
const UNREADABLE = 'This value cannot be checked' satisfies BuiltInKey

// The bounds are read by `buildLengthLimits`, the same reading
// `defineConstraints` renders on the input, so the browser and the schema
// check the same numbers.
//
// Without a message of its own, a bound says what it counts: the characters of
// a text, or a number's own value.
function applyMinAndMax<T extends Bounded>(
  schema: T,
  limits: LengthLimits,
  input: Input,
  translations?: Record<string, string>
): T {
  const kind = schema.type === 'number' ? 'number' : 'text'
  for (const method of [MIN, MAX] as const) {
    const value = limits[method]
    if (value !== undefined) {
      const message =
        translateOptional(input.validation?.length?.[method], translations) ??
        builtInMessage(boundMessage(kind, method, value), translations, {
          [method]: value,
        })
      schema = schema[method](value, message) as T
    }
  }
  return schema
}

// What a bound says, by what it counts, in the singular for one.
function boundMessage(
  kind: 'items' | 'number' | 'text',
  method: 'max' | 'min',
  value: number
): BuiltInKey {
  if (kind === 'number') {
    return method === MIN ? 'Enter {min} or more' : 'Enter {max} or less'
  }
  if (kind === 'items') {
    if (value === 1) {
      return method === MIN ? 'Add at least 1 item' : 'Add at most 1 item'
    }
    return method === MIN
      ? 'Add at least {min} items'
      : 'Add at most {max} items'
  }
  if (value === 1) {
    return method === MIN
      ? 'Enter at least 1 character'
      : 'Enter at most 1 character'
  }
  return method === MIN
    ? 'Enter at least {min} characters'
    : 'Enter at most {max} characters'
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
        const message = rule.message
          ? translate(rule.message, translations)
          : builtInMessage('Invalid value', translations)
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
      errors.push(
        rule.message
          ? translate(rule.message, translations)
          : builtInMessage('Invalid value', translations)
      )
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
    : builtInMessage('This field is required', translations)
}

// The library's own message, in the form's language, with its placeholders
// filled in: what a field says when its definition gives no message. See
// `BuiltInKey`.
function builtInMessage(
  key: BuiltInKey,
  translations?: Record<string, string>,
  values?: Record<string, number | string>
): string {
  // Its placeholders are its own, `{min}` and the like, so a plain swap of
  // each one does: the filters of a form's templates are no part of them.
  return translateBuiltIn(key, translations).replace(
    /\{(\w+)\}/g,
    (placeholder, name: string) =>
      values && name in values ? String(values[name]) : placeholder
  )
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
// ---------------------------------------------------------------------------

// What a form is read with, wherever it is built from: the same `context`,
// `definition` and `localization` the form renders with.
export type FormSchemaOptions = Readonly<{
  // What the host knows when it renders, which a `$ref` into `#/context/`
  // reads. Without it the server validates against values the form never saw.
  context?: Record<string, unknown>
  // What a `$ref` into `#/definition/` reads.
  definition?: Definition
  // The form's language and its dictionary: see `resolveLocalization`. The
  // messages come in it, a day's month too, as the form writes them.
  localization?: Localization
}>

// Every option is an object, so a dictionary of strings where the options go
// does not type-check.
export function buildFormSchema(
  sections: Sections,
  options: FormSchemaOptions & Readonly<Record<string, object | undefined>> = {}
): z.ZodType {
  const { context, definition, localization } = options
  const resolved = resolveRefs(sections, definition, context) as Sections
  const fields = collectSectionFields(resolved)

  return buildObject(
    fields,
    { ...localization, sourceTargets: collectSourceTargets(fields) },
    ''
  )
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
//
// `prefix` names a row the way the rendered form does (`shipping.0.`), so a
// `source` target such as `shipping/city` matches the same field here as it
// does there.
function buildObject(
  fields: Fields,
  reading: Localization & { sourceTargets: ReadonlySet<string> },
  prefix: string
): z.ZodType {
  const { lang, sourceTargets, translations } = reading
  const shape: Schemas = {}
  const leaves: Field[] = []

  const visit = (entries: Fields): void => {
    for (const entry of entries) {
      if (isColumn(entry)) {
        visit(entry.fields)
      } else if (isList(entry)) {
        const items = applyListLength(
          z.array(
            buildObject(entry.fields, reading, `${prefix}${entry.name}.0.`)
          ),
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
        // (only fields the user touched). Required leaves already fail on
        // absence via getSchema.
        // A `hidden` field is only shown (and required) once an event reveals it,
        // so headless it is NOT structurally required — its conditional
        // requirement is expressed via `requiredWhen`/`rules`. Without this the
        // deriver over-requires hidden fields the rendered form never mounts.
        // The specialized variants (`Input`/`Select`/…) only add optional
        // `advanced` keys, so build the leaf from its base `Field` shape.
        const field: Field = entry
        const required = Boolean(field.required) && !field.hidden
        const leaf = getSchema(
          { ...field, name: `${prefix}${field.name}`, required },
          translations,
          sourceTargets,
          lang
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

// The `source` events of the form: by each target as written, the fields whose
// change fires one, by their whole name, a row's leaf through its list's first
// row (`items.0.kind`). The fields a target names take their options at run
// time, whatever the definition writes for them. See `isTargetOf` for which
// field a target names.
export function collectSourceEvents(fields: Fields): Map<string, string[]> {
  const events = new Map<string, string[]>()

  const visit = (entries: Fields, prefix: string): void => {
    for (const entry of entries) {
      if (!isField(entry)) {
        visit(
          entry.fields,
          isList(entry) ? `${prefix}${entry.name}.0.` : prefix
        )
        continue
      }
      for (const event of entry.event?.change ?? []) {
        if (event.action === 'source') {
          const from = events.get(event.target) ?? []
          from.push(`${prefix}${entry.name}`)
          events.set(event.target, from)
        }
      }
    }
  }

  visit(fields, '')
  return events
}

// The targets of every `source` event in the form, as written.
export function collectSourceTargets(fields: Fields): Set<string> {
  return new Set(collectSourceEvents(fields).keys())
}

/** An option a field offers, as text: what is submitted, and what is shown. */
export type OfferedOption = Readonly<{ label?: string; value: string }>

// The options a `select`, `radio` or `chips` offers, when the definition writes
// them: an inline array, or a reference that resolved to one. Read as the
// field reads them -- through `advanced.options` -- and as text, the way a
// selection is compared. `undefined` when the options are fetched or a
// `source` event installs them: nothing here knows them.
//
// `name` is the whole name, a row's included (`shipping.3.city`); the field's
// own unless the caller names the slot otherwise.
export function getOfferedOptions(
  field: Field,
  sourceTargets?: ReadonlySet<string>,
  name: string = field.name
): OfferedOption[] | undefined {
  if (!isOptions(field) || !Array.isArray(field.source)) {
    return undefined
  }
  for (const target of sourceTargets ?? []) {
    if (isTargetOf(name, target)) {
      return undefined
    }
  }

  const keys = field.advanced?.options
  return field.source.flatMap((option) => {
    const value = isObject(option)
      ? extract(option, keys?.value ?? VALUE)
      : option
    if (!isValue(value)) {
      return []
    }

    const label = isObject(option)
      ? extract(option, keys?.label ?? LABEL)
      : option
    return [
      {
        ...(isValue(label) && { label: String(label) }),
        value: String(value),
      },
    ]
  })
}

// The values of `getOfferedOptions`, which the submit holds a selection to.
export function getOfferedValues(
  field: Field,
  sourceTargets?: ReadonlySet<string>
): Set<string> | undefined {
  const options = getOfferedOptions(field, sourceTargets)
  return options && new Set(options.map((option) => option.value))
}

// Runs after the field's own schema, on what it made of the value: text for a
// `select` or `radio`, an array of text for `chips`. Nothing picked is the
// required rule's question, not this one.
function applyOffered(
  schema: z.ZodType,
  offered: ReadonlySet<string> | undefined,
  message: string
): z.ZodType {
  if (!offered) {
    return schema
  }

  return schema.refine((value) => isOffered(offered, value), message)
}

// What a field holds that it offers options for: its whole name, the options
// its definition writes, and the value in the form's state.
export type HeldOption = Readonly<{
  name: string
  offered: ReadonlySet<string>
  value: unknown
}>

// The data a submit validates. A `select`, `radio` or `chips` draws only the
// options it offers, so a value it holds outside them is not on screen, and
// what the browser sends for it is not what the field holds: a native select
// behind the control sends its first option, an option nobody picked, and a
// radio sends nothing. For such a value the data carries the value the field
// holds, so the field's schema says it is not one of its options and nothing
// is sent in its place. A value it offers, or none, is left as the control
// sent it.
export function withHeldOptions(
  form: Record<string, unknown>,
  held: ReadonlyArray<HeldOption>
): Record<string, unknown> {
  let data = form
  for (const { name, offered, value } of held) {
    if (!isOffered(offered, value)) {
      data = data === form ? { ...form } : data
      data[name] = value
    }
  }
  return data
}

// Whether every value picked is one of `offered`: the text of a `select` or
// `radio`, each entry of a `chips`. Nothing picked is the required rule's
// question, not this one, so it is offered here.
export function isOffered(offered: ReadonlySet<string>, value: unknown) {
  const picked = Array.isArray(value) ? value : [value]
  return picked.every((item) => isEmpty(item) || offered.has(String(item)))
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

// The rules of `validation` the submit checks and the field does not: they
// read the rest of the form's data. See `applyDeclarativeRules`.
const DECLARATIVE = ['requiredWhen', 'pattern', 'rules'] as const

function hasDeclarativeRules(field: Field): boolean {
  const validation = field.validation
  return (
    validation !== undefined &&
    DECLARATIVE.some((key) => validation[key] !== undefined)
  )
}

/**
 * The field as a submit that checks nothing leaves it: without the rules only
 * a submit checks. What the field checks as it is written stays.
 */
export function withoutDeclarativeRules(field: Field): Field {
  if (!hasDeclarativeRules(field)) {
    return field
  }

  const validation = { ...field.validation }
  for (const key of DECLARATIVE) {
    delete validation[key]
  }
  return { ...field, validation }
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
        message:
          translateOptional(
            firing.message ?? field.validation?.required,
            translations
          ) ?? builtInMessage('This field is required', translations),
      })
    }
  }

  const pattern = field.validation?.pattern
  if (pattern && !matchesPattern(pattern, value)) {
    issues.push({
      path: [field.name],
      message:
        translateOptional(pattern.message, translations) ??
        builtInMessage('Invalid value', translations),
    })
  }

  for (const rule of field.validation?.rules ?? []) {
    if (whenHolds(data, rule.when) && !runAssert(rule, value)) {
      issues.push({
        path: [field.name],
        message:
          translateOptional(rule.message, translations) ??
          builtInMessage('Invalid value', translations),
      })
    }
  }

  return issues
}

/**
 * A field or a list of a list row, renamed into it: `value` of row 3 of `items` is
 * `items.3.value`, and the fields its `requiredWhen`, `rules` and `custom`
 * compare it to are named the same way. A rule in a row reads the fields of
 * its own row, as `buildFormSchema` reads them, where the form's submit sees
 * every field by its whole name.
 */
export function inRow<T extends AnyField | List>(slot: T, row: string): T {
  return {
    ...slot,
    name: `${row}.${slot.name}`,
    ...(slot.validation && {
      validation: mapRuleFields(slot.validation, (field) => `${row}.${field}`),
    }),
  }
}

/**
 * Every field a field's `validation` names -- the `field` of a `requiredWhen`,
 * of a rule's `when`, of a `custom` -- at any depth of it, replaced by what
 * `name` gives for it. `path` is where the rule naming it sits, as
 * `.requiredWhen[1]`.
 */
export function mapRuleFields<T>(
  value: T,
  name: (field: string, path: string) => string,
  path = ''
): T {
  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      mapRuleFields(entry, name, `${path}[${index}]`)
    ) as T
  }
  if (!isObject(value)) {
    return value
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      key === 'field' && isString(entry)
        ? name(entry, path)
        : mapRuleFields(entry, name, `${path}.${key}`),
    ])
  ) as T
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

export function isPatternRule(value: unknown): value is PatternRule {
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
    return items.refine(
      () => false,
      builtInMessage('This list cannot be checked', translations)
    )
  }

  let schema = items
  if (min !== undefined) {
    schema = schema.min(
      min,
      translateOptional(list.validation?.length?.min, translations) ??
        builtInMessage(boundMessage('items', MIN, min), translations, { min })
    )
  }
  if (max !== undefined) {
    schema = schema.max(
      max,
      translateOptional(list.validation?.length?.max, translations) ??
        builtInMessage(boundMessage('items', MAX, max), translations, { max })
    )
  }
  return schema
}
