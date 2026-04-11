import { describe, expect, test } from 'vitest'
import { interpolate } from '@/packages/luna-core/src/util/string'

describe('interpolate', () => {
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
    expect(interpolate(template, values)).toBe('/api/search?q=hello world')
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

  test('should interpolate objects recursively', () => {
    const template = {
      url: '/api/items/{id}',
      data: {
        name: '{name}',
        tags: ['{tag1}', '{tag2}'],
      },
    }
    const values = { id: 123, name: 'John', tag1: 'a', tag2: 'b' }
    expect(interpolate(template, values)).toEqual({
      url: '/api/items/123',
      data: {
        name: 'John',
        tags: ['a', 'b'],
      },
    })
  })

  test('should interpolate without encoding when encode is false', () => {
    const template = 'Hello {name}'
    const values = { name: 'John Doe' }
    expect(interpolate(template, values)).toBe('Hello John Doe')
  })

  test('should interpolate arrays recursively', () => {
    const template = ['{id}', { name: '{name}' }]
    const values = { id: 1, name: 'John' }
    expect(interpolate(template, values)).toEqual(['1', { name: 'John' }])
  })
})
