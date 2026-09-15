import { buildSchema, getSchema } from '@/packages/luna-core/src/util/schema'
import { describe, expect, test } from 'vitest'
import type { Input } from '@/packages/luna-core/src/type'

// What the submit schema does with a value the browser did not send. A
// disabled control and a radio nobody picked leave their key out of the
// FormData altogether. For an optional field that is not an error, and it must
// not come back as the text "undefined" either. What the browser did send, even
// empty, is left exactly as it was.
describe('values the browser does not send', () => {
  const schemaOf = (input: Input) =>
    buildSchema({ [input.name]: getSchema(input) })

  const OPTIONAL: Input[] = [
    { name: 'text', type: 'input/text' },
    { name: 'email', type: 'input/email' },
    { name: 'number', type: 'input/number' },
    { name: 'radio', type: 'radio' },
    { name: 'year', type: 'select/year' },
    { name: 'month', type: 'select/month' },
  ]

  for (const input of OPTIONAL) {
    test(`should accept an optional ${input.type} whose key is missing`, () => {
      const parsed = schemaOf(input).safeParse({})

      expect(parsed.success).toBe(true)
      expect(parsed.data).toEqual({})
    })

    test(`should leave an optional ${input.type} sent as undefined out`, () => {
      const parsed = schemaOf(input).safeParse({ [input.name]: undefined })

      expect(parsed.success).toBe(true)
      expect(parsed.data?.[input.name]).toBeUndefined()
    })
  }

  test('should keep a text the browser sent empty', () => {
    const parsed = schemaOf({ name: 'text', type: 'input/text' }).safeParse({
      text: '',
    })

    expect(parsed.data).toEqual({ text: '' })
  })

  test('should still read a missing checkbox as unchecked', () => {
    const parsed = schemaOf({ name: 'agree', type: 'checkbox' }).safeParse({})

    expect(parsed.data).toEqual({ agree: false })
  })

  test('should still read missing chips as nothing selected', () => {
    const parsed = schemaOf({ name: 'colors', type: 'chips' }).safeParse({})

    expect(parsed.data).toEqual({ colors: [] })
  })

  test('should still hold a required field whose key is missing', () => {
    const parsed = schemaOf({
      name: 'text',
      type: 'input/text',
      required: true,
    }).safeParse({})

    expect(parsed.success).toBe(false)
  })
})
