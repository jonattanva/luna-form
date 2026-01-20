import { expect, test } from '@playwright/test'
import { mergeStyle } from '@/packages/luna-core/src/util/style'

test.describe('Style Helper', { tag: ['@unit'] }, () => {
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
    const localStyle = { orientation: 'horizontal' as const }
    expect(mergeStyle(globalStyle, localStyle)).toEqual({
      compact: true,
      orientation: 'horizontal',
    })
  })

  test('should prioritize local style over global style', () => {
    const globalStyle = { compact: true, orientation: 'vertical' as const }
    const localStyle = { compact: false }
    expect(mergeStyle(globalStyle, localStyle)).toEqual({
      compact: false,
      orientation: 'vertical',
    })
  })
})
