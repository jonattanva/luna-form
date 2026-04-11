import { describe, expect, test } from 'vitest'
import { getConvert } from '@/packages/luna-core/src/util/date'

describe('getConvert', () => {
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
