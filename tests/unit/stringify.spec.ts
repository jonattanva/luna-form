import { expect, test } from '@playwright/test'
import { stringify } from '@/packages/luna-core/src/util/stringify'

test.describe('Stringify Utility', { tag: ['@unit'] }, () => {
  test('should return the same string when input is a string', () => {
    expect(stringify('hello')).toBe('hello')
    expect(stringify('')).toBe('')
    expect(stringify('{"key": "value"}')).toBe('{"key": "value"}')
  })

  test('should stringify objects to JSON', () => {
    expect(stringify({ key: 'value' })).toBe('{"key":"value"}')
    expect(stringify({ a: 1, b: 2 })).toBe('{"a":1,"b":2}')
    expect(stringify({})).toBe('{}')
  })

  test('should stringify arrays to JSON', () => {
    expect(stringify([1, 2, 3])).toBe('[1,2,3]')
    expect(stringify(['a', 'b'])).toBe('["a","b"]')
    expect(stringify([])).toBe('[]')
  })

  test('should stringify primitive values', () => {
    expect(stringify(123)).toBe('123')
    expect(stringify(true)).toBe('true')
    expect(stringify(false)).toBe('false')
    expect(stringify(null)).toBe('null')
  })

  test('should return null for FormData', () => {
    const formData = new FormData()
    formData.append('key', 'value')
    expect(stringify(formData)).toBe(null)
  })

  test('should return null for circular references', () => {
    const circular: Record<string, unknown> = { key: 'value' }
    circular.self = circular
    expect(stringify(circular)).toBe(null)
  })

  test('should handle nested objects', () => {
    const nested = { a: { b: { c: 'deep' } } }
    expect(stringify(nested)).toBe('{"a":{"b":{"c":"deep"}}}')
  })

  test('should handle objects with arrays', () => {
    const obj = { items: [1, 2, 3], name: 'test' }
    expect(stringify(obj)).toBe('{"items":[1,2,3],"name":"test"}')
  })
})
