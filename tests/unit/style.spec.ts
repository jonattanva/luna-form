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

  test('should prioritize local style over global style', () => {
    const globalStyle = { compact: true, horizontal: false }
    const localStyle = { compact: false }
    expect(mergeStyle(globalStyle, localStyle)).toEqual({
      compact: false,
      horizontal: false,
    })
  })
})
