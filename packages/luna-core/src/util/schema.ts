import { MAX, MIN } from './constant'
import {
  isCheckbox,
  isEmail,
  isNumber,
  isRadio,
  isSelectMonth,
  isSelectYear,
} from './is-input'
import { isEmpty } from './is-type'
import { operators } from './operator'
import { z } from 'zod'
import type {
  CustomValidation,
  Field,
  Input,
  Schemas,
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
  [isNumber, getNumber],
  [isEmail, getEmail],
  [isSelectYear, getYearSchema],
  [isSelectMonth, getMonthSchema],
  [isCheckbox, getBoolean],
  [isRadio, getRadio],
]

export function buildSchema(
  schemas: Schemas,
  fields: Field[] = [],
  translations?: Record<string, string>
) {
  const schema = z.object(schemas)
  if (fields.length === 0) {
    return schema
  }
  return applyCustomValidation(schema, fields, translations)
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
  let schema = z.coerce.boolean()
  if (input.required) {
    schema = schema.refine((value) => value === true, {
      message: getRequiredMessage(input, translations),
    })
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
