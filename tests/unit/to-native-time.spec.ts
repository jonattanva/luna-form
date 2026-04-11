import { describe, expect, test } from 'vitest'
import { toNativeTime } from '@/packages/luna-core/src/util/date'

describe('toNativeTime', () => {
  test('should return empty string for empty input', () => {
    expect(toNativeTime('', 'HH:mm')).toBe('')
  })

  test('should convert HH:mm to HH:mm:ss', () => {
    expect(toNativeTime('14:30', 'HH:mm')).toBe('14:30:00')
  })

  test('should convert HH:mm:ss to HH:mm:ss', () => {
    expect(toNativeTime('14:30:45', 'HH:mm:ss')).toBe('14:30:45')
  })

  test('should convert hh:mm a to HH:mm:ss', () => {
    expect(toNativeTime('02:30 PM', 'hh:mm a')).toBe('14:30:00')
  })

  test('should convert hh:mm:ss a to HH:mm:ss', () => {
    expect(toNativeTime('02:30:45 PM', 'hh:mm:ss a')).toBe('14:30:45')
  })

  test('should convert 12:00 AM to 00:00:00', () => {
    expect(toNativeTime('12:00 AM', 'hh:mm a')).toBe('00:00:00')
  })

  test('should convert 12:00 PM to 12:00:00', () => {
    expect(toNativeTime('12:00 PM', 'hh:mm a')).toBe('12:00:00')
  })

  test('should convert midnight 00:00 HH:mm to 00:00:00', () => {
    expect(toNativeTime('00:00', 'HH:mm')).toBe('00:00:00')
  })

  test('should convert end-of-day 23:59:59 correctly', () => {
    expect(toNativeTime('23:59:59', 'HH:mm:ss')).toBe('23:59:59')
  })

  test('should return empty string for invalid value', () => {
    expect(toNativeTime('not-a-time', 'HH:mm')).toBe('')
  })

  test('should return empty string for out-of-range hour', () => {
    expect(toNativeTime('25:00', 'HH:mm')).toBe('')
  })

  test('should return empty string when value does not match format', () => {
    expect(toNativeTime('14:30:00', 'hh:mm a')).toBe('')
  })
})
