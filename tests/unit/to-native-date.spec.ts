import { describe, expect, test } from 'vitest'
import { toNativeDate } from '@/packages/luna-core/src/util/date'
import type { DateFormat } from '@/packages/luna-core/src/type'

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
    expect(toNativeDate('15/01/2024', 'MMMM d, yyyy')).toBe('')
  })

  // What the form hands out is `yyyy-MM-dd`, so it has to read it back
  // whatever the field shows: a host that keeps a submitted date and passes it
  // in again used to get an empty field.
  test('should read yyyy-MM-dd whatever format the field shows', () => {
    expect(toNativeDate('2024-01-15', 'MMMM d, yyyy')).toBe('2024-01-15')
    expect(toNativeDate('2024-01-15', 'MM/dd/yyyy')).toBe('2024-01-15')
    expect(toNativeDate('2024-01-15', 'dd/MM/yyyy')).toBe('2024-01-15')
  })

  test('should read a value with blank space around it', () => {
    expect(toNativeDate('  15/01/2024 ', 'dd/MM/yyyy')).toBe('2024-01-15')
  })

  test('should read the 29th of February only in a leap year', () => {
    expect(toNativeDate('2024-02-29', 'dd/MM/yyyy')).toBe('2024-02-29')
    expect(toNativeDate('2025-02-29', 'dd/MM/yyyy')).toBe('')
  })

  test('should return empty string for a day that does not exist', () => {
    expect(toNativeDate('2026-02-30', 'MMMM d, yyyy')).toBe('')
    expect(toNativeDate('30/02/2026', 'dd/MM/yyyy')).toBe('')
  })

  test('should return empty string for half a date or a date with a time', () => {
    expect(toNativeDate('January 15', 'MMMM d, yyyy')).toBe('')
    expect(toNativeDate('2026-10-02T10:00', 'MMMM d, yyyy')).toBe('')
  })

  // Regression: `yyyy` reads one to four digits, so every keystroke of a year
  // being typed was a day of its own, `15/06/2` the 15th of June of the year 2.
  test('should return empty string for a year that is not four digits', () => {
    expect(toNativeDate('15/06/2', 'dd/MM/yyyy')).toBe('')
    expect(toNativeDate('15/06/24', 'dd/MM/yyyy')).toBe('')
    expect(toNativeDate('June 15, 2', 'MMMM d, yyyy')).toBe('')
    expect(toNativeDate('0024-06-15', 'MMMM d, yyyy')).toBe('')
  })
})

// A form in Spanish shows its days with Spanish month names, and a person may
// edit that text: it reads back in either language the library writes.
describe('toNativeDate in the languages the form writes', () => {
  test.each([
    ['octubre 2, 2026', 'MMMM d, yyyy', '2026-10-02'],
    ['ene 5, 2026', 'MMM d, yyyy', '2026-01-05'],
    ['October 2, 2026', 'MMMM d, yyyy', '2026-10-02'],
  ])('should read %s', (text, format, expected) => {
    expect(toNativeDate(text, format as DateFormat)).toBe(expected)
  })
})
