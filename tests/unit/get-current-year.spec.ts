import { describe, expect, test } from 'vitest'
import { getCurrentYear } from '@/packages/luna-core/src/util/date'

describe('getCurrentYear', () => {
  test('should return a number', () => {
    expect(typeof getCurrentYear()).toBe('number')
  })

  test('should return the current full year', () => {
    expect(getCurrentYear()).toBe(new Date().getFullYear())
  })

  test('should return a four-digit year', () => {
    const year = getCurrentYear()
    expect(year).toBeGreaterThanOrEqual(2000)
    expect(year).toBeLessThan(3000)
  })
})
