import { describe, expect, test } from 'vitest'
import { getUserTimezone } from '@/packages/luna-core/src/util/date'

describe('getUserTimezone', () => {
  test('should return a non-empty string', () => {
    const tz = getUserTimezone()
    expect(typeof tz).toBe('string')
    expect(tz.length).toBeGreaterThan(0)
  })

  test('should match the Intl resolved timezone', () => {
    expect(getUserTimezone()).toBe(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    )
  })

  test('should return a valid IANA timezone containing no spaces', () => {
    const tz = getUserTimezone()
    expect(tz).not.toContain(' ')
  })
})
