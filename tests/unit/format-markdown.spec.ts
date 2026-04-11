import { describe, expect, test } from 'vitest'
import { formatMarkdown } from '@/packages/luna-core/src/util/string'

describe('formatMarkdown', () => {
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
