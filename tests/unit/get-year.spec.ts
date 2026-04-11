import { describe, expect, test } from 'vitest'
import { getYear } from '@/packages/luna-core/src/util/date'

describe('getYear', () => {
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
})
