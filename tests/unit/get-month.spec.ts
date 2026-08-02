import { describe, expect, test } from 'vitest'
import { getMonth } from '@/packages/luna-core/src/util/date'

describe('getMonth', () => {
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

  test('should resolve the labels in the requested locale', () => {
    const months = getMonth('es')

    expect(months[0]).toEqual({ value: '1', label: 'enero' })
    expect(months[11]).toEqual({ value: '12', label: 'diciembre' })
  })

  test('should keep the values stable across locales', () => {
    const values = getMonth('fr').map((month) => month.value)
    expect(values).toEqual(getMonth().map((month) => month.value))
  })

  test('should fall back to the runtime locale for a malformed tag', () => {
    expect(getMonth('es_MX')).toEqual(getMonth())
    expect(getMonth('')).toEqual(getMonth())
  })
})
