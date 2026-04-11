import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('gt', () => {
  test('should return true when current is greater than value', () => {
    expect(operators.gt(10, 5)).toBe(true)
    expect(operators.gt(0.2, 0.1)).toBe(true)
  })

  test('should return false when current is equal to value', () => {
    expect(operators.gt(5, 5)).toBe(false)
  })

  test('should return false when current is less than value', () => {
    expect(operators.gt(3, 5)).toBe(false)
  })

  test('should coerce string values to numbers', () => {
    expect(operators.gt('10', '5')).toBe(true)
    expect(operators.gt('3', '5')).toBe(false)
  })
})
