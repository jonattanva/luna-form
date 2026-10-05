import { describe, expect, test, vi } from 'vitest'
import {
  applyFormatFilter,
  formatFilters,
  readNow,
} from '@/packages/luna-core/src/util/format'

describe('formatFilters.currency', () => {
  test('formats USD with en-US locale', () => {
    const result = formatFilters.currency(1234.56, ['USD'], { locale: 'en-US' })
    expect(result).toBe('$1,234.56')
  })

  test('defaults currency to USD when no arg provided', () => {
    const result = formatFilters.currency(1000, [], { locale: 'en-US' })
    expect(result).toBe('$1,000.00')
  })

  test('formats EUR with es-ES locale', () => {
    const result = formatFilters.currency(1234.56, ['EUR'], { locale: 'es-ES' })
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
    const result = formatFilters.date('2026-05-10', [], { locale: 'en-US' })
    expect(result).toMatch(/5\/10\/26|5\/9\/26/) // timezone may shift
  })

  test('formats with long style', () => {
    const result = formatFilters.date('2026-05-10', ['long'], {
      locale: 'en-US',
    })
    expect(result).toMatch(/May (9|10), 2026/)
  })

  // Measured from the instant the host gives, never from this machine's clock,
  // so the server and the browser render the same words on any day.
  test('formats relative style from the instant it is given', () => {
    const result = formatFilters.date('2026-10-12T12:00:00Z', ['relative'], {
      locale: 'en-US',
      now: '2026-10-05T12:00:00Z',
    })
    expect(result).toBe('in 7 days')
  })

  test('formats relative style the same whatever day it is', () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2031-01-15T12:00:00Z'))
      const result = formatFilters.date('2026-10-12T12:00:00Z', ['relative'], {
        locale: 'en-US',
        now: '2026-10-05T12:00:00Z',
      })
      expect(result).toBe('in 7 days')
    } finally {
      vi.useRealTimers()
    }
  })

  // An instant without its offset would be read in this machine's zone, which
  // is the clock the form keeps no more.
  test.each([undefined, 'not-an-instant', '2026-10-05T12:00:00', '2026-10-05'])(
    'shows the date in medium style with no instant to measure from (%s)',
    (now) => {
      const result = formatFilters.date('2026-10-12T12:00:00', ['relative'], {
        locale: 'en-US',
        now,
      })
      expect(result).toBe('Oct 12, 2026')
    }
  )

  test('falls back to String for invalid date', () => {
    expect(formatFilters.date('not-a-date', [], { locale: 'en-US' })).toBe(
      'not-a-date'
    )
  })
})

describe('formatFilters.duration', () => {
  test('returns the distance from the instant it is given for a date', () => {
    const result = formatFilters.duration('2026-07-07T12:00:00Z', [], {
      locale: 'en-US',
      now: '2026-10-05T12:00:00Z',
    })
    expect(result).toBe('3 months ago')
  })

  test('shows a date in medium style with no instant to measure from', () => {
    const result = formatFilters.duration('2026-07-07T12:00:00', [], {
      locale: 'en-US',
    })
    expect(result).toBe('Jul 7, 2026')
  })

  test('formats milliseconds (default unit) as legible breakdown', () => {
    const result = formatFilters.duration(93_600_000, [], { locale: 'en-US' })
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
    expect(formatFilters.duration('garbage', [], { locale: 'en-US' })).toBe(
      'garbage'
    )
  })

  test('falls back to String when unit is unknown', () => {
    expect(formatFilters.duration(10, ['weeks'], { locale: 'en-US' })).toBe(
      '10'
    )
  })
})

describe('applyFormatFilter', () => {
  test('parses name and args from expression', () => {
    expect(
      applyFormatFilter(1234.56, 'currency:USD', { locale: 'en-US' })
    ).toBe('$1,234.56')
  })

  test('returns undefined when filter does not exist', () => {
    expect(applyFormatFilter(1, 'unknown', { locale: 'en-US' })).toBeUndefined()
  })

  test('returns undefined for empty expression', () => {
    expect(applyFormatFilter(1, '', { locale: 'en-US' })).toBeUndefined()
  })
})

// `context.now` is read only as an ISO date, time and offset; anything else is
// named once for the context that carries it, since without it nothing on the
// form measures from "now".
describe('readNow', () => {
  test('should read an instant with its offset', () => {
    expect(readNow({ now: '2026-10-05T19:30:00-05:00' })).toBe(
      '2026-10-05T19:30:00-05:00'
    )
    expect(readNow({ now: '2026-10-05T12:00:00Z' })).toBe(
      '2026-10-05T12:00:00Z'
    )
  })

  test('should read nothing, and say nothing, without a now', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(readNow()).toBeUndefined()
      expect(readNow({ user: 'jane' })).toBeUndefined()
      expect(warn).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })

  test.each([
    ['a Date', new Date('2026-10-05T12:00:00Z')],
    ['a timestamp', 1791201600000],
    ['an instant without its offset', '2026-10-05T12:00:00'],
    ['a day', '2026-10-05'],
  ])('should read no instant from %s, and name it once', (_, now) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const context = { now }

      expect(readNow(context)).toBeUndefined()
      readNow(context)
      expect(warn).toHaveBeenCalledTimes(1)
    } finally {
      warn.mockRestore()
    }
  })
})
