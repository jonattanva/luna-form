import { operators } from '@/packages/luna-core/src/util/operator'
import { expect, test } from '@playwright/test'

test.describe('Operator Utility', { tag: ['@unit'] }, () => {
  test.describe('eq', () => {
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

  test.describe('neq', () => {
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

  test.describe('in', () => {
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

  test.describe('nin', () => {
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

  test.describe('gt', () => {
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

  test.describe('gte', () => {
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

  test.describe('lt', () => {
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

  test.describe('lte', () => {
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

  test.describe('operators map', () => {
    test('should expose all expected operators', () => {
      expect(Object.keys(operators).sort()).toEqual([
        'eq',
        'gt',
        'gte',
        'in',
        'lt',
        'lte',
        'neq',
        'nin',
      ])
    })

    test('all operators should be functions', () => {
      for (const key of Object.keys(operators)) {
        expect(typeof operators[key]).toBe('function')
      }
    })
  })
})
