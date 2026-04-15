import { describe, expect, test } from 'vitest'
import { toNativeDate } from '@/packages/luna-core/src/util/date'

describe('toNativeDate', () => {
  test('should return empty string for empty input', () => {
    expect(toNativeDate('', 'yyyy-MM-dd')).toBe('')
  })

  test('should convert yyyy-MM-dd to yyyy-MM-dd', () => {
    expect(toNativeDate('2024-01-15', 'yyyy-MM-dd')).toBe('2024-01-15')
  })

  test('should convert MM/dd/yyyy to yyyy-MM-dd', () => {
    expect(toNativeDate('01/15/2024', 'MM/dd/yyyy')).toBe('2024-01-15')
  })

  test('should convert dd/MM/yyyy to yyyy-MM-dd', () => {
    expect(toNativeDate('15/01/2024', 'dd/MM/yyyy')).toBe('2024-01-15')
  })

  test('should handle end-of-year date', () => {
    expect(toNativeDate('12/31/2023', 'MM/dd/yyyy')).toBe('2023-12-31')
  })

  test('should return empty string for invalid value', () => {
    expect(toNativeDate('not-a-date', 'yyyy-MM-dd')).toBe('')
  })

  test('should return empty string when value does not match format', () => {
    expect(toNativeDate('01/15/2024', 'dd/MM/yyyy')).toBe('')
  })

  test('should convert MMMM d, yyyy to yyyy-MM-dd', () => {
    expect(toNativeDate('January 15, 2024', 'MMMM d, yyyy')).toBe('2024-01-15')
  })

  test('should convert end-of-year MMMM d, yyyy to yyyy-MM-dd', () => {
    expect(toNativeDate('December 31, 2023', 'MMMM d, yyyy')).toBe('2023-12-31')
  })

  test('should return empty string when value does not match MMMM d, yyyy', () => {
    expect(toNativeDate('2024-01-15', 'MMMM d, yyyy')).toBe('')
  })
})
