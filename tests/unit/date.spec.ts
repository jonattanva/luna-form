import { expect, test } from '@playwright/test'
import {
  getMonth,
  getYear,
  getConvert,
  getTimezones,
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
