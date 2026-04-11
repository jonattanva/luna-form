import { describe, expect, test } from 'vitest'
import { isInterpolated } from '@/packages/luna-core/src/util/string'

describe('isInterpolated', () => {
  test('should return true if string contains placeholders', () => {
    expect(isInterpolated('/api/items/{id}')).toBe(true)
  })

  test('should return true if object contains placeholders', () => {
    expect(isInterpolated({ url: '/api/items/{id}' })).toBe(true)
  })

  test('should return false if object does not contain placeholders', () => {
    expect(isInterpolated({ url: '/api/items/123' })).toBe(false)
  })

  test('should return true if string contains multiple placeholders', () => {
    expect(isInterpolated('/api/items/{category}/{id}')).toBe(true)
  })

  test('should return true if string contains nested placeholders', () => {
    expect(isInterpolated('/api/users/{user.id}/profile')).toBe(true)
  })

  test('should return false if string does not contain placeholders', () => {
    expect(isInterpolated('/api/items/123')).toBe(false)
  })

  test('should return false for empty string', () => {
    expect(isInterpolated('')).toBe(false)
  })
})
