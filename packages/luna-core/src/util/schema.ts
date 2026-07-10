import { MAX, MIN } from './constant'
import {
  isCheckbox,
  isColumn,
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
import { operators } from './operator'
import { resolveRefs } from './prepare'
import { z } from 'zod'
import type {
  AssertRule,
  CustomValidation,
  Definition,
  Field,
  Fields,
  Input,
  List,
  PatternRule,
  Schemas,
  Sections,
  WhenClause,
  WhenRule,
  ZodSchema,
} from '../type'
import { translate } from './translate'

type Coerced<T = unknown> = z.ZodCoercedString<T> | z.ZodCoercedNumber<T>

type SchemaChecker = (input: Input) => boolean
type SchemaGetter = (
  input: Input,
  translations?: Record<string, string>
) => z.ZodType

const approach: Array<[SchemaChecker, SchemaGetter]> = [
  [isCheckbox, getBoolean],
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

export function getEmail(input: Input, translations?: Record<string, string>) {
  const baseSchema = z.string().trim()

  if (input.required) {
    const message = getRequiredMessage(input, translations)
    const schema = baseSchema
      .min(1, message)
      .pipe(applyEmail(input, translations))

    return z.preprocess((value) => (isEmpty(value) ? '' : value), schema)
  }

  return baseSchema
    .pipe(applyEmail(input, translations))
    .or(z.literal(''))
    .nullable()
}

export function getBoolean(
  input: Input,
  translations?: Record<string, string>
) {
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

export function getRadio(input: Input, translations?: Record<string, string>) {
  let schema = z.coerce.string()
  if (input.required) {
    schema = schema.min(1, getRequiredMessage(input, translations))
    return z.preprocess((value) => (isEmpty(value) ? '' : value), schema)
  }
  return schema.or(z.literal('')).nullable()
}

export function getText(input: Input, translations?: Record<string, string>) {
  let schema = z.coerce.string().trim()
  schema = applyMinAndMax(schema, input, translations)

  if (input.required) {
    schema = applyRequired(schema, input, translations)
    return z.preprocess((value) => (isEmpty(value) ? '' : value), schema)
  }
  return schema.nullable()
}

export function getNumber(input: Input, translations?: Record<string, string>) {
  let schema = z.coerce.number().int()
  schema = applyMinAndMax(schema, input, translations)

  if (input.required) {
    schema = applyRequired(schema, input, translations)
    return z.preprocess((value) => (value === null ? undefined : value), schema)
  }
  return schema.nullable()
}

export function getYearSchema(
  input: Input,
  translations?: Record<string, string>
) {
  if (input.required) {
    return z.preprocess(
      normalize,
      z.coerce
        .number({ message: getRequiredMessage(input, translations) })
        .int()
    )
  }
  return z.coerce.number().int().nullable()
}

export function getMonthSchema(
  input: Input,
  translations?: Record<string, string>
) {
  const message = getRequiredMessage(input, translations)
  const schema = z.coerce.number().int().min(1, message).max(12, message)

  return !input.required ? schema.nullable() : schema
}

function normalize(value: unknown) {
  return value === null || value === '' ? undefined : value
}

function applyEmail(input: Input, translations?: Record<string, string>) {
  const message = input.validation?.email
    ? translate(input.validation?.email, translations)
    : undefined

  return z.email(message)
}

function applyMinAndMax<T extends Coerced>(
  schema: T,
  input: Input,
  translations?: Record<string, string>
): T {
  schema = min(schema, input, translations)
  schema = max(schema, input, translations)
  return schema
}

function applyRequired<T extends Coerced>(
  schema: T,
  input: Input,
  translations?: Record<string, string>
): T {
  const min = input.advanced?.length?.min
  if (min === undefined || min < 1) {
    return schema.min(1, getRequiredMessage(input, translations)) as T
  }
  return schema
}

const min = <T extends Coerced>(
  schema: T,
  input: Input,
  translations?: Record<string, string>
) => applyConstraint(schema, input, MIN, translations)

const max = <T extends Coerced>(
  schema: T,
  input: Input,
  translations?: Record<string, string>
) => applyConstraint(schema, input, MAX, translations)

function applyConstraint<T extends Coerced>(
  schema: T,
  input: Input,
  method: typeof MIN | typeof MAX,
  translations?: Record<string, string>
) {
  const value = input.advanced?.length?.[method]
  if (value !== undefined) {
    const message = input.validation?.length?.[method]
      ? translate(input.validation?.length?.[method], translations)
      : undefined

    return schema[method](value, message) as T
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
    return operation(data[name], data[rule.field])
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

export function getArraySchema(
  input: Input,
  translations?: Record<string, string>
) {
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

export function buildFormSchema(
  sections: Sections,
  translations?: Record<string, string>,
  definition?: Definition
): z.ZodType {
  const resolved = (
    definition ? resolveRefs(sections, definition) : sections
  ) as Sections

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
        const leaf = getSchema(entry, translations)
        shape[entry.name] = entry.required ? leaf : leaf.optional()
        leaves.push(entry)
      }
    }
  }

  visit(fields)
  return buildSchema(shape, leaves, translations)
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
export function applyDeclarativeRules<T extends z.ZodType>(
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
  const value = data[field.name]

  const requiredWhen = field.validation?.requiredWhen
  if (requiredWhen) {
    const rules = Array.isArray(requiredWhen) ? requiredWhen : [requiredWhen]
    const firing = rules.find((rule) => conditionHolds(data, rule))
    if (firing && !hasValue(value)) {
      issues.push({
        path: [field.name],
        message: message(
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
      message: message(pattern.message, translations),
    })
  }

  for (const rule of field.validation?.rules ?? []) {
    if (whenHolds(data, rule.when) && !runAssert(rule, value)) {
      issues.push({
        path: [field.name],
        message: message(rule.message, translations),
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
  return operation(extract(data, rule.field), rule.value)
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
  if (pattern.allowInterpolation && isInterpolated(value)) {
    return true
  }
  return new RegExp(pattern.regex, pattern.flags).test(value)
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

function message(
  value: string | undefined,
  translations?: Record<string, string>
): string | undefined {
  return value ? translate(value, translations) : undefined
}

function applyListLength<T extends z.ZodType>(
  items: z.ZodArray<T>,
  list: List,
  translations?: Record<string, string>
): z.ZodArray<T> {
  let schema = items
  const min = list.advanced?.length?.min
  if (min !== undefined) {
    schema = schema.min(
      min,
      message(list.validation?.length?.min, translations)
    )
  }
  const max = list.advanced?.length?.max
  if (max !== undefined) {
    schema = schema.max(
      max,
      message(list.validation?.length?.max, translations)
    )
  }
  return schema
}
