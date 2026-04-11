import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('gte', () => {
  test('should return true when current is greater than value', () => {
    expect(operators.gte(10, 5)).toBe(true)
  })

  test('should return true when current is equal to value', () => {
    expect(operators.gte(5, 5)).toBe(true)
  })

  test('should return false when current is less than value', () => {
    expect(operators.gte(3, 5)).toBe(false)
  })

  test('should coerce string values to numbers', () => {
    expect(operators.gte('5', '5')).toBe(true)
    expect(operators.gte('3', '5')).toBe(false)
  })
})
