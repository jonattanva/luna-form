import { describe, expect, test } from 'vitest'
import {
  formatMarkdown,
  formatTemplate,
} from '@/packages/luna-core/src/util/string'

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

describe('formatTemplate', () => {
  const link = (_: number, url: string, text?: string) => ({ text, url })
  const TYPED = '[Verify your account](https://attacker.example/login)'

  test('shows a value that looks like a link as text', () => {
    const result = formatTemplate(
      'You entered: {value}',
      { values: { value: TYPED } },
      link
    )
    expect(result).toBe(`You entered: ${TYPED}`)
  })

  test('keeps the links the template wrote', () => {
    const result = formatTemplate(
      'See [the guide](https://docs.example) for {value}',
      { values: { value: TYPED } },
      link
    )
    expect(result).toEqual([
      'See ',
      { text: 'the guide', url: 'https://docs.example' },
      ` for ${TYPED}`,
    ])
  })

  test('resolves a placeholder in an authored link text and url', () => {
    const result = formatTemplate(
      '[{context.name}]({context.url})',
      {
        values: { context: { name: 'Jane', url: 'https://example.com/jane' } },
      },
      link
    )
    expect(result).toEqual([{ text: 'Jane', url: 'https://example.com/jane' }])
  })

  test('reads the links of a translation the dictionary returns', () => {
    const result = formatTemplate(
      'Code: {value}',
      {
        dictionary: {
          'Code: 7': 'Codigo 7, ver [ayuda](https://help.example)',
        },
        values: { value: 7 },
      },
      link
    )
    expect(result).toEqual([
      'Codigo 7, ver ',
      { text: 'ayuda', url: 'https://help.example' },
    ])
  })

  test('is null when the template resolves to blank text', () => {
    expect(
      formatTemplate('{value}', { values: { value: ' ' } }, link)
    ).toBeNull()
    expect(formatTemplate(undefined, {}, link)).toBeNull()
  })
})
