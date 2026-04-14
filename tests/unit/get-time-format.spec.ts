import { describe, expect, test } from 'vitest'
import { getTimeFormat } from '@/packages/luna-core/src/util/date'
import type { Time } from '@/packages/luna-core/src/type'

describe('getTimeFormat', () => {
  test('should return default HH:mm when field has no advanced property', () => {
    const field: Time = { name: 'start', type: 'time' }
    expect(getTimeFormat(field)).toBe('HH:mm')
  })

  test('should return default HH:mm when advanced has no format', () => {
    const field: Time = { name: 'start', type: 'time', advanced: {} }
    expect(getTimeFormat(field)).toBe('HH:mm')
  })

  test('should return HH:mm:ss when set', () => {
    const field: Time = {
      name: 'start',
      type: 'time',
      advanced: { format: 'HH:mm:ss' },
    }
    expect(getTimeFormat(field)).toBe('HH:mm:ss')
  })

  test('should return hh:mm a when set', () => {
    const field: Time = {
      name: 'start',
      type: 'time',
      advanced: { format: 'hh:mm a' },
    }
    expect(getTimeFormat(field)).toBe('hh:mm a')
  })

  test('should return hh:mm:ss a when set', () => {
    const field: Time = {
      name: 'start',
      type: 'time',
      advanced: { format: 'hh:mm:ss a' },
    }
    expect(getTimeFormat(field)).toBe('hh:mm:ss a')
  })
})
