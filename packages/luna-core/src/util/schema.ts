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

type Coerced<T = unknown> = z.ZodCoercedString<T> | z.ZodCoercedNumber<T>

type SchemaChecker = (input: Input) => boolean
type SchemaGetter = (input: Input) => z.ZodType

const approach: Array<[SchemaChecker, SchemaGetter]> = [
  [isNumber, getNumber],
  [isEmail, getEmail],
  [isSelectYear, getYearSchema],
  [isSelectMonth, getMonthSchema],
  [isCheckbox, getBoolean],
  [isRadio, getRadio],
]

export function buildSchema(schemas: Schemas, fields: Field[] = []) {
  const schema = z.object(schemas)
  if (fields.length === 0) {
    return schema
  }
  return applyCustomValidation(schema, fields)
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

export function getSchema(input: Input) {
  for (const [check, getSchema] of approach) {
    if (check(input)) {
      return getSchema(input)
    }
  }
  return getText(input)
}

export function getEmail(input: Input) {
  const baseSchema = z.string().trim()

  if (input.required) {
    const schema = baseSchema
      .min(1, input.validation?.required)
      .pipe(z.email(input.validation?.email))

    return z.preprocess((value) => (isEmpty(value) ? '' : value), schema)
  }

  return baseSchema
    .pipe(z.email(input.validation?.email))
    .or(z.literal(''))
    .nullable()
}

export function getBoolean(input: Input) {
  let schema = z.coerce.boolean()
  if (input.required) {
    schema = schema.refine((value) => value === true, {
      message: input.validation?.required,
    })
    return z.preprocess((value) => (value === null ? false : value), schema)
  }
  return schema.nullable()
}

export function getRadio(input: Input) {
  let schema = z.coerce.string()
  if (input.required) {
    schema = schema.min(1, input.validation?.required)
    return z.preprocess((value) => (isEmpty(value) ? '' : value), schema)
  }
  return schema.or(z.literal('')).nullable()
}

export function getText(input: Input) {
  let schema = z.coerce.string().trim()
  schema = applyMinAndMax(schema, input)

  if (input.required) {
    schema = applyRequired(schema, input)
    return z.preprocess((value) => (isEmpty(value) ? '' : value), schema)
  }
  return schema.nullable()
}

export function getNumber(input: Input) {
  let schema = z.coerce.number().int()
  schema = applyMinAndMax(schema, input)

  if (input.required) {
    schema = applyRequired(schema, input)
    return z.preprocess((value) => (value === null ? undefined : value), schema)
  }
  return schema.nullable()
}

export function getYearSchema(input: Input) {
  if (input.required) {
    const schema = z.coerce
      .number({ message: input.validation?.required })
      .int()

    return z.preprocess(normalize, schema)
  }
  return z.coerce.number().int().nullable()
}

export function getMonthSchema(input: Input) {
  const schema = z.coerce
    .number()
    .int()
    .min(1, input.validation?.required)
    .max(12, input.validation?.required)

  return !input.required ? schema.nullable() : schema
}

function normalize(value: unknown) {
  return value === null || value === '' ? undefined : value
}

function applyMinAndMax<T extends Coerced>(schema: T, input: Input): T {
  schema = min(schema, input)
  schema = max(schema, input)
  return schema
}

function applyRequired<T extends Coerced>(schema: T, input: Input): T {
  const min = input.advanced?.length?.min
  if (min === undefined || min < 1) {
    return schema.min(1, input.validation?.required) as T
  }
  return schema
}

const min = <T extends Coerced>(schema: T, input: Input) =>
  applyConstraint(schema, input, MIN)

const max = <T extends Coerced>(schema: T, input: Input) =>
  applyConstraint(schema, input, MAX)

function applyConstraint<T extends Coerced>(
  schema: T,
  input: Input,
  method: typeof MIN | typeof MAX
) {
  const value = input.advanced?.length?.[method]
  if (value !== undefined) {
    return schema[method](value, input.validation?.length?.[method]) as T
  }
  return schema
}

export function applyCustomValidation(schema: ZodSchema, fields: Field[] = []) {
  const rules = getRules(fields)
  if (rules.length === 0) {
    return schema
  }

  return schema.superRefine((data, context) => {
    for (const { name, rule } of rules) {
      if (!evaluate(data, name, rule)) {
        context.addIssue({
          code: 'custom',
          message: rule.message,
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
  getValue: (name: string) => unknown
) {
  const errors: string[] = []
  const collections = Array.isArray(rules) ? rules : [rules]

  for (const rule of collections) {
    const operator = rule.operator ?? 'eq'
    const operation = operators[operator]
    if (operation && !operation(value, getValue(rule.field))) {
      if (rule.message) {
        errors.push(rule.message)
      }
    }
  }

  return errors
}
