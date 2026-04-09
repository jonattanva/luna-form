import { expect, test } from '@playwright/test'
import {
  getMonth,
  getWeekDays,
  getYear,
  getConvert,
  getTimezones,
  toNativeTime,
  fromNativeTime,
} from '@/packages/luna-core/src/util/date'

test.describe('Date', { tag: ['@unit'] }, () => {
  test('should return the correct months', () => {
    expect(getMonth()).toEqual([
      { value: '1', label: 'January' },
      { value: '2', label: 'February' },
      { value: '3', label: 'March' },
      { value: '4', label: 'April' },
      { value: '5', label: 'May' },
      { value: '6', label: 'June' },
      { value: '7', label: 'July' },
      { value: '8', label: 'August' },
      { value: '9', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' },
    ])
  })

  test.describe('getWeekDays', () => {
    test('should return exactly 7 days', () => {
      expect(getWeekDays()).toHaveLength(7)
    })

    test('should return the correct week days', () => {
      expect(getWeekDays()).toEqual([
        { value: '0', label: 'Sunday' },
        { value: '1', label: 'Monday' },
        { value: '2', label: 'Tuesday' },
        { value: '3', label: 'Wednesday' },
        { value: '4', label: 'Thursday' },
        { value: '5', label: 'Friday' },
        { value: '6', label: 'Saturday' },
      ])
    })

    test('each item should have value and label as strings', () => {
      for (const day of getWeekDays()) {
        expect(typeof day.value).toBe('string')
        expect(typeof day.label).toBe('string')
        expect(day.label.length).toBeGreaterThan(0)
      }
    })

    test('values should be sequential from 0 to 6', () => {
      const values = getWeekDays().map((d) => d.value)
      expect(values).toEqual(['0', '1', '2', '3', '4', '5', '6'])
    })
  })

  test('should return the correct years', () => {
    expect(getYear(2020, 2023)).toEqual([
      { value: '2020', label: '2020' },
      { value: '2021', label: '2021' },
      { value: '2022', label: '2022' },
      { value: '2023', label: '2023' },
    ])
  })

  test('should return an empty array when max is less than min', () => {
    expect(getYear(2025, 2020)).toEqual([])
  })

  test('should handle same min and max', () => {
    expect(getYear(2022, 2022)).toEqual([{ value: '2022', label: '2022' }])
  })

  test.describe('getTimezones', () => {
    test('should return a non-empty array of groups', () => {
      expect(getTimezones().length).toBeGreaterThan(0)
    })

    test('each group should have a label and a non-empty items array', () => {
      for (const group of getTimezones()) {
        expect(typeof group.label).toBe('string')
        expect(group.label.length).toBeGreaterThan(0)
        expect(group.items.length).toBeGreaterThan(0)
      }
    })

    test('each item should have value and label as strings', () => {
      for (const group of getTimezones()) {
        for (const item of group.items) {
          expect(typeof item.value).toBe('string')
          expect(typeof item.label).toBe('string')
        }
      }
    })

    test('item label should follow format: City - Long Name (UTC offset)', () => {
      for (const group of getTimezones()) {
        for (const item of group.items) {
          expect(item.label).toMatch(/\(UTC/)
        }
      }
    })

    test('should always place a Suggested group first with the detected timezone', () => {
      const groups = getTimezones()
      expect(groups[0].label).toBe('Suggested')
      expect(groups[0].items).toHaveLength(1)
    })

    test('items within each group should be sorted alphabetically', () => {
      for (const group of getTimezones()) {
        const labels = group.items.map((i) => i.label)
        const sorted = [...labels].sort((a, b) => a.localeCompare(b))
        expect(labels).toEqual(sorted)
      }
    })

    test('should include expected region groups', () => {
      const labels = getTimezones().map((g) => g.label)
      expect(labels).toContain('Americas')
      expect(labels).toContain('Europe')
      expect(labels).toContain('Asia / Pacific')
    })

    test('should include common timezones in their expected groups', () => {
      const groups = getTimezones()
      const americas = groups.find((g) => g.label === 'Americas')
      const europe = groups.find((g) => g.label === 'Europe')
      const asiaPacific = groups.find((g) => g.label === 'Asia / Pacific')

      expect(americas?.items.map((i) => i.value)).toContain('America/New_York')
      expect(europe?.items.map((i) => i.value)).toContain('Europe/London')
      expect(asiaPacific?.items.map((i) => i.value)).toContain('Asia/Tokyo')
    })

    test('should not contain duplicate values across all groups', () => {
      const allValues = getTimezones().flatMap((g) =>
        g.items.map((i) => i.value)
      )
      expect(new Set(allValues).size).toBe(allValues.length)
    })
  })

  test.describe('toNativeTime', () => {
    test('should return empty string for empty input', () => {
      expect(toNativeTime('', 'HH:mm')).toBe('')
    })

    test('should convert HH:mm to HH:mm:ss', () => {
      expect(toNativeTime('14:30', 'HH:mm')).toBe('14:30:00')
    })

    test('should convert HH:mm:ss to HH:mm:ss', () => {
      expect(toNativeTime('14:30:45', 'HH:mm:ss')).toBe('14:30:45')
    })

    test('should convert hh:mm a to HH:mm:ss', () => {
      expect(toNativeTime('02:30 PM', 'hh:mm a')).toBe('14:30:00')
    })

    test('should convert hh:mm:ss a to HH:mm:ss', () => {
      expect(toNativeTime('02:30:45 PM', 'hh:mm:ss a')).toBe('14:30:45')
    })

    test('should convert 12:00 AM to 00:00:00', () => {
      expect(toNativeTime('12:00 AM', 'hh:mm a')).toBe('00:00:00')
    })

    test('should convert 12:00 PM to 12:00:00', () => {
      expect(toNativeTime('12:00 PM', 'hh:mm a')).toBe('12:00:00')
    })

    test('should convert midnight 00:00 HH:mm to 00:00:00', () => {
      expect(toNativeTime('00:00', 'HH:mm')).toBe('00:00:00')
    })

    test('should convert end-of-day 23:59:59 correctly', () => {
      expect(toNativeTime('23:59:59', 'HH:mm:ss')).toBe('23:59:59')
    })

    test('should return empty string for invalid value', () => {
      expect(toNativeTime('not-a-time', 'HH:mm')).toBe('')
    })

    test('should return empty string for out-of-range hour', () => {
      expect(toNativeTime('25:00', 'HH:mm')).toBe('')
    })

    test('should return empty string when value does not match format', () => {
      expect(toNativeTime('14:30:00', 'hh:mm a')).toBe('')
    })
  })

  test.describe('fromNativeTime', () => {
    test('should return empty string for empty input', () => {
      expect(fromNativeTime('', 'HH:mm')).toBe('')
    })

    test('should convert HH:mm:ss native to HH:mm', () => {
      expect(fromNativeTime('14:30:00', 'HH:mm')).toBe('14:30')
    })

    test('should convert HH:mm:ss native to HH:mm:ss', () => {
      expect(fromNativeTime('14:30:00', 'HH:mm:ss')).toBe('14:30:00')
    })

    test('should convert HH:mm:ss native to hh:mm a', () => {
      expect(fromNativeTime('14:30:00', 'hh:mm a')).toBe('02:30 PM')
    })

    test('should convert HH:mm:ss native to hh:mm:ss a', () => {
      expect(fromNativeTime('14:30:45', 'hh:mm:ss a')).toBe('02:30:45 PM')
    })

    test('should convert midnight 00:00:00 to 12:00 AM', () => {
      expect(fromNativeTime('00:00:00', 'hh:mm a')).toBe('12:00 AM')
    })

    test('should convert noon 12:00:00 to 12:00 PM', () => {
      expect(fromNativeTime('12:00:00', 'hh:mm a')).toBe('12:00 PM')
    })

    test('should handle HH:mm input without seconds', () => {
      expect(fromNativeTime('14:30', 'HH:mm')).toBe('14:30')
    })

    test('should convert HH:mm input to hh:mm a', () => {
      expect(fromNativeTime('09:05', 'hh:mm a')).toBe('09:05 AM')
    })

    test('should return empty string for invalid native value', () => {
      expect(fromNativeTime('not-a-time', 'HH:mm')).toBe('')
    })

    test('should return empty string for out-of-range native hour', () => {
      expect(fromNativeTime('25:00:00', 'HH:mm')).toBe('')
    })
  })

  test('should convert various year formats correctly', () => {
    const currentYear = new Date().getFullYear()

    expect(getConvert('current')).toBe(currentYear)
    expect(getConvert('current+3')).toBe(currentYear + 3)
    expect(getConvert('current-2')).toBe(currentYear - 2)
    expect(getConvert('current+0')).toBe(currentYear)
    expect(getConvert(2025)).toBe(2025)
    expect(getConvert('2020')).toBe(2020)
    expect(getConvert(' 2021 ')).toBe(2021)
    expect(getConvert('invalid')).toBe(currentYear)
    expect(getConvert('2024abc')).toBe(currentYear)
    expect(getConvert('20 24')).toBe(currentYear)
    expect(getConvert('')).toBe(currentYear)
  })
})
