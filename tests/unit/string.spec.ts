import { expect, test } from '@playwright/test'
import {
  formatMarkdown,
  interpolate,
  isInterpolated,
} from '@/packages/luna-core/src/util/string'

test.describe('String Helper', { tag: ['@unit'] }, () => {
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

  test.describe('formatMarkdown', () => {
    test('should return null for empty or null text', () => {
      expect(formatMarkdown('')).toBeNull()
      expect(formatMarkdown(undefined)).toBeNull()
    })

    test('should return original text if no links found', () => {
      const text = 'Hello world'
      expect(formatMarkdown(text)).toBe(text)
    })

    test('should parse single link', () => {
      const text = 'Click [here](https://example.com)'
      const result = formatMarkdown(text, (index, url, linkText) => ({
        index,
        url,
        linkText,
      }))
      expect(result).toEqual([
        'Click ',
        { index: 6, url: 'https://example.com', linkText: 'here' },
      ])
    })

    test('should parse multiple links', () => {
      const text = '[Link 1](url1) and [Link 2](url2)'
      const result = formatMarkdown(text, (index, url, linkText) => ({
        url,
        linkText,
      }))
      expect(result).toEqual([
        { url: 'url1', linkText: 'Link 1' },
        ' and ',
        { url: 'url2', linkText: 'Link 2' },
      ])
    })

    test('should handle text after last link', () => {
      const text = 'Check [this](url) out!'
      const result = formatMarkdown(text, (_, url) => `LINK(${url})`)
      expect(result).toEqual(['Check ', 'LINK(url)', ' out!'])
    })

    test('should return original text if no callback provided and links exist', () => {
      const text = 'Click [here](url)'
      expect(formatMarkdown(text)).toEqual(['Click ', '[here](url)'])
    })
  })
})
