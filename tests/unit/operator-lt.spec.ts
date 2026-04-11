import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('lt', () => {
  test('should return true when current is less than value', () => {
    expect(operators.lt(3, 5)).toBe(true)
    expect(operators.lt(-1, 0)).toBe(true)
  })

  test('should return false when current is equal to value', () => {
    expect(operators.lt(5, 5)).toBe(false)
  })

  test('should return false when current is greater than value', () => {
    expect(operators.lt(10, 5)).toBe(false)
  })

  test('should coerce string values to numbers', () => {
    expect(operators.lt('3', '5')).toBe(true)
    expect(operators.lt('10', '5')).toBe(false)
  })
})
