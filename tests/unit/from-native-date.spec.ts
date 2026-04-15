import { describe, expect, test } from 'vitest'
import { fromNativeDate } from '@/packages/luna-core/src/util/date'

describe('fromNativeDate', () => {
  test('should return empty string for empty input', () => {
    expect(fromNativeDate('')).toBe('')
  })

  test('should default to MMMM d, yyyy format', () => {
    expect(fromNativeDate('2024-01-15')).toBe('January 15, 2024')
  })

  test('should convert yyyy-MM-dd to MMMM d, yyyy', () => {
    expect(fromNativeDate('2024-01-15', 'MMMM d, yyyy')).toBe(
      'January 15, 2024'
    )
  })

  test('should convert yyyy-MM-dd to MM/dd/yyyy', () => {
    expect(fromNativeDate('2024-01-15', 'MM/dd/yyyy')).toBe('01/15/2024')
  })

  test('should convert yyyy-MM-dd to dd/MM/yyyy', () => {
    expect(fromNativeDate('2024-01-15', 'dd/MM/yyyy')).toBe('15/01/2024')
  })

  test('should handle end-of-year date with MMMM d, yyyy', () => {
    expect(fromNativeDate('2023-12-31', 'MMMM d, yyyy')).toBe(
      'December 31, 2023'
    )
  })

  test('should handle end-of-year date with MM/dd/yyyy', () => {
    expect(fromNativeDate('2023-12-31', 'MM/dd/yyyy')).toBe('12/31/2023')
  })

  test('should return empty string for invalid native value', () => {
    expect(fromNativeDate('not-a-date')).toBe('')
  })

  test('should return empty string for malformed native value', () => {
    expect(fromNativeDate('15/01/2024')).toBe('')
  })
})
