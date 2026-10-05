import { describe, expect, test } from 'vitest'
import { displayDate } from '@/packages/luna-core/src/util/date'

// How a date field shows what it holds. The form holds `yyyy-MM-dd`, and this
// is the one way back to the field's format, for its preview and its component.
describe('displayDate', () => {
  test('should return empty string for empty input', () => {
    expect(displayDate('', 'MMMM d, yyyy')).toBe('')
  })

  test('should convert yyyy-MM-dd to MMMM d, yyyy', () => {
    expect(displayDate('2024-01-15', 'MMMM d, yyyy')).toBe('January 15, 2024')
  })

  test('should convert yyyy-MM-dd to MM/dd/yyyy', () => {
    expect(displayDate('2024-01-15', 'MM/dd/yyyy')).toBe('01/15/2024')
  })

  test('should convert yyyy-MM-dd to dd/MM/yyyy', () => {
    expect(displayDate('2024-01-15', 'dd/MM/yyyy')).toBe('15/01/2024')
  })

  test('should handle end-of-year date with MMMM d, yyyy', () => {
    expect(displayDate('2023-12-31', 'MMMM d, yyyy')).toBe('December 31, 2023')
  })

  test('should handle end-of-year date with MM/dd/yyyy', () => {
    expect(displayDate('2023-12-31', 'MM/dd/yyyy')).toBe('12/31/2023')
  })

  // A host can still hold a date the way it used to be shown. It reads the
  // same as the day the form writes, so it shows the same.
  test('should show a value already in the display format the same way', () => {
    expect(displayDate('January 15, 2024', 'MMMM d, yyyy')).toBe(
      'January 15, 2024'
    )
    expect(displayDate('15/01/2024', 'dd/MM/yyyy')).toBe('15/01/2024')
  })

  // What the field shows for text that is no day is that text, so a preview
  // shows the same rather than a blank.
  test('should show text that is no day as it is', () => {
    expect(displayDate('next tuesday', 'dd/MM/yyyy')).toBe('next tuesday')
    expect(displayDate('15/01/2024', 'MMMM d, yyyy')).toBe('15/01/2024')
  })

  // Regression: `yyyy` reads one to four digits, so a year half typed was a
  // day in the year 2 and showed as `15/06/0002`.
  test('should show a year that is not four digits as it was typed', () => {
    expect(displayDate('15/06/2', 'dd/MM/yyyy')).toBe('15/06/2')
    expect(displayDate('15/06/24', 'dd/MM/yyyy')).toBe('15/06/24')
  })

  // A row's preview shows a day in the language of the form. The names come
  // from date-fns, which the library ships in English and Spanish.
  test('should name the month in the language it is given', () => {
    expect(displayDate('2026-10-02', 'MMMM d, yyyy', 'es')).toBe(
      'octubre 2, 2026'
    )
    expect(displayDate('2026-10-02', 'MMMM d, yyyy', 'es-CO')).toBe(
      'octubre 2, 2026'
    )
    expect(displayDate('2026-10-02', 'MMMM d, yyyy', 'de')).toBe(
      'October 2, 2026'
    )
  })
})
