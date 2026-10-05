import { applyCustomValidation } from '@/packages/luna-core/src/util/schema'
import { describe, expect, test, vi } from 'vitest'
import {
  buildSchema,
  getDateSchema,
  getEmail,
  getMonthSchema,
  getNumber,
  getSchema,
  getText,
  getYearSchema,
} from '@/packages/luna-core/src/util/schema'
import { z } from 'zod'
import type {
  Date as DateField,
  Field,
  Input,
} from '@/packages/luna-core/src/type'

describe('Schema Utility', () => {
  test('should create an email schema with required validation', () => {
    const input = {
      name: 'email',
      required: true,
      type: 'input/email',
      validation: {
        required: 'Email is required',
      },
    }

    const schema = getEmail(input)
    expect(schema.safeParse('').success).toBe(false)
    expect(schema.safeParse(null).success).toBe(false)
    expect(schema.safeParse('invalid-email').success).toBe(false)
    expect(schema.safeParse('test@example.com').success).toBe(true)
  })

  test('should create an email schema with custom validation message', () => {
    const input = {
      name: 'email',
      required: true,
      type: 'input/email',
      validation: {
        required: 'Email is required',
        email: 'Invalid email format',
      },
    }

    const schema = getEmail(input)
    const emptyResult = schema.safeParse('')
    expect(emptyResult.success).toBe(false)
    expect(emptyResult.error?.issues[0].message).toBe('Email is required')

    const invalidResult = schema.safeParse('invalid-email')
    expect(invalidResult.success).toBe(false)
    expect(invalidResult.error?.issues[0].message).toBe('Invalid email format')

    expect(schema.safeParse('test@example.com').success).toBe(true)
  })

  test('should create an email schema without required validation', () => {
    const input = {
      name: 'email',
      required: false,
      type: 'input/email',
    }

    const schema = getEmail(input)
    expect(schema.safeParse('').success).toBe(true)
    expect(schema.safeParse(null).success).toBe(true)
    expect(schema.safeParse('invalid-email').success).toBe(false)
    expect(schema.safeParse('test@example.com').success).toBe(true)
  })

  test('should create a month schema with required validation', () => {
    const input = {
      name: 'month',
      required: true,
      type: 'input/month',
      validation: {
        required: 'Month is required',
      },
    }

    const schema = getMonthSchema(input)
    expect(schema.safeParse(null).success).toBe(false)
    expect(schema.safeParse(0).success).toBe(false)
    expect(schema.safeParse(13).success).toBe(false)
    expect(schema.safeParse(5).success).toBe(true)
  })

  test('should create a month schema with empty value', () => {
    const input = {
      name: 'month',
      type: 'input/month',
      required: true,
      validation: {
        required: 'Please select the expiration year',
      },
    }

    const schema = getMonthSchema(input)
    const validated = schema.safeParse('')

    expect(validated.success).toBe(false)
    expect(validated.error!.issues[0].message).toBe(
      'Please select the expiration year'
    )
  })

  test('should create a month schema without required validation', () => {
    const input = {
      name: 'month',
      required: false,
      type: 'input/month',
    }

    const schema = getMonthSchema(input)
    expect(schema.safeParse(null).success).toBe(true)
    expect(schema.safeParse(0).success).toBe(false)
    expect(schema.safeParse(13).success).toBe(false)
    expect(schema.safeParse(5).success).toBe(true)
  })

  test('should create a year schema with empty value', () => {
    const input = {
      name: 'year',
      type: 'input/year',
      required: true,
      validation: {
        required: 'Please select the expiration year',
      },
    }

    const schema = getYearSchema(input)
    const validated = schema.safeParse('')

    expect(validated.success).toBe(false)
    expect(validated.error!.issues[0].message).toBe(
      'Please select the expiration year'
    )
  })

  test('should create a year schema with required validation', () => {
    const input = {
      name: 'year',
      required: true,
      type: 'input/year',
      advanced: { length: { min: -3000, max: 3000 } },
      validation: {
        required: 'Year is required',
      },
    }

    const schema = getYearSchema(input)
    expect(schema.safeParse(null).success).toBe(false)
    expect(schema.safeParse(-2020).success).toBe(true)
    expect(schema.safeParse(2020).success).toBe(true)
  })

  test('should create a year schema without required validation', () => {
    const input = {
      name: 'year',
      required: false,
      type: 'input/year',
      advanced: { length: { min: -3000, max: 3000 } },
    }

    const schema = getYearSchema(input)
    expect(schema.safeParse(null).success).toBe(true)
    expect(schema.safeParse(2020).success).toBe(true)
    expect(schema.safeParse(-2020).success).toBe(true)
  })

  test('should create a number schema with required validation', () => {
    const input = {
      name: 'age',
      required: true,
      type: 'input/number',
      validation: {
        required: 'Age is required',
      },
    }

    const schema = getNumber(input)
    expect(schema.safeParse(null).success).toBe(false)
    expect(schema.safeParse(25).success).toBe(true)
  })

  test('should create a number schema without required validation', () => {
    const input = {
      name: 'age',
      required: false,
      type: 'input/number',
    }

    const schema = getNumber(input)
    expect(schema.safeParse(null).success).toBe(true)
    expect(schema.safeParse(25).success).toBe(true)
  })

  test('should create a number schema with min and max validation', () => {
    const input = {
      name: 'age',
      required: true,
      type: 'input/number',
      advanced: {
        length: {
          min: 18,
          max: 65,
        },
      },
      validation: {
        required: 'Age is required',
      },
    }

    const schema = getNumber(input)
    expect(schema.safeParse(17).success).toBe(false)
    expect(schema.safeParse(66).success).toBe(false)
    expect(schema.safeParse(30).success).toBe(true)
  })

  test('should create a number schema without min and max validation', () => {
    const input = {
      name: 'age',
      required: false,
      type: 'input/number',
    }

    const schema = getNumber(input)
    expect(schema.safeParse(null).success).toBe(true)
    expect(schema.safeParse(17).success).toBe(true)
    expect(schema.safeParse(100).success).toBe(true)
  })

  test('should create a text schema with required validation', () => {
    const input = {
      name: 'username',
      required: true,
      type: 'input/text',
      validation: {
        required: 'Username is required',
      },
    }

    const schema = getText(input)
    expect(schema.safeParse('').success).toBe(false)
    expect(schema.safeParse(null).success).toBe(false)
    expect(schema.safeParse('validUser').success).toBe(true)
  })

  test('should create a text schema without required validation', () => {
    const input = {
      name: 'username',
      required: false,
      type: 'input/text',
    }

    const schema = getText(input)
    expect(schema.safeParse('').success).toBe(true)
    expect(schema.safeParse(null).success).toBe(true)
    expect(schema.safeParse('validUser').success).toBe(true)
  })

  test('should create a text schema with min and max length validation', () => {
    const input = {
      name: 'username',
      required: true,
      type: 'input/text',
      advanced: {
        length: {
          min: 3,
          max: 10,
        },
      },
      validation: {
        required: 'Username is required',
      },
    }

    const schema = getText(input)
    expect(schema.safeParse('ab').success).toBe(false)
    expect(schema.safeParse('abcdefghijk').success).toBe(false)
    expect(schema.safeParse('validUser').success).toBe(true)
  })

  test('should create a text schema without min and max length validation', () => {
    const input = {
      name: 'username',
      required: false,
      type: 'input/text',
    }

    const schema = getText(input)
    expect(schema.safeParse(null).success).toBe(true)
    expect(schema.safeParse('a').success).toBe(true)
    expect(schema.safeParse('thisIsAVeryLongUsername').success).toBe(true)
  })

  test('should create a schema with required and length validations', () => {
    const input = {
      name: 'customField',
      required: true,
      type: 'input/text',
      advanced: {
        length: {
          min: 2,
          max: 5,
        },
      },
      validation: {
        required: 'This field is required',
      },
    }

    const schema = getSchema(input)
    expect(schema.safeParse('').success).toBe(false)
    expect(schema.safeParse(null).success).toBe(false)
    expect(schema.safeParse('a').success).toBe(false)
    expect(schema.safeParse('abcdef').success).toBe(false)
    expect(schema.safeParse('abc').success).toBe(true)
  })

  test('should create a boolean schema with required validation', () => {
    const input = {
      name: 'terms',
      required: true,
      type: 'checkbox',
      validation: {
        required: 'You must accept the terms',
      },
    }

    const schema = getSchema(input)
    expect(schema.safeParse(false).success).toBe(false)
    expect(schema.safeParse(true).success).toBe(true)
  })

  test('should create a radio schema with required validation', () => {
    const input = {
      name: 'gender',
      required: true,
      type: 'radio',
      validation: {
        required: 'Gender is required',
      },
    }

    const schema = getSchema(input)
    expect(schema.safeParse('').success).toBe(false)
    expect(schema.safeParse(null).success).toBe(false)
    expect(schema.safeParse('male').success).toBe(true)
  })

  test('should create a radio schema without required validation', () => {
    const input = {
      name: 'gender',
      required: false,
      type: 'radio',
    }

    const schema = getSchema(input)
    expect(schema.safeParse('').success).toBe(true)
    expect(schema.safeParse(null).success).toBe(true)
    expect(schema.safeParse('male').success).toBe(true)
  })

  test('should return schema without custom validation when fields are empty', () => {
    const schemas = {
      name: z.string(),
      email: z.string(),
    }

    const result = buildSchema(schemas, [])
    expect(
      result.safeParse({ name: 'John', email: 'john@example.com' }).success
    ).toBe(true)
  })

  test('should apply eq custom validation through buildSchema', () => {
    const schemas = {
      password: z.string(),
      confirmPassword: z.string(),
    }

    const fields: Field[] = [
      { name: 'password', type: 'input/text' },
      {
        name: 'confirmPassword',
        type: 'input/text',
        validation: {
          custom: {
            field: 'password',
            operator: 'eq',
            message: 'Passwords must match',
          },
        },
      },
    ]

    const result = buildSchema(schemas, fields)

    expect(
      result.safeParse({ password: 'secret', confirmPassword: 'secret' })
        .success
    ).toBe(true)

    const failResult = result.safeParse({
      password: 'secret',
      confirmPassword: 'different',
    })
    expect(failResult.success).toBe(false)
    expect(failResult.error?.issues[0].message).toBe('Passwords must match')
  })

  test('should apply gt custom validation through buildSchema', () => {
    const schemas = {
      minPrice: z.number(),
      maxPrice: z.number(),
    }

    const fields: Field[] = [
      { name: 'minPrice', type: 'input/number' },
      {
        name: 'maxPrice',
        type: 'input/number',
        validation: {
          custom: {
            field: 'minPrice',
            operator: 'gt',
            message: 'Max price must be greater than min price',
          },
        },
      },
    ]

    const result = buildSchema(schemas, fields)

    expect(result.safeParse({ minPrice: 10, maxPrice: 20 }).success).toBe(true)

    const failResult = result.safeParse({ minPrice: 20, maxPrice: 10 })
    expect(failResult.success).toBe(false)
    expect(failResult.error?.issues[0].message).toBe(
      'Max price must be greater than min price'
    )
  })

  test('should apply gte custom validation through buildSchema', () => {
    const schemas = {
      startYear: z.number(),
      endYear: z.number(),
    }

    const fields: Field[] = [
      { name: 'startYear', type: 'input/number' },
      {
        name: 'endYear',
        type: 'input/number',
        validation: {
          custom: {
            field: 'startYear',
            operator: 'gte',
            message: 'End year must be equal or after start year',
          },
        },
      },
    ]

    const result = buildSchema(schemas, fields)

    expect(result.safeParse({ startYear: 2020, endYear: 2020 }).success).toBe(
      true
    )
    expect(result.safeParse({ startYear: 2020, endYear: 2025 }).success).toBe(
      true
    )

    const failResult = result.safeParse({ startYear: 2025, endYear: 2020 })
    expect(failResult.success).toBe(false)
    expect(failResult.error?.issues[0].message).toBe(
      'End year must be equal or after start year'
    )
  })

  test('should apply lt custom validation through buildSchema', () => {
    const schemas = {
      maxQuantity: z.number(),
      currentQuantity: z.number(),
    }

    const fields: Field[] = [
      { name: 'maxQuantity', type: 'input/number' },
      {
        name: 'currentQuantity',
        type: 'input/number',
        validation: {
          custom: {
            field: 'maxQuantity',
            operator: 'lt',
            message: 'Current quantity must be less than max',
          },
        },
      },
    ]

    const result = buildSchema(schemas, fields)

    expect(
      result.safeParse({ maxQuantity: 100, currentQuantity: 50 }).success
    ).toBe(true)

    const failResult = result.safeParse({
      maxQuantity: 100,
      currentQuantity: 150,
    })
    expect(failResult.success).toBe(false)
    expect(failResult.error?.issues[0].message).toBe(
      'Current quantity must be less than max'
    )
  })

  test('should apply lte custom validation through buildSchema', () => {
    const schemas = {
      budgetLimit: z.number(),
      expense: z.number(),
    }

    const fields: Field[] = [
      { name: 'budgetLimit', type: 'input/number' },
      {
        name: 'expense',
        type: 'input/number',
        validation: {
          custom: {
            field: 'budgetLimit',
            operator: 'lte',
            message: 'Expense cannot exceed budget limit',
          },
        },
      },
    ]

    const result = buildSchema(schemas, fields)

    expect(result.safeParse({ budgetLimit: 1000, expense: 1000 }).success).toBe(
      true
    )
    expect(result.safeParse({ budgetLimit: 1000, expense: 500 }).success).toBe(
      true
    )

    const failResult = result.safeParse({ budgetLimit: 1000, expense: 1500 })
    expect(failResult.success).toBe(false)
    expect(failResult.error?.issues[0].message).toBe(
      'Expense cannot exceed budget limit'
    )
  })

  test('should apply multiple custom validations through buildSchema', () => {
    const schemas = {
      minValue: z.number(),
      maxValue: z.number(),
      targetValue: z.number(),
    }

    const fields: Field[] = [
      { name: 'minValue', type: 'input/number' },
      { name: 'maxValue', type: 'input/number' },
      {
        name: 'targetValue',
        type: 'input/number',
        validation: {
          custom: [
            {
              field: 'minValue',
              operator: 'gte',
              message: 'Target must be at least min value',
            },
            {
              field: 'maxValue',
              operator: 'lte',
              message: 'Target must not exceed max value',
            },
          ],
        },
      },
    ]

    const result = buildSchema(schemas, fields)

    expect(
      result.safeParse({ minValue: 10, maxValue: 100, targetValue: 50 }).success
    ).toBe(true)

    const belowMinResult = result.safeParse({
      minValue: 10,
      maxValue: 100,
      targetValue: 5,
    })
    expect(belowMinResult.success).toBe(false)
    expect(belowMinResult.error?.issues[0].message).toBe(
      'Target must be at least min value'
    )

    const aboveMaxResult = result.safeParse({
      minValue: 10,
      maxValue: 100,
      targetValue: 150,
    })
    expect(aboveMaxResult.success).toBe(false)
    expect(aboveMaxResult.error?.issues[0].message).toBe(
      'Target must not exceed max value'
    )
  })

  test('should use eq operator by default when operator is not specified', () => {
    const schemas = {
      email: z.string(),
      confirmEmail: z.string(),
    }

    const fields: Field[] = [
      { name: 'email', type: 'input/email' },
      {
        name: 'confirmEmail',
        type: 'input/email',
        validation: {
          custom: {
            field: 'email',
            message: 'Emails must match',
          },
        },
      },
    ]

    const result = buildSchema(schemas, fields)

    expect(
      result.safeParse({
        email: 'test@example.com',
        confirmEmail: 'test@example.com',
      }).success
    ).toBe(true)

    const failResult = result.safeParse({
      email: 'test@example.com',
      confirmEmail: 'different@example.com',
    })
    expect(failResult.success).toBe(false)
    expect(failResult.error?.issues[0].message).toBe('Emails must match')
  })

  test('should return same schema if no comparison rules are present', () => {
    const schema = z.object({
      field1: z.string(),
    })
    const fields: Field[] = [{ name: 'field1', type: 'text' }]

    const result = applyCustomValidation(schema, fields)
    expect(result).toBe(schema)
  })

  test('should validate equal values (eq operator)', () => {
    const schema = z.object({
      password: z.string(),
      confirmPassword: z.string(),
    })
    const fields: Field[] = [
      { name: 'password', type: 'password' },
      {
        name: 'confirmPassword',
        type: 'password',
        validation: {
          custom: {
            field: 'password',
            operator: 'eq',
            message: 'Passwords must match',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)

    // Valid case
    expect(
      result.safeParse({ password: '123', confirmPassword: '123' }).success
    ).toBe(true)

    // Invalid case
    const parseResult = result.safeParse({
      password: '123',
      confirmPassword: '456',
    })
    expect(parseResult.success).toBe(false)
    expect(parseResult.error?.issues[0].message).toBe('Passwords must match')
    expect(parseResult.error?.issues[0].path).toEqual(['confirmPassword'])
  })

  test('should default to eq operator if not specified', () => {
    const schema = z.object({
      a: z.string(),
      b: z.string(),
    })
    const fields: Field[] = [
      { name: 'a', type: 'text' },
      {
        name: 'b',
        type: 'text',
        validation: {
          custom: {
            field: 'a',
            message: 'Must be equal',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    expect(result.safeParse({ a: 'x', b: 'x' }).success).toBe(true)
    expect(result.safeParse({ a: 'x', b: 'y' }).success).toBe(false)
  })

  test('should validate not equal values (neq operator)', () => {
    const schema = z.object({
      currentName: z.string(),
      newName: z.string(),
    })
    const fields: Field[] = [
      { name: 'currentName', type: 'text' },
      {
        name: 'newName',
        type: 'text',
        validation: {
          custom: {
            field: 'currentName',
            operator: 'neq',
            message: 'New name must be different',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    expect(
      result.safeParse({ currentName: 'john', newName: 'doe' }).success
    ).toBe(true)
    expect(
      result.safeParse({ currentName: 'john', newName: 'john' }).success
    ).toBe(false)
  })

  test('should validate in operator', () => {
    const schema = z.object({
      list: z.array(z.string()),
      item: z.string(),
    })
    const fields: Field[] = [
      { name: 'list', type: 'list' },
      {
        name: 'item',
        type: 'text',
        validation: {
          custom: {
            field: 'list',
            operator: 'in',
            message: 'Item must be in list',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    expect(result.safeParse({ list: ['a', 'b'], item: 'a' }).success).toBe(true)
    expect(result.safeParse({ list: ['a', 'b'], item: 'c' }).success).toBe(
      false
    )
  })

  test('should validate nin operator', () => {
    const schema = z.object({
      blacklist: z.array(z.string()),
      username: z.string(),
    })
    const fields: Field[] = [
      { name: 'blacklist', type: 'list' },
      {
        name: 'username',
        type: 'text',
        validation: {
          custom: {
            field: 'blacklist',
            operator: 'nin',
            message: 'Username is blacklisted',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    expect(
      result.safeParse({ blacklist: ['admin', 'root'], username: 'user' })
        .success
    ).toBe(true)
    expect(
      result.safeParse({ blacklist: ['admin', 'root'], username: 'admin' })
        .success
    ).toBe(false)
  })

  test('should handle multiple comparison rules for a single field', () => {
    const schema = z.object({
      a: z.number(),
      b: z.number(),
      c: z.number(),
    })
    const fields: Field[] = [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      {
        name: 'c',
        type: 'number',
        validation: {
          custom: [
            { field: 'a', operator: 'neq', message: 'C must not be A' },
            { field: 'b', operator: 'eq', message: 'C must be B' },
          ],
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    // a=1, b=2, c=2 (c != a and c == b) -> OK
    expect(result.safeParse({ a: 1, b: 2, c: 2 }).success).toBe(true)

    // a=2, b=2, c=2 (c == a) -> FAIL
    const fail1 = result.safeParse({ a: 2, b: 2, c: 2 })
    expect(fail1.success).toBe(false)
    expect(fail1.error?.issues[0].message).toBe('C must not be A')

    // a=1, b=3, c=2 (c != b) -> FAIL
    const fail2 = result.safeParse({ a: 1, b: 3, c: 2 })
    expect(fail2.success).toBe(false)
    expect(fail2.error?.issues[0].message).toBe('C must be B')
  })

  test('should validate greater than (gt operator)', () => {
    const schema = z.object({
      minPrice: z.number(),
      maxPrice: z.number(),
    })
    const fields: Field[] = [
      { name: 'minPrice', type: 'number' },
      {
        name: 'maxPrice',
        type: 'number',
        validation: {
          custom: {
            field: 'minPrice',
            operator: 'gt',
            message: 'Max price must be greater than min price',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    expect(result.safeParse({ minPrice: 10, maxPrice: 20 }).success).toBe(true)
    expect(result.safeParse({ minPrice: 10, maxPrice: 10 }).success).toBe(false)
    expect(result.safeParse({ minPrice: 20, maxPrice: 10 }).success).toBe(false)
  })

  test('should validate greater than or equal (gte operator)', () => {
    const schema = z.object({
      startYear: z.number(),
      endYear: z.number(),
    })
    const fields: Field[] = [
      { name: 'startYear', type: 'number' },
      {
        name: 'endYear',
        type: 'number',
        validation: {
          custom: {
            field: 'startYear',
            operator: 'gte',
            message: 'End year must be equal or after start year',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    expect(result.safeParse({ startYear: 2020, endYear: 2025 }).success).toBe(
      true
    )
    expect(result.safeParse({ startYear: 2020, endYear: 2020 }).success).toBe(
      true
    )
    expect(result.safeParse({ startYear: 2025, endYear: 2020 }).success).toBe(
      false
    )
  })

  test('should validate less than (lt operator)', () => {
    const schema = z.object({
      maxQuantity: z.number(),
      currentQuantity: z.number(),
    })
    const fields: Field[] = [
      { name: 'maxQuantity', type: 'number' },
      {
        name: 'currentQuantity',
        type: 'number',
        validation: {
          custom: {
            field: 'maxQuantity',
            operator: 'lt',
            message: 'Current quantity must be less than max',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    expect(
      result.safeParse({ maxQuantity: 100, currentQuantity: 50 }).success
    ).toBe(true)
    expect(
      result.safeParse({ maxQuantity: 100, currentQuantity: 100 }).success
    ).toBe(false)
    expect(
      result.safeParse({ maxQuantity: 100, currentQuantity: 150 }).success
    ).toBe(false)
  })

  test('should validate less than or equal (lte operator)', () => {
    const schema = z.object({
      budgetLimit: z.number(),
      expense: z.number(),
    })
    const fields: Field[] = [
      { name: 'budgetLimit', type: 'number' },
      {
        name: 'expense',
        type: 'number',
        validation: {
          custom: {
            field: 'budgetLimit',
            operator: 'lte',
            message: 'Expense cannot exceed budget limit',
          },
        },
      },
    ]

    const result = applyCustomValidation(schema, fields)
    expect(result.safeParse({ budgetLimit: 1000, expense: 500 }).success).toBe(
      true
    )
    expect(result.safeParse({ budgetLimit: 1000, expense: 1000 }).success).toBe(
      true
    )
    expect(result.safeParse({ budgetLimit: 1000, expense: 1500 }).success).toBe(
      false
    )
  })

  test('should translate validation messages in getSchema', () => {
    const input: Input = {
      name: 'email',
      required: true,
      type: 'input/email',
      validation: {
        required: 'email.required',
      },
    }
    const translations = {
      'email.required': 'El correo electrónico es obligatorio',
    }

    const schema = getSchema(input, translations)
    const result = schema.safeParse('')
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'El correo electrónico es obligatorio'
    )
  })

  test('should translate custom validation messages', () => {
    const schema = z.object({
      password: z.string(),
      confirm: z.string(),
    })
    const fields: Field[] = [
      {
        name: 'confirm',
        type: 'password',
        validation: {
          custom: {
            field: 'password',
            operator: 'eq',
            message: 'password.match',
          },
        },
      },
    ]
    const translations = {
      'password.match': 'Las contraseñas no coinciden',
    }

    const result = applyCustomValidation(schema, fields, translations)
    const validation = result.safeParse({ password: '123', confirm: '456' })
    expect(validation.success).toBe(false)
    expect(validation.error?.issues[0].message).toBe(
      'Las contraseñas no coinciden'
    )
  })

  test('should translate email format validation message in getSchema', () => {
    const input: Input = {
      name: 'email',
      required: false,
      type: 'input/email',
      validation: {
        email: 'email.invalid',
      },
    }
    const translations = {
      'email.invalid': 'Formato de correo inválido',
    }

    const schema = getSchema(input, translations)
    const result = schema.safeParse('not-an-email')
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Formato de correo inválido')
  })
})

// A day is checked as `yyyy-MM-dd` however it arrived, and leaves the schema in
// that shape: what the submit sends is what this returns.
describe('date schema', () => {
  const date = (extra: Partial<DateField> = {}): DateField => ({
    name: 'check_in',
    type: 'input/date',
    advanced: { format: 'dd/MM/yyyy' },
    ...extra,
  })

  test('should read a day typed in the field format as yyyy-MM-dd', () => {
    expect(getDateSchema(date()).parse('15/01/2024')).toBe('2024-01-15')
  })

  test('should read a day already in yyyy-MM-dd', () => {
    expect(getDateSchema(date()).parse('2024-01-15')).toBe('2024-01-15')
  })

  // As the form asks for it: with the field it renders.
  test('should be the schema getSchema gives an input/date', () => {
    const field: Field = date()
    expect(getSchema(field).parse('15/01/2024')).toBe('2024-01-15')
  })

  test('should hold back text that is no day', () => {
    const result = getDateSchema(date()).safeParse('next tuesday')

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Invalid date',
    ])
  })

  test('should hold back a day that does not exist with its own message', () => {
    const result = getDateSchema(
      date({ validation: { date: 'Write it as 15/01/2024' } })
    ).safeParse('30/02/2026')

    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Write it as 15/01/2024',
    ])
  })

  test('should leave an optional date nobody gave out of the result', () => {
    const schema = getDateSchema(date())

    expect(schema.parse('')).toBeUndefined()
    expect(schema.parse('   ')).toBeUndefined()
    expect(schema.parse(undefined)).toBeUndefined()
    expect(schema.parse(null)).toBeUndefined()
  })

  test('should ask for a required date with its message', () => {
    const schema = getDateSchema(
      date({ required: true, validation: { required: 'Pick a day' } })
    )

    for (const empty of ['', '   ', undefined, null]) {
      const result = schema.safeParse(empty)
      expect(result.error?.issues.map((issue) => issue.message)).toEqual([
        'Pick a day',
      ])
    }
  })
})

// Two days in one field, `[from, to]`. Each end answers to the rules of a
// single day, the last cannot come before the first, and no reserved day may
// fall between them.
describe('date ranges', () => {
  const range = (extra: Partial<DateField> = {}): DateField => ({
    name: 'stay',
    type: 'input/date',
    advanced: {
      format: 'dd/MM/yyyy',
      mode: 'range',
      length: { min: '2026-10-01', max: '2026-12-31' },
      reserved: ['2026-12-24'],
    },
    ...extra,
  })

  const messagesOf = (result: { error?: z.ZodError }) =>
    result.error?.issues.map((issue) => issue.message)

  test('should give back both ends as yyyy-MM-dd', () => {
    const schema = getDateSchema(range())

    expect(schema.parse(['2026-10-03', '06/10/2026'])).toEqual([
      '2026-10-03',
      '2026-10-06',
    ])
    expect(schema.parse(['2026-10-03', '2026-10-03'])).toEqual([
      '2026-10-03',
      '2026-10-03',
    ])
  })

  test('should hold back half a range and one that runs backwards', () => {
    const schema = getDateSchema(
      range({ validation: { range: 'Pick the first and the last night' } })
    )

    for (const value of [
      ['2026-10-03', ''],
      ['', '2026-10-06'],
      ['2026-10-06', '2026-10-03'],
    ]) {
      expect(messagesOf(schema.safeParse(value))).toEqual([
        'Pick the first and the last night',
      ])
    }
    expect(
      messagesOf(getDateSchema(range()).safeParse(['2026-10-03', '']))
    ).toEqual(['Invalid date range'])
  })

  test('should check each end like a single day', () => {
    const schema = getDateSchema(range())

    expect(messagesOf(schema.safeParse(['2026-09-30', '2026-10-03']))).toEqual([
      'Date must be on or after 01/10/2026',
    ])
    expect(
      messagesOf(schema.safeParse(['2026-10-03', 'next tuesday']))
    ).toEqual(['Invalid date'])
    expect(messagesOf(schema.safeParse(['2026-12-24', '2026-12-26']))).toEqual([
      'This date is not available',
    ])
  })

  test('should hold back a range with a reserved day inside it', () => {
    const schema = getDateSchema(range())

    expect(messagesOf(schema.safeParse(['2026-12-20', '2026-12-27']))).toEqual([
      'This date is not available',
    ])
    expect(schema.parse(['2026-12-25', '2026-12-27'])).toEqual([
      '2026-12-25',
      '2026-12-27',
    ])
  })

  // A value that is no range is held back as such, not taken for one nobody
  // picked: on the server, a malformed payload would otherwise pass.
  test('should hold back a value that is no range', () => {
    const schema = getDateSchema(range())

    for (const value of [
      [20261003, 20261006],
      { from: '2026-10-03', to: '2026-10-06' },
      5,
      ['', '', '2026-10-09'],
      ['2026-10-03', '2026-10-06', '2026-10-09'],
    ]) {
      expect(messagesOf(schema.safeParse(value))).toEqual(['Invalid date'])
    }
  })

  test('should read a range nobody picked as absent, or ask for it', () => {
    const optional = getDateSchema(range())
    for (const empty of [undefined, null, '', [], ['', ''], ['  ', '']]) {
      expect(optional.parse(empty)).toBeUndefined()
    }

    const required = getDateSchema(
      range({ required: true, validation: { required: 'Pick your stay' } })
    )
    expect(messagesOf(required.safeParse(['', '']))).toEqual(['Pick your stay'])
  })
})

// Days nobody may pick, whatever the bounds allow: a stay that is booked, a
// holiday. They are written as `yyyy-MM-dd`, like the bounds.
describe('reserved days', () => {
  const reserving = (extra: Partial<DateField> = {}): DateField => ({
    name: 'night',
    type: 'input/date',
    advanced: { format: 'dd/MM/yyyy', reserved: ['2026-12-24', '2026-12-25'] },
    ...extra,
  })

  const messagesOf = (result: { error?: z.ZodError }) =>
    result.error?.issues.map((issue) => issue.message)

  test('should hold back a reserved day however it was typed', () => {
    const schema = getDateSchema(reserving())

    expect(messagesOf(schema.safeParse('2026-12-24'))).toEqual([
      'This date is not available',
    ])
    expect(messagesOf(schema.safeParse('25/12/2026'))).toEqual([
      'This date is not available',
    ])
  })

  test('should take the days around a reserved one', () => {
    const schema = getDateSchema(reserving())

    expect(schema.parse('2026-12-23')).toBe('2026-12-23')
    expect(schema.parse('26/12/2026')).toBe('2026-12-26')
  })

  test('should say what is wrong with the message the field declares', () => {
    const schema = getDateSchema(
      reserving({ validation: { reserved: 'That night is taken' } })
    )

    expect(messagesOf(schema.safeParse('2026-12-24'))).toEqual([
      'That night is taken',
    ])
  })

  test('should check the bounds before the reservations', () => {
    const schema = getDateSchema(
      reserving({
        advanced: {
          length: { max: '2026-12-20' },
          reserved: ['2026-12-24'],
        },
      })
    )

    expect(messagesOf(schema.safeParse('2026-12-24'))).toEqual([
      'Date must be on or before December 20, 2026',
    ])
  })

  // A list that did not arrive, or an entry that is no day, is a rule the form
  // cannot read: it takes no day, and whoever wrote the form is told which.
  test('should hold back every day for a list nothing resolved and an entry that is no day', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const unresolved = getDateSchema(
        JSON.parse(
          '{"name":"night","type":"input/date","advanced":{"reserved":{"$ref":"#/context/booked"}}}'
        ) as DateField
      )
      const entries = getDateSchema(
        JSON.parse(
          '{"name":"night","type":"input/date","advanced":{"reserved":["2026-12-24","24/12/2026",{"$ref":"#/context/eve"}]}}'
        ) as DateField
      )

      expect(unresolved.safeParse('2026-12-23').error?.issues[0].message).toBe(
        'This date cannot be checked'
      )
      expect(entries.safeParse('2026-12-23').success).toBe(false)
      expect(warn.mock.calls.map((call) => call.slice(1).join(' '))).toEqual([
        'night: advanced.reserved points at #/context/booked, which nothing resolved, so the field takes no day',
        'night: advanced.reserved[1] is "24/12/2026", which is no yyyy-MM-dd day, so the field takes no day',
        'night: advanced.reserved[2] points at #/context/eve, which nothing resolved, so the field takes no day',
      ])
    } finally {
      warn.mockRestore()
    }
  })
})

// A date can be held between two days, both included. The bounds are written
// as `yyyy-MM-dd`, the shape a native `<input type="date">` takes for its own
// `min` and `max`, and a day is compared in that shape however it was typed.
describe('date bounds', () => {
  const bounded = (extra: Partial<DateField> = {}): DateField => ({
    name: 'check_in',
    type: 'input/date',
    advanced: {
      format: 'dd/MM/yyyy',
      length: { min: '2026-10-05', max: '2026-10-20' },
    },
    ...extra,
  })

  const messagesOf = (result: { error?: z.ZodError }) =>
    result.error?.issues.map((issue) => issue.message)

  test('should take both bounds and every day between them', () => {
    const schema = getDateSchema(bounded())

    expect(schema.parse('2026-10-05')).toBe('2026-10-05')
    expect(schema.parse('12/10/2026')).toBe('2026-10-12')
    expect(schema.parse('2026-10-20')).toBe('2026-10-20')
  })

  test('should hold back a day before the minimum or after the maximum', () => {
    const schema = getDateSchema(bounded())

    expect(messagesOf(schema.safeParse('2026-10-04'))).toEqual([
      'Date must be on or after 05/10/2026',
    ])
    expect(messagesOf(schema.safeParse('21/10/2026'))).toEqual([
      'Date must be on or before 20/10/2026',
    ])
  })

  test('should say what is wrong with the messages the field declares', () => {
    const schema = getDateSchema(
      bounded({
        validation: {
          length: {
            min: 'We open on October 5',
            max: 'We close on October 20',
          },
        },
      })
    )

    expect(messagesOf(schema.safeParse('2026-10-04'))).toEqual([
      'We open on October 5',
    ])
    expect(messagesOf(schema.safeParse('2026-10-21'))).toEqual([
      'We close on October 20',
    ])
  })

  test('should check a bound declared alone', () => {
    const schema = getDateSchema(
      bounded({ advanced: { length: { min: '2026-10-05' } } })
    )

    expect(schema.parse('2099-01-01')).toBe('2099-01-01')
    expect(schema.safeParse('2026-10-04').success).toBe(false)
  })

  test('should still leave an optional date nobody gave out of the result', () => {
    expect(getDateSchema(bounded()).parse('')).toBeUndefined()
  })

  // A bound that is no day is a rule the form cannot read, so it takes no day
  // rather than every day, and whoever wrote the form is told once, however
  // many times the schema is built for it.
  test('should hold back every day for a bound that is no day and name it once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const field = JSON.parse(
        '{"name":"check_in","type":"input/date","advanced":{"length":{"min":{"$ref":"#/context/today"},"max":"20/10/2026"}}}'
      ) as DateField

      const schema = getDateSchema(field)
      getDateSchema(field)

      expect(schema.safeParse('2000-01-01').success).toBe(false)
      expect(schema.safeParse('2099-01-01').success).toBe(false)
      expect(warn.mock.calls.map((call) => call.slice(1).join(' '))).toEqual([
        'check_in: advanced.length.min points at #/context/today, which nothing resolved, so the field takes no day',
        'check_in: advanced.length.max is "20/10/2026", which is no yyyy-MM-dd day, so the field takes no day',
      ])
    } finally {
      warn.mockRestore()
    }
  })

  // The form copies a field -- an optional one in the headless schema, a
  // read-only one while it renders -- but not the bounds it declares.
  test('should name a bound once however many copies of the field read it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const field = JSON.parse(
        '{"name":"check_in","type":"input/date","required":true,"advanced":{"length":{"min":"05/10/2026"}}}'
      ) as DateField

      getDateSchema(field)
      getDateSchema({ ...field, required: false })
      getDateSchema({ ...field, disabled: true })

      expect(warn).toHaveBeenCalledTimes(1)
    } finally {
      warn.mockRestore()
    }
  })

  test('should name bounds that are a $ref nothing resolved as a whole', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getDateSchema(
        JSON.parse(
          '{"name":"check_in","type":"input/date","advanced":{"length":{"$ref":"#/context/stay"}}}'
        ) as DateField
      )

      expect(schema.safeParse('2000-01-01').success).toBe(false)
      expect(warn.mock.calls.map((call) => call.slice(1).join(' '))).toEqual([
        'check_in: advanced.length points at #/context/stay, which nothing resolved, so the field takes no day',
      ])
    } finally {
      warn.mockRestore()
    }
  })

  test('should name a minimum after the maximum, which no day passes', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getDateSchema(
        bounded({
          advanced: { length: { min: '2026-10-20', max: '2026-10-05' } },
        })
      )

      expect(schema.safeParse('2026-10-10').success).toBe(false)
      expect(warn.mock.calls.map((call) => call.slice(1).join(' '))).toEqual([
        'check_in: advanced.length.min is after advanced.length.max, so no day passes',
      ])
    } finally {
      warn.mockRestore()
    }
  })
})

// A range is two days, and each answers to the rules of one: a rule the form
// cannot read holds back every range as it holds back every day.
describe('a date rule the form cannot read', () => {
  test('should hold back every range', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getDateSchema(
        JSON.parse(
          '{"name":"stay","type":"input/date","advanced":{"mode":"range","reserved":{"$ref":"#/context/booked"}}}'
        ) as DateField
      )

      expect(
        schema.safeParse(['2026-12-20', '2026-12-22']).error?.issues[0].message
      ).toBe('This date cannot be checked')
    } finally {
      warn.mockRestore()
    }
  })
})

// Outside the date family `advanced.length` is a number: characters for text,
// the value itself for a number. A bound that is not one -- a day written on a
// text field, a `$ref` nothing resolved -- is a rule the form cannot read, so
// the field takes no value rather than every value, as a date does with a
// bound that is no day, and whoever wrote the form is told once.
describe('a length bound the form cannot read', () => {
  const read = (json: string) => JSON.parse(json) as Input

  const messagesOf = (result: { error?: z.ZodError }) =>
    result.error?.issues.map((issue) => issue.message)

  const warningsOf = (warn: { mock: { calls: unknown[][] } }) =>
    warn.mock.calls.map((call) => call.slice(1).join(' '))

  test('should hold back every text there is, and let an optional one left empty pass', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getText(
        read(
          '{"name":"when","type":"datetime/expression","advanced":{"length":{"min":"2026-10-05","max":"2026-11-03"}}}'
        )
      )

      expect(schema.parse('')).toBe('')
      expect(messagesOf(schema.safeParse('2026-10-20'))).toEqual([
        'This value cannot be checked',
      ])
      expect(messagesOf(schema.safeParse('a'))).toEqual([
        'This value cannot be checked',
      ])
      expect(warningsOf(warn)).toEqual([
        'when: advanced.length.min is "2026-10-05", which is no number, so the field takes no value',
        'when: advanced.length.max is "2026-11-03", which is no number, so the field takes no value',
      ])
    } finally {
      warn.mockRestore()
    }
  })

  test('should still ask a required text for a value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getText(
        read(
          '{"name":"note","type":"input/text","required":true,"validation":{"required":"Write a note"},"advanced":{"length":{"min":{"$ref":"#/context/note.min"}}}}'
        )
      )

      expect(messagesOf(schema.safeParse(''))).toEqual(['Write a note'])
      expect(messagesOf(schema.safeParse('hello'))).toEqual([
        'This value cannot be checked',
      ])
      expect(warningsOf(warn)).toEqual([
        'note: advanced.length.min points at #/context/note.min, which nothing resolved, so the field takes no value',
      ])
    } finally {
      warn.mockRestore()
    }
  })

  test('should name bounds that are a $ref nothing resolved as a whole', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getText(
        read(
          '{"name":"note","type":"textarea","advanced":{"length":{"$ref":"#/context/note"}}}'
        )
      )

      expect(schema.safeParse('hello').success).toBe(false)
      expect(warningsOf(warn)).toEqual([
        'note: advanced.length points at #/context/note, which nothing resolved, so the field takes no value',
      ])
    } finally {
      warn.mockRestore()
    }
  })

  // An address is held back like any other text: whether it is one is no
  // longer the question.
  test('should hold back every address there is', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getEmail(
        read(
          '{"name":"email","type":"input/email","advanced":{"length":{"max":{"$ref":"#/context/email.max"}}}}'
        )
      )

      expect(schema.parse('')).toBe('')
      expect(messagesOf(schema.safeParse('ana@example.com'))).toEqual([
        'This value cannot be checked',
      ])
    } finally {
      warn.mockRestore()
    }
  })

  // The step counts from `length.min`, so a minimum that is no number cannot
  // say which values are on it either: one message says why, not two.
  test('should hold back every number there is with one message', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getNumber(
        read(
          '{"name":"guests","type":"input/number","advanced":{"step":2,"length":{"min":"2026-10-05"}}}'
        )
      )

      expect(schema.parse('')).toBeUndefined()
      expect(messagesOf(schema.safeParse('5'))).toEqual([
        'This value cannot be checked',
      ])
      expect(messagesOf(schema.safeParse('4'))).toEqual([
        'This value cannot be checked',
      ])
    } finally {
      warn.mockRestore()
    }
  })

  // The form copies a field -- an optional one in the headless schema, a
  // read-only one while it renders -- but not the bounds it declares.
  test('should name a bound once however many copies of the field read it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const field = read(
        '{"name":"guests","type":"input/number","required":true,"advanced":{"length":{"max":"ten"}}}'
      )

      getNumber(field)
      getNumber({ ...field, required: false })
      getText({ ...field, disabled: true })

      expect(warn).toHaveBeenCalledTimes(1)
    } finally {
      warn.mockRestore()
    }
  })

  test('should name a minimum above the maximum, which no value passes', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getNumber({
        name: 'guests',
        type: 'input/number',
        advanced: { length: { min: 5, max: 2 } },
      })

      expect(schema.safeParse('3').success).toBe(false)
      expect(warningsOf(warn)).toEqual([
        'guests: advanced.length.min is after advanced.length.max, so no value passes',
      ])
    } finally {
      warn.mockRestore()
    }
  })

  test('should keep checking bounds that are numbers', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const schema = getText({
        name: 'code',
        type: 'input/text',
        advanced: { length: { min: 2, max: 4 } },
      })

      expect(schema.parse('abc')).toBe('abc')
      expect(schema.safeParse('a').success).toBe(false)
      expect(schema.safeParse('abcde').success).toBe(false)
      expect(warn).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })
})
