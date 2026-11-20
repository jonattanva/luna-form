import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('truthy', () => {
  test('should return true when the value is truthy', () => {
    expect(operators.truthy(true, undefined)).toBe(true)
    expect(operators.truthy('a', undefined)).toBe(true)
    expect(operators.truthy(1, undefined)).toBe(true)
    expect(operators.truthy({}, undefined)).toBe(true)
  })

  test('should return false when the value is falsy', () => {
    expect(operators.truthy(false, undefined)).toBe(false)
    expect(operators.truthy('', undefined)).toBe(false)
    expect(operators.truthy(0, undefined)).toBe(false)
    expect(operators.truthy(null, undefined)).toBe(false)
    expect(operators.truthy(undefined, undefined)).toBe(false)
  })

  test('should read an array by its length', () => {
    expect(operators.truthy(['a'], undefined)).toBe(true)
    expect(operators.truthy(['2026-01-01', '2026-01-05'], undefined)).toBe(true)
    expect(operators.truthy([false], undefined)).toBe(true)
    expect(operators.truthy([], undefined)).toBe(false)
  })

  test('should ignore the value', () => {
    expect(operators.truthy(true, false)).toBe(true)
    expect(operators.truthy(false, true)).toBe(false)
  })
})
