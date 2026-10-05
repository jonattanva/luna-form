import { describe, expect, test, vi } from 'vitest'
import { getTimezones } from '@/packages/luna-core/src/util/date'

const WINTER = '2026-01-15T12:00:00Z'
const SUMMER = '2026-07-15T12:00:00Z'

const itemOf = (groups: ReturnType<typeof getTimezones>, value: string) =>
  groups.flatMap((group) => group.items).find((item) => item.value === value)

describe('getTimezones', () => {
  test('should return a non-empty array of groups', () => {
    expect(getTimezones(undefined, WINTER).length).toBeGreaterThan(0)
  })

  test('each group should have a label and a non-empty items array', () => {
    for (const group of getTimezones(undefined, WINTER)) {
      expect(group.label.length).toBeGreaterThan(0)
      expect(group.items.length).toBeGreaterThan(0)
    }
  })

  test('item label should follow format: City - Long Name (UTC offset)', () => {
    for (const group of getTimezones(undefined, WINTER)) {
      for (const item of group.items) {
        expect(item.label).toMatch(/^.+ - .+ \(UTC/)
      }
    }
  })

  // The offset a zone has depends on the instant: the host gives it, so the
  // server and the browser label every zone the same, on any day.
  test('should give each zone its offset at the instant it is given', () => {
    expect(
      itemOf(getTimezones(undefined, WINTER), 'Europe/Madrid')?.label
    ).toBe('Madrid - Central European (UTC+01:00)')
    expect(
      itemOf(getTimezones(undefined, SUMMER), 'Europe/Madrid')?.label
    ).toBe('Madrid - Central European (UTC+02:00)')
  })

  test('should give the same labels whatever this machine is told the time is', () => {
    const labelsOf = (groups: ReturnType<typeof getTimezones>) =>
      new Map(groups.flatMap((g) => g.items.map((i) => [i.value, i.label])))

    const before = labelsOf(getTimezones(undefined, WINTER))
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2031-07-15T12:00:00Z'))
      // Another zone suggested, so the list is built again under this clock.
      const after = labelsOf(getTimezones('Asia/Tokyo', WINTER))

      expect(after.size).toBe(before.size)
      for (const [value, label] of after) {
        expect(label).toBe(before.get(value))
      }
    } finally {
      vi.useRealTimers()
    }
  })

  // Without an instant there is no offset to give, nor a name: what a zone is
  // called changes over the years too.
  test.each([undefined, 'not-an-instant'])(
    'should label each zone by its city with no instant (%s)',
    (now) => {
      const groups = getTimezones(undefined, now)

      expect(itemOf(groups, 'America/New_York')?.label).toBe('New York')
      expect(itemOf(groups, 'Europe/Madrid')?.label).toBe('Madrid')
    }
  )

  test('should suggest no zone unless it is given one', () => {
    const labels = getTimezones(undefined, WINTER).map((group) => group.label)

    expect(labels).not.toContain('Suggested')
  })

  test('should place the zone it is given first, and only there', () => {
    const groups = getTimezones('America/Bogota', WINTER)

    expect(groups[0]).toEqual({
      label: 'Suggested',
      items: [
        { value: 'America/Bogota', label: 'Bogota - Colombia (UTC-05:00)' },
      ],
    })
    expect(
      groups.slice(1).flatMap((group) => group.items.map((item) => item.value))
    ).not.toContain('America/Bogota')
  })

  // `UTC` is a zone every engine knows, though not every one lists it.
  test('should suggest a zone the list leaves out', () => {
    expect(getTimezones('UTC', WINTER)[0].items).toEqual([
      { value: 'UTC', label: 'UTC - Coordinated Universal Time (UTC+00:00)' },
    ])
  })

  // Built once while the zone and the instant hold: a timezone select builds
  // its options on every render, and there are hundreds of zones.
  test('should hand back the same list for the same zone and instant', () => {
    expect(getTimezones('America/Bogota', WINTER)).toBe(
      getTimezones('America/Bogota', WINTER)
    )
    expect(getTimezones('America/Bogota', SUMMER)).not.toBe(
      getTimezones('America/Bogota', WINTER)
    )
  })

  test('items within each group should be sorted alphabetically', () => {
    for (const group of getTimezones(undefined, WINTER)) {
      const labels = group.items.map((i) => i.label)
      const sorted = [...labels].sort((a, b) => a.localeCompare(b))
      expect(labels).toEqual(sorted)
    }
  })

  test('should include common timezones in their expected groups', () => {
    const groups = getTimezones(undefined, WINTER)
    const valuesOf = (label: string) =>
      groups.find((g) => g.label === label)?.items.map((i) => i.value)

    expect(valuesOf('Americas')).toContain('America/New_York')
    expect(valuesOf('Europe')).toContain('Europe/London')
    expect(valuesOf('Asia / Pacific')).toContain('Asia/Tokyo')
  })

  test('should not contain duplicate values across all groups', () => {
    const allValues = getTimezones('Europe/Madrid', WINTER).flatMap((g) =>
      g.items.map((i) => i.value)
    )
    expect(new Set(allValues).size).toBe(allValues.length)
  })
})
