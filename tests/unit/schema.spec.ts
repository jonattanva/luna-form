import { expect, test } from '@playwright/test'
import {
  getEmail,
  getMonthSchema,
  getNumber,
  getSchema,
  getText,
  getYearSchema,
} from '@/packages/luna-core/src/util/schema'

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
})
