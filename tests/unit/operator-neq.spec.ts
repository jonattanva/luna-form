import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('neq', () => {
  test('should return true for different values', () => {
    expect(operators.neq('a', 'b')).toBe(true)
    expect(operators.neq(1, 2)).toBe(true)
  })

  test('should return false for equal values', () => {
    expect(operators.neq('a', 'a')).toBe(false)
    expect(operators.neq(1, 1)).toBe(false)
  })

  test('should use strict inequality', () => {
    expect(operators.neq(1, '1')).toBe(true)
    expect(operators.neq(0, false)).toBe(true)
    expect(operators.neq(null, undefined)).toBe(true)
  })
})
