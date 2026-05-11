import { describe, expect, test } from 'vitest'
import {
  applyFormatFilter,
  formatFilters,
} from '@/packages/luna-core/src/util/format'

describe('formatFilters.currency', () => {
  test('formats USD with en-US locale', () => {
    const result = formatFilters.currency(
      1234.56,
      ['USD'],
      { locale: 'en-US' }
    )
    expect(result).toBe('$1,234.56')
  })

  test('defaults currency to USD when no arg provided', () => {
    const result = formatFilters.currency(1000, [], { locale: 'en-US' })
    expect(result).toBe('$1,000.00')
  })

  test('formats EUR with es-ES locale', () => {
    const result = formatFilters.currency(
      1234.56,
      ['EUR'],
      { locale: 'es-ES' }
    )
    // The result contains a non-breaking space; assert via includes.
    expect(result).toContain('1234,56')
    expect(result).toContain('€')
  })

  test('falls back to String when value is not numeric', () => {
    expect(
      formatFilters.currency('not-a-number', ['USD'], { locale: 'en-US' })
    ).toBe('not-a-number')
  })

  test('parses numeric strings', () => {
    expect(
      formatFilters.currency('1234.56', ['USD'], { locale: 'en-US' })
    ).toBe('$1,234.56')
  })
})

describe('formatFilters.percent', () => {
  test('formats fractional value as percent', () => {
    expect(formatFilters.percent(0.25, [], { locale: 'en-US' })).toBe('25%')
  })

  test('falls back to String when value is not numeric', () => {
    expect(formatFilters.percent('abc', [], { locale: 'en-US' })).toBe('abc')
  })
})

describe('formatFilters.number', () => {
  test('formats with thousands separator (en-US)', () => {
    expect(formatFilters.number(1234567, [], { locale: 'en-US' })).toBe(
      '1,234,567'
    )
  })

  test('formats with locale-specific separator (es-ES)', () => {
    const result = formatFilters.number(1234567, [], { locale: 'es-ES' })
    expect(result).toContain('1')
    expect(result).toContain('234')
  })
})

describe('formatFilters.date', () => {
  test('formats ISO string with default short style', () => {
    const result = formatFilters.date(
      '2026-05-10',
      [],
      { locale: 'en-US' }
    )
    expect(result).toMatch(/5\/10\/26|5\/9\/26/) // timezone may shift
  })

  test('formats with long style', () => {
    const result = formatFilters.date(
      '2026-05-10',
      ['long'],
      { locale: 'en-US' }
    )
    expect(result).toMatch(/May (9|10), 2026/)
  })

  test('formats relative style', () => {
    const future = new Date(Date.now() + 7 * 86400 * 1000)
    const result = formatFilters.date(
      future.toISOString(),
      ['relative'],
      { locale: 'en-US' }
    )
    expect(result).toMatch(/in /i)
  })

  test('falls back to String for invalid date', () => {
    expect(
      formatFilters.date('not-a-date', [], { locale: 'en-US' })
    ).toBe('not-a-date')
  })
})

describe('formatFilters.duration', () => {
  test('returns relative distance for ISO date input', () => {
    const past = new Date(Date.now() - 90 * 86400 * 1000)
    const result = formatFilters.duration(
      past.toISOString(),
      [],
      { locale: 'en-US' }
    )
    expect(result.toLowerCase()).toContain('ago')
  })

  test('formats milliseconds (default unit) as legible breakdown', () => {
    const result = formatFilters.duration(
      93_600_000,
      [],
      { locale: 'en-US' }
    )
    expect(result).toContain('1 day')
    expect(result).toContain('2 hours')
  })

  test('formats with seconds unit', () => {
    const result = formatFilters.duration(3600, ['s'], { locale: 'en-US' })
    expect(result).toBe('1 hour')
  })

  test('formats with minutes unit', () => {
    const result = formatFilters.duration(90, ['min'], { locale: 'en-US' })
    expect(result).toContain('1 hour')
    expect(result).toContain('30 minutes')
  })

  test('falls back to String when value is neither date nor number', () => {
    expect(
      formatFilters.duration('garbage', [], { locale: 'en-US' })
    ).toBe('garbage')
  })

  test('falls back to String when unit is unknown', () => {
    expect(
      formatFilters.duration(10, ['weeks'], { locale: 'en-US' })
    ).toBe('10')
  })
})

describe('applyFormatFilter', () => {
  test('parses name and args from expression', () => {
    expect(
      applyFormatFilter(1234.56, 'currency:USD', { locale: 'en-US' })
    ).toBe('$1,234.56')
  })

  test('returns undefined when filter does not exist', () => {
    expect(
      applyFormatFilter(1, 'unknown', { locale: 'en-US' })
    ).toBeUndefined()
  })

  test('returns undefined for empty expression', () => {
    expect(
      applyFormatFilter(1, '', { locale: 'en-US' })
    ).toBeUndefined()
  })
})
