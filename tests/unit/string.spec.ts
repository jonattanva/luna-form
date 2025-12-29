import { expect, test } from '@playwright/test'
import {
  interpolate,
  isInterpolated,
} from '@/packages/luna-core/src/helper/string'

test.describe('String Helper', { tag: ['@unit'] }, () => {
  test.describe('interpolate', () => {
    test('should interpolate simple values', () => {
      const template = '/api/items/{id}'
      const values = { id: 123 }
      expect(interpolate(template, values)).toBe('/api/items/123')
    })

    test('should interpolate multiple values', () => {
      const template = '/api/items/{category}/{id}'
      const values = { category: 'books', id: 456 }
      expect(interpolate(template, values)).toBe('/api/items/books/456')
    })

    test('should interpolate nested values', () => {
      const template = '/api/users/{user.id}/profile'
      const values = { user: { id: 789 } }
      expect(interpolate(template, values)).toBe('/api/users/789/profile')
    })

    test('should encode values for URL', () => {
      const template = '/api/search?q={query}'
      const values = { query: 'hello world' }
      expect(interpolate(template, values)).toBe('/api/search?q=hello%20world')
    })

    test('should not encode full URLs', () => {
      const template = '{url}'
      const values = { url: 'https://pokeapi.co/api/v2/pokemon/1/' }
      expect(interpolate(template, values)).toBe(
        'https://pokeapi.co/api/v2/pokemon/1/'
      )
    })

    test('should keep placeholder if value is missing', () => {
      const template = '/api/items/{id}'
      const values = {}
      expect(interpolate(template, values)).toBe('/api/items/{id}')
    })

    test('should handle null or undefined values by keeping placeholder', () => {
      const template = '/api/items/{id}'
      const values = { id: null }
      expect(interpolate(template, values)).toBe('/api/items/{id}')
    })
  })

  test.describe('isInterpolated', () => {
    test('should return true if string contains placeholders', () => {
      expect(isInterpolated('/api/items/{id}')).toBe(true)
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
})
