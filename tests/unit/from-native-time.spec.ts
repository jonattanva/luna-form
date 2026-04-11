import { describe, expect, test } from 'vitest'
import { fromNativeTime } from '@/packages/luna-core/src/util/date'

describe('fromNativeTime', () => {
  test('should return empty string for empty input', () => {
    expect(fromNativeTime('', 'HH:mm')).toBe('')
  })

  test('should convert HH:mm:ss native to HH:mm', () => {
    expect(fromNativeTime('14:30:00', 'HH:mm')).toBe('14:30')
  })

  test('should convert HH:mm:ss native to HH:mm:ss', () => {
    expect(fromNativeTime('14:30:00', 'HH:mm:ss')).toBe('14:30:00')
  })

  test('should convert HH:mm:ss native to hh:mm a', () => {
    expect(fromNativeTime('14:30:00', 'hh:mm a')).toBe('02:30 PM')
  })

  test('should convert HH:mm:ss native to hh:mm:ss a', () => {
    expect(fromNativeTime('14:30:45', 'hh:mm:ss a')).toBe('02:30:45 PM')
  })

  test('should convert midnight 00:00:00 to 12:00 AM', () => {
    expect(fromNativeTime('00:00:00', 'hh:mm a')).toBe('12:00 AM')
  })

  test('should convert noon 12:00:00 to 12:00 PM', () => {
    expect(fromNativeTime('12:00:00', 'hh:mm a')).toBe('12:00 PM')
  })

  test('should handle HH:mm input without seconds', () => {
    expect(fromNativeTime('14:30', 'HH:mm')).toBe('14:30')
  })

  test('should convert HH:mm input to hh:mm a', () => {
    expect(fromNativeTime('09:05', 'hh:mm a')).toBe('09:05 AM')
  })

  test('should return empty string for invalid native value', () => {
    expect(fromNativeTime('not-a-time', 'HH:mm')).toBe('')
  })

  test('should return empty string for out-of-range native hour', () => {
    expect(fromNativeTime('25:00:00', 'HH:mm')).toBe('')
  })
})
