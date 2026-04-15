import { describe, expect, test } from 'vitest'
import { getDateFormat } from '@/packages/luna-core/src/util/date'
import type { Date as DateField } from '@/packages/luna-core/src/type'

describe('getDateFormat', () => {
  test('should return default MMMM d, yyyy when field has no advanced property', () => {
    const field: DateField = { name: 'dob', type: 'date' }
    expect(getDateFormat(field)).toBe('MMMM d, yyyy')
  })

  test('should return default MMMM d, yyyy when advanced has no format', () => {
    const field: DateField = { name: 'dob', type: 'date', advanced: {} }
    expect(getDateFormat(field)).toBe('MMMM d, yyyy')
  })

  test('should return MMMM d, yyyy when set', () => {
    const field: DateField = {
      name: 'dob',
      type: 'date',
      advanced: { format: 'MMMM d, yyyy' },
    }
    expect(getDateFormat(field)).toBe('MMMM d, yyyy')
  })

  test('should return MM/dd/yyyy when set', () => {
    const field: DateField = {
      name: 'dob',
      type: 'date',
      advanced: { format: 'MM/dd/yyyy' },
    }
    expect(getDateFormat(field)).toBe('MM/dd/yyyy')
  })

  test('should return dd/MM/yyyy when set', () => {
    const field: DateField = {
      name: 'dob',
      type: 'date',
      advanced: { format: 'dd/MM/yyyy' },
    }
    expect(getDateFormat(field)).toBe('dd/MM/yyyy')
  })
})
