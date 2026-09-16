import { buildSchema, getSchema } from '@/packages/luna-core/src/util/schema'
import { describe, expect, test } from 'vitest'
import type { Input } from '@/packages/luna-core/src/type'

// What the submit does with the text a browser sends for a number. An
// `<input type="number">` sends "" when it is left empty and its digits as text
// otherwise, and a year or month select nobody picked sends "". Required means
// present, not "at least 1", and a number nobody gave is absent, not 0.
describe('number values', () => {
  const parse = (input: Input, value?: string) =>
    buildSchema({ [input.name]: getSchema(input) }).safeParse(
      value === undefined ? {} : { [input.name]: value }
    )

  const required: Input = {
    name: 'amount',
    type: 'input/number',
    required: true,
    validation: { required: 'Amount is required' },
  }

  test.each(['0', '-5'])('should accept %s for a required number', (value) => {
    const parsed = parse(required, value)

    expect(parsed.success).toBe(true)
    expect(parsed.data?.amount).toBe(Number(value))
  })

  test('should hold a required number left empty with its required message', () => {
    const parsed = parse(required, '')

    expect(parsed.success).toBe(false)
    expect(parsed.error?.issues[0].message).toBe('Amount is required')
  })

  test('should hold a required number whose key is missing with its required message', () => {
    const parsed = parse(required)

    expect(parsed.success).toBe(false)
    expect(parsed.error?.issues[0].message).toBe('Amount is required')
  })

  test('should ask for a required number with a minimum before its minimum', () => {
    const parsed = parse({ ...required, advanced: { length: { min: 5 } } }, '')

    expect(parsed.success).toBe(false)
    expect(parsed.error?.issues[0].message).toBe('Amount is required')
  })

  test('should leave an optional number left empty out, not send 0', () => {
    const parsed = parse({ name: 'amount', type: 'input/number' }, '')

    expect(parsed.success).toBe(true)
    expect(parsed.data?.amount).toBeUndefined()
  })

  test('should not hold an optional number with a minimum when it is left empty', () => {
    const parsed = parse(
      {
        name: 'amount',
        type: 'input/number',
        advanced: { length: { min: 5 } },
      },
      ''
    )

    expect(parsed.success).toBe(true)
    expect(parsed.data?.amount).toBeUndefined()
  })

  test('should still hold a number below its minimum', () => {
    const parsed = parse(
      {
        name: 'amount',
        type: 'input/number',
        advanced: { length: { min: 5 } },
      },
      '4'
    )

    expect(parsed.success).toBe(false)
  })

  test('should leave an optional year nobody picked out, not send 0', () => {
    const parsed = parse({ name: 'year', type: 'select/year' }, '')

    expect(parsed.success).toBe(true)
    expect(parsed.data?.year).toBeUndefined()
  })

  test('should not hold an optional month nobody picked', () => {
    const parsed = parse({ name: 'month', type: 'select/month' }, '')

    expect(parsed.success).toBe(true)
    expect(parsed.data?.month).toBeUndefined()
  })

  test('should hold a required year nobody picked with its required message', () => {
    const parsed = parse(
      {
        name: 'year',
        type: 'select/year',
        required: true,
        validation: { required: 'Year is required' },
      },
      ''
    )

    expect(parsed.success).toBe(false)
    expect(parsed.error?.issues[0].message).toBe('Year is required')
  })

  test('should hold a required month nobody picked with its required message', () => {
    const parsed = parse(
      {
        name: 'month',
        type: 'select/month',
        required: true,
        validation: { required: 'Month is required' },
      },
      ''
    )

    expect(parsed.success).toBe(false)
    expect(parsed.error?.issues[0].message).toBe('Month is required')
  })
})
