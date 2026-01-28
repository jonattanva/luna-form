import { applyCustomValidation } from '@/packages/luna-core/src/util/schema'
import { expect, test } from '@playwright/test'
import {
  buildSchema,
  getEmail,
  getMonthSchema,
  getNumber,
  getSchema,
  getText,
  getYearSchema,
} from '@/packages/luna-core/src/util/schema'
import { z } from 'zod'
import type { Field } from '@/packages/luna-core/src/type'

test.describe('Schema Utility', { tag: ['@unit'] }, () => {
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
})
