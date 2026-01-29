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

  test.describe('date comparisons', () => {
    test.describe('gt with ISO dates', () => {
      test('should return true when current date is after value date', () => {
        expect(operators.gt('2024-06-15', '2024-01-15')).toBe(true)
        expect(operators.gt('2024-01-16', '2024-01-15')).toBe(true)
      })

      test('should return false when current date is before or equal to value date', () => {
        expect(operators.gt('2024-01-15', '2024-06-15')).toBe(false)
        expect(operators.gt('2024-01-15', '2024-01-15')).toBe(false)
      })

      test('should handle ISO datetime strings', () => {
        expect(operators.gt('2024-01-15T12:00:00', '2024-01-15T10:00:00')).toBe(
          true
        )
        expect(operators.gt('2024-01-15T10:00:00', '2024-01-15T12:00:00')).toBe(
          false
        )
      })
    })

    test.describe('gte with ISO dates', () => {
      test('should return true when current date is after or equal to value date', () => {
        expect(operators.gte('2024-06-15', '2024-01-15')).toBe(true)
        expect(operators.gte('2024-01-15', '2024-01-15')).toBe(true)
      })

      test('should return false when current date is before value date', () => {
        expect(operators.gte('2024-01-15', '2024-06-15')).toBe(false)
      })

      test('should handle ISO datetime strings', () => {
        expect(
          operators.gte('2024-01-15T12:00:00', '2024-01-15T12:00:00')
        ).toBe(true)
        expect(
          operators.gte('2024-01-15T10:00:00', '2024-01-15T12:00:00')
        ).toBe(false)
      })
    })

    test.describe('lt with ISO dates', () => {
      test('should return true when current date is before value date', () => {
        expect(operators.lt('2024-01-15', '2024-06-15')).toBe(true)
        expect(operators.lt('2024-01-15', '2024-01-16')).toBe(true)
      })

      test('should return false when current date is after or equal to value date', () => {
        expect(operators.lt('2024-06-15', '2024-01-15')).toBe(false)
        expect(operators.lt('2024-01-15', '2024-01-15')).toBe(false)
      })

      test('should handle ISO datetime strings', () => {
        expect(operators.lt('2024-01-15T10:00:00', '2024-01-15T12:00:00')).toBe(
          true
        )
        expect(operators.lt('2024-01-15T12:00:00', '2024-01-15T10:00:00')).toBe(
          false
        )
      })
    })

    test.describe('lte with ISO dates', () => {
      test('should return true when current date is before or equal to value date', () => {
        expect(operators.lte('2024-01-15', '2024-06-15')).toBe(true)
        expect(operators.lte('2024-01-15', '2024-01-15')).toBe(true)
      })

      test('should return false when current date is after value date', () => {
        expect(operators.lte('2024-06-15', '2024-01-15')).toBe(false)
      })

      test('should handle ISO datetime strings', () => {
        expect(
          operators.lte('2024-01-15T12:00:00', '2024-01-15T12:00:00')
        ).toBe(true)
        expect(
          operators.lte('2024-01-15T14:00:00', '2024-01-15T12:00:00')
        ).toBe(false)
      })
    })

    test.describe('backward compatibility', () => {
      test('should still work with numeric timestamps', () => {
        const earlier = new Date('2024-01-15').getTime()
        const later = new Date('2024-06-15').getTime()
        expect(operators.gt(later, earlier)).toBe(true)
        expect(operators.lt(earlier, later)).toBe(true)
        expect(operators.gte(earlier, earlier)).toBe(true)
        expect(operators.lte(later, later)).toBe(true)
      })

      test('should still work with regular numbers', () => {
        expect(operators.gt(10, 5)).toBe(true)
        expect(operators.lt(5, 10)).toBe(true)
      })
    })

    test.describe('edge cases', () => {
      test('should handle invalid date strings gracefully', () => {
        expect(operators.gt('invalid-date', '2024-01-15')).toBe(false)
        expect(operators.lt('2024-01-15', 'not-a-date')).toBe(false)
      })

      test('should handle mixed formats (date vs number)', () => {
        const timestamp = new Date('2024-06-15').getTime()
        expect(operators.gt('2024-12-15', timestamp)).toBe(true)
      })
    })

    test.describe('DD/MM/YYYY and DD-MM-YYYY formats', () => {
      test('should compare dates in DD/MM/YYYY format', () => {
        expect(operators.gt('15/06/2024', '15/01/2024')).toBe(true)
        expect(operators.gt('16/01/2024', '15/01/2024')).toBe(true)
        expect(operators.lt('15/01/2024', '15/06/2024')).toBe(true)
      })

      test('should compare dates in DD-MM-YYYY format', () => {
        expect(operators.gt('15-06-2024', '15-01-2024')).toBe(true)
        expect(operators.gt('16-01-2024', '15-01-2024')).toBe(true)
        expect(operators.lt('15-01-2024', '15-06-2024')).toBe(true)
      })

      test('should handle gte and lte with DD/MM/YYYY format', () => {
        expect(operators.gte('15/01/2024', '15/01/2024')).toBe(true)
        expect(operators.gte('16/01/2024', '15/01/2024')).toBe(true)
        expect(operators.lte('15/01/2024', '15/01/2024')).toBe(true)
        expect(operators.lte('14/01/2024', '15/01/2024')).toBe(true)
      })

      test('should correctly parse day and month (not confuse with MM/DD)', () => {
        // 25/12/2024 = December 25, 2024 (day=25 cannot be month)
        // 15/01/2024 = January 15, 2024
        expect(operators.gt('25/12/2024', '15/01/2024')).toBe(true)
      })

      test('should compare DD/MM/YYYY with ISO format', () => {
        expect(operators.gt('15/06/2024', '2024-01-15')).toBe(true)
        expect(operators.lt('15/01/2024', '2024-06-15')).toBe(true)
        expect(operators.gte('15/01/2024', '2024-01-15')).toBe(true)
      })

      test('should compare DD-MM-YYYY with DD/MM/YYYY format', () => {
        expect(operators.gte('15-01-2024', '15/01/2024')).toBe(true)
        expect(operators.gt('15-06-2024', '15/01/2024')).toBe(true)
      })

      test('should handle invalid format gracefully', () => {
        expect(operators.gt('1/1/2024', '15/01/2024')).toBe(false) // single digits
      })
    })

    test.describe('DD/MM/YYYY HH:mm and DD-MM-YYYY HH:mm formats', () => {
      test('should compare dates with time in DD/MM/YYYY HH:mm format', () => {
        expect(operators.gt('15/01/2024 14:00', '15/01/2024 10:00')).toBe(true)
        expect(operators.lt('15/01/2024 10:00', '15/01/2024 14:00')).toBe(true)
        expect(operators.gte('15/01/2024 14:00', '15/01/2024 14:00')).toBe(true)
      })

      test('should compare dates with time in DD-MM-YYYY HH:mm format', () => {
        expect(operators.gt('15-01-2024 14:00', '15-01-2024 10:00')).toBe(true)
        expect(operators.lt('15-01-2024 10:00', '15-01-2024 14:00')).toBe(true)
        expect(operators.gte('15-01-2024 14:00', '15-01-2024 14:00')).toBe(true)
      })

      test('should compare datetime with date-only format', () => {
        // 15/01/2024 14:00 vs 15/01/2024 (treated as 00:00)
        expect(operators.gt('15/01/2024 14:00', '15/01/2024')).toBe(true)
        expect(operators.lt('15/01/2024', '15/01/2024 14:00')).toBe(true)
      })

      test('should compare DD/MM/YYYY HH:mm with ISO format', () => {
        expect(operators.gt('15/06/2024 10:00', '2024-01-15')).toBe(true)
        expect(operators.gt('15/01/2024 14:00', '2024-01-15T10:00:00')).toBe(
          true
        )
      })

      test('should handle mixed separators with time', () => {
        expect(operators.gte('15-01-2024 14:00', '15/01/2024 14:00')).toBe(true)
        expect(operators.gt('15/06/2024 10:00', '15-01-2024 10:00')).toBe(true)
      })

      test('should compare dates with seconds in DD/MM/YYYY HH:mm:ss format', () => {
        expect(operators.gt('15/01/2024 14:00:30', '15/01/2024 14:00:00')).toBe(
          true
        )
        expect(operators.lt('15/01/2024 14:00:00', '15/01/2024 14:00:30')).toBe(
          true
        )
        expect(
          operators.gte('15/01/2024 14:00:30', '15/01/2024 14:00:30')
        ).toBe(true)
      })

      test('should compare dates with seconds in DD-MM-YYYY HH:mm:ss format', () => {
        expect(operators.gt('15-01-2024 14:00:30', '15-01-2024 14:00:00')).toBe(
          true
        )
        expect(operators.lt('15-01-2024 14:00:00', '15-01-2024 14:00:30')).toBe(
          true
        )
      })

      test('should compare HH:mm:ss with HH:mm format', () => {
        // HH:mm is treated as HH:mm:00
        expect(operators.gt('15/01/2024 14:00:30', '15/01/2024 14:00')).toBe(
          true
        )
        expect(operators.gte('15/01/2024 14:00:00', '15/01/2024 14:00')).toBe(
          true
        )
      })

      test('should compare HH:mm:ss with ISO datetime', () => {
        expect(operators.gt('15/01/2024 14:00:30', '2024-01-15T14:00:00')).toBe(
          true
        )
        expect(
          operators.gte('15/01/2024 14:00:00', '2024-01-15T14:00:00')
        ).toBe(true)
      })
    })
  })
})
