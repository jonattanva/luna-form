import { describe, expect, test } from 'vitest'
import { getWeekDays } from '@/packages/luna-core/src/util/date'

describe('getWeekDays', () => {
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
