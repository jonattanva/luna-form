import { describe, expect, test } from 'vitest'
import { interpolateValue } from '@/packages/luna-core/src/util/string'

describe('interpolateValue', () => {
  test('should return the object behind a whole placeholder', () => {
    const values = { value: { key: 'email', tags: ['a', 'b'] } }
    const result = interpolateValue('{value}', values)

    expect(result).toEqual({ key: 'email', tags: ['a', 'b'] })
    // The value itself, not a copy of it: nothing along the way is entitled to
    // rebuild what the caller handed over.
    expect(result).toBe(values.value)
  })

  test('should return the array behind a whole placeholder', () => {
    expect(
      interpolateValue('{rows}', { rows: [{ key: 'a' }, { key: 'b' }] })
    ).toEqual([{ key: 'a' }, { key: 'b' }])
  })

  test('should resolve a whole placeholder through a nested key', () => {
    expect(
      interpolateValue('{user.address}', { user: { address: { city: 'A' } } })
    ).toEqual({ city: 'A' })
  })

  test('should ignore surrounding whitespace in a whole placeholder', () => {
    expect(interpolateValue('{ value }', { value: { a: 1 } })).toEqual({ a: 1 })
  })

  test('should keep the deep shape of the structure it returns', () => {
    const rows = [
      { key: 'email', data_type: ['text'], value: '{{steps.a.data.email}}' },
      { key: 'items', list_mode: ['map'], list_value: '{{steps.a.data.rows}}' },
    ]

    expect(interpolateValue('{value}', { value: rows })).toEqual(rows)
  })

  test('should stay text when the placeholder is not the whole template', () => {
    expect(interpolateValue('rows: {value}', { value: { a: 1 } })).toBe(
      'rows: {value}'
    )
  })

  test('should stay text when a whole placeholder carries a filter', () => {
    // A filter formats into text, so the structure can never come back out --
    // it goes through `String`, exactly as `interpolate` would.
    expect(
      interpolateValue('{value | currency:USD}', { value: { a: 1 } })
    ).toBe('[object Object]')
  })

  test('should stringify scalars behind a whole placeholder', () => {
    expect(interpolateValue('{value}', { value: 25 })).toBe('25')
    expect(interpolateValue('{value}', { value: true })).toBe('true')
  })

  test('should keep the placeholder when it resolves to nothing', () => {
    expect(interpolateValue('{value}', {})).toBe('{value}')
    expect(interpolateValue('{value}', { value: null })).toBe('{value}')
  })

  test('should leave a placeholder nested inside a template as text', () => {
    // Only the template as a whole is considered. A `value` event interpolates
    // one target at a time, so a nested structure has no caller -- and reading
    // it as data would make an object of text templates ambiguous.
    const template = { simple_body: '{rows}', label: 'n: {name}' }
    const values = { rows: [{ key: 'a' }], name: 'John' }

    expect(interpolateValue(template, values)).toEqual({
      simple_body: '{rows}',
      label: 'n: John',
    })
  })
})
