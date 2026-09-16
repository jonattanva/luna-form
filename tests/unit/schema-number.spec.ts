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

  // A number is whole unless its definition declares a `step`. The same `step`
  // is rendered on the input, so its arrows and the validation agree: it counts
  // from `min` when there is one, as the browser does. A step is a number above
  // 0, and anything else is no step at all -- the browser ignores 0 and below,
  // and the input never renders what the schema would not read.
  describe('step', () => {
    const amount = (advanced?: Record<string, unknown>) =>
      ({
        name: 'amount',
        type: 'input/number',
        ...(advanced ? { advanced } : {}),
      }) as Input

    test('should still hold a decimal when the number declares no step', () => {
      expect(parse(amount(), '19.99').success).toBe(false)
    })

    test('should accept a decimal on its step', () => {
      const parsed = parse(amount({ step: 0.01 }), '19.99')

      expect(parsed.success).toBe(true)
      expect(parsed.data?.amount).toBe(19.99)
    })

    test('should hold a decimal off its step', () => {
      expect(parse(amount({ step: 0.01 }), '19.999').success).toBe(false)
    })

    test.each([0, -0.5])(
      'should read a step of %j as no step, as the browser does',
      (step) => {
        const input = amount({ step })

        expect(parse(input, '5').success).toBe(true)
        expect(parse(input, '5.5').success).toBe(false)
      }
    )

    test.each(['any', '0.01'])(
      'should read a step of %j, which is not a number, as no step',
      (step) => {
        const input = amount({ step })

        expect(parse(input, '5').success).toBe(true)
        expect(parse(input, '5.5').success).toBe(false)
      }
    )

    test('should count the step from the minimum, as the browser does', () => {
      const input = amount({ step: 0.5, length: { min: 0.25 } })

      expect(parse(input, '1.25').success).toBe(true)
      expect(parse(input, '1.5').success).toBe(false)
    })

    test('should hold a whole number off a whole step', () => {
      const input = amount({ step: 5 })

      expect(parse(input, '15').success).toBe(true)
      expect(parse(input, '12').success).toBe(false)
    })
  })
})
