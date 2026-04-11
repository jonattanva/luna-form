import { describe, expect, test } from 'vitest'
import { getTimezones } from '@/packages/luna-core/src/util/date'

describe('getTimezones', () => {
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
    const allValues = getTimezones().flatMap((g) => g.items.map((i) => i.value))
    expect(new Set(allValues).size).toBe(allValues.length)
  })
})
