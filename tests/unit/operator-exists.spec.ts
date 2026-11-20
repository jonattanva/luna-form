import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('exists', () => {
  test('should return true when the value is present', () => {
    expect(operators.exists('a', undefined)).toBe(true)
    expect(operators.exists({ a: 'b' }, undefined)).toBe(true)
  })

  test('should treat falsy scalars other than blank as present', () => {
    expect(operators.exists(0, undefined)).toBe(true)
    expect(operators.exists(false, undefined)).toBe(true)
  })

  test('should return false when the value is absent or blank', () => {
    expect(operators.exists(undefined, undefined)).toBe(false)
    expect(operators.exists(null, undefined)).toBe(false)
    expect(operators.exists('', undefined)).toBe(false)
  })

  test('should read an array by its length', () => {
    expect(operators.exists(['a'], undefined)).toBe(true)
    expect(operators.exists(['2026-01-01', '2026-01-05'], undefined)).toBe(true)
    expect(operators.exists([''], undefined)).toBe(true)
    expect(operators.exists([], undefined)).toBe(false)
  })

  test('should ignore the value', () => {
    expect(operators.exists('a', 'b')).toBe(true)
    expect(operators.exists('', 'a')).toBe(false)
    expect(operators.exists(undefined, true)).toBe(false)
  })
})
