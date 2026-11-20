import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('contains', () => {
  test('should return true when the current string contains the value', () => {
    expect(operators.contains('hello world', 'world')).toBe(true)
    expect(operators.contains('hello', 'hello')).toBe(true)
  })

  test('should return false when the current string does not contain the value', () => {
    expect(operators.contains('hello world', 'planet')).toBe(false)
    expect(operators.contains('Hello', 'hello')).toBe(false)
  })

  test('should coerce the value to string when current is a string', () => {
    expect(operators.contains('order-123', 123)).toBe(true)
    expect(operators.contains('order-123', 456)).toBe(false)
  })

  test('should return true when the current array contains the value', () => {
    expect(operators.contains(['a', 'b', 'c'], 'b')).toBe(true)
  })

  test('should return false when the current array does not contain the value', () => {
    expect(operators.contains(['a', 'b', 'c'], 'd')).toBe(false)
    expect(operators.contains([], 'a')).toBe(false)
  })

  test('should compare array items and value as strings', () => {
    expect(operators.contains([1, 2, 3], '2')).toBe(true)
    expect(operators.contains(['1', '2'], 2)).toBe(true)
    expect(operators.contains([1, 2, 3], 4)).toBe(false)
  })

  test('should match whole array items, not substrings of them', () => {
    expect(operators.contains(['apple', 'banana'], 'app')).toBe(false)
  })

  test('should return false when current is neither a string nor an array', () => {
    expect(operators.contains(123, '1')).toBe(false)
    expect(operators.contains(null, 'null')).toBe(false)
    expect(operators.contains(undefined, 'undefined')).toBe(false)
    expect(operators.contains({ a: 'b' }, 'a')).toBe(false)
    expect(operators.contains(true, 'true')).toBe(false)
  })
})
