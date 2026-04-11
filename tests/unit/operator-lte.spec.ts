import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('lte', () => {
  test('should return true when current is less than value', () => {
    expect(operators.lte(3, 5)).toBe(true)
  })

  test('should return true when current is equal to value', () => {
    expect(operators.lte(5, 5)).toBe(true)
  })

  test('should return false when current is greater than value', () => {
    expect(operators.lte(10, 5)).toBe(false)
  })

  test('should coerce string values to numbers', () => {
    expect(operators.lte('5', '5')).toBe(true)
    expect(operators.lte('10', '5')).toBe(false)
  })
})
