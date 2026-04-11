import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('eq', () => {
  test('should return true for equal primitive values', () => {
    expect(operators.eq('a', 'a')).toBe(true)
    expect(operators.eq(1, 1)).toBe(true)
    expect(operators.eq(true, true)).toBe(true)
  })

  test('should return false for different values', () => {
    expect(operators.eq('a', 'b')).toBe(false)
    expect(operators.eq(1, 2)).toBe(false)
  })

  test('should use strict equality', () => {
    expect(operators.eq(1, '1')).toBe(false)
    expect(operators.eq(0, false)).toBe(false)
    expect(operators.eq(null, undefined)).toBe(false)
  })
})
