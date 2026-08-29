import { describe, expect, test } from 'vitest'
import { mergeStyle } from '@/packages/luna-core/src/util/style'

describe('Style Helper', () => {
  test('should return empty object when both styles are undefined', () => {
    expect(mergeStyle(undefined, undefined)).toEqual({})
  })

  test('should return global style when local style is undefined', () => {
    const globalStyle = { compact: true }
    expect(mergeStyle(globalStyle, undefined)).toEqual({ compact: true })
  })

  test('should return local style when global style is undefined', () => {
    const localStyle = { compact: false }
    expect(mergeStyle(undefined, localStyle)).toEqual({ compact: false })
  })

  test('should merge global and local styles', () => {
    const globalStyle = { compact: true }
    const localStyle = { horizontal: true }
    expect(mergeStyle(globalStyle, localStyle)).toEqual({
      compact: true,
      horizontal: true,
    })
  })

  test('should keep the global value when the local one is undefined', () => {
    // The key is present and unanswered, which is what a section that declares
    // no `compact` of its own hands over. A spread would drop the global here.
    const globalStyle = { compact: true, horizontal: true }
    const localStyle = { compact: undefined, horizontal: undefined }
    expect(mergeStyle(globalStyle, localStyle)).toEqual({
      compact: true,
      horizontal: true,
    })
  })

  test('should let an explicit false override the global style', () => {
    const globalStyle = { horizontal: true }
    const localStyle = { horizontal: false }
    expect(mergeStyle(globalStyle, localStyle)).toEqual({ horizontal: false })
  })

  test('should prioritize local style over global style', () => {
    const globalStyle = { compact: true, horizontal: false }
    const localStyle = { compact: false }
    expect(mergeStyle(globalStyle, localStyle)).toEqual({
      compact: false,
      horizontal: false,
    })
  })
})
