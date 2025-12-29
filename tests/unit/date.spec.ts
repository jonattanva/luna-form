import { expect, test } from '@playwright/test'
import {
  getMonth,
  getYear,
  getConvert,
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
