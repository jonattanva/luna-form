import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('date comparisons', () => {
  describe('gt with ISO dates', () => {
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

  describe('gte with ISO dates', () => {
    test('should return true when current date is after or equal to value date', () => {
      expect(operators.gte('2024-06-15', '2024-01-15')).toBe(true)
      expect(operators.gte('2024-01-15', '2024-01-15')).toBe(true)
    })

    test('should return false when current date is before value date', () => {
      expect(operators.gte('2024-01-15', '2024-06-15')).toBe(false)
    })

    test('should handle ISO datetime strings', () => {
      expect(operators.gte('2024-01-15T12:00:00', '2024-01-15T12:00:00')).toBe(
        true
      )
      expect(operators.gte('2024-01-15T10:00:00', '2024-01-15T12:00:00')).toBe(
        false
      )
    })
  })

  describe('lt with ISO dates', () => {
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

  describe('lte with ISO dates', () => {
    test('should return true when current date is before or equal to value date', () => {
      expect(operators.lte('2024-01-15', '2024-06-15')).toBe(true)
      expect(operators.lte('2024-01-15', '2024-01-15')).toBe(true)
    })

    test('should return false when current date is after value date', () => {
      expect(operators.lte('2024-06-15', '2024-01-15')).toBe(false)
    })

    test('should handle ISO datetime strings', () => {
      expect(operators.lte('2024-01-15T12:00:00', '2024-01-15T12:00:00')).toBe(
        true
      )
      expect(operators.lte('2024-01-15T14:00:00', '2024-01-15T12:00:00')).toBe(
        false
      )
    })
  })

  describe('backward compatibility', () => {
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

  describe('edge cases', () => {
    test('should handle invalid date strings gracefully', () => {
      expect(operators.gt('invalid-date', '2024-01-15')).toBe(false)
      expect(operators.lt('2024-01-15', 'not-a-date')).toBe(false)
    })

    test('should handle mixed formats (date vs number)', () => {
      const timestamp = new Date('2024-06-15').getTime()
      expect(operators.gt('2024-12-15', timestamp)).toBe(true)
    })
  })

  describe('DD/MM/YYYY and DD-MM-YYYY formats', () => {
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

  describe('DD/MM/YYYY HH:mm and DD-MM-YYYY HH:mm formats', () => {
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
      expect(operators.gt('15/01/2024 14:00', '2024-01-15T10:00:00')).toBe(true)
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
      expect(operators.gte('15/01/2024 14:00:30', '15/01/2024 14:00:30')).toBe(
        true
      )
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
      expect(operators.gt('15/01/2024 14:00:30', '15/01/2024 14:00')).toBe(true)
      expect(operators.gte('15/01/2024 14:00:00', '15/01/2024 14:00')).toBe(
        true
      )
    })

    test('should compare HH:mm:ss with ISO datetime', () => {
      expect(operators.gt('15/01/2024 14:00:30', '2024-01-15T14:00:00')).toBe(
        true
      )
      expect(operators.gte('15/01/2024 14:00:00', '2024-01-15T14:00:00')).toBe(
        true
      )
    })
  })
})
