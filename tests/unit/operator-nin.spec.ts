import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('nin', () => {
  test('should return true when current is not in the array', () => {
    expect(operators.nin('d', ['a', 'b', 'c'])).toBe(true)
  })

  test('should return false when current is in the array', () => {
    expect(operators.nin('a', ['a', 'b', 'c'])).toBe(false)
  })

  test('should coerce current to string before checking', () => {
    expect(operators.nin(1, ['1', '2'])).toBe(false)
    expect(operators.nin(1, ['a', 'b'])).toBe(true)
  })

  test('should return false when value is not an array', () => {
    expect(operators.nin('a', 'a')).toBe(false)
    expect(operators.nin('a', null)).toBe(false)
    expect(operators.nin('a', undefined)).toBe(false)
  })
})
