import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('in', () => {
  test('should return true when current is included in the array', () => {
    expect(operators.in('a', ['a', 'b', 'c'])).toBe(true)
    expect(operators.in('1', ['1', '2'])).toBe(true)
  })

  test('should return false when current is not in the array', () => {
    expect(operators.in('d', ['a', 'b', 'c'])).toBe(false)
  })

  test('should coerce current to string before checking', () => {
    expect(operators.in(1, ['1', '2'])).toBe(true)
    expect(operators.in(true, ['true'])).toBe(true)
  })

  test('should return false when value is not an array', () => {
    expect(operators.in('a', 'a')).toBe(false)
    expect(operators.in('a', null)).toBe(false)
    expect(operators.in('a', undefined)).toBe(false)
  })
})
