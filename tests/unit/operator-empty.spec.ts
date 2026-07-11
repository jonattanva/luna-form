import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('empty', () => {
  test('should return true when the value is absent or blank', () => {
    expect(operators.empty(undefined, undefined)).toBe(true)
    expect(operators.empty(null, undefined)).toBe(true)
    expect(operators.empty('', undefined)).toBe(true)
    expect(operators.empty([], undefined)).toBe(true)
  })

  test('should return false when the value is present', () => {
    expect(operators.empty('a', undefined)).toBe(false)
    expect(operators.empty(0, undefined)).toBe(false)
    expect(operators.empty(false, undefined)).toBe(false)
    expect(operators.empty(['a'], undefined)).toBe(false)
  })

  test('should be the inverse of exists (value ignored)', () => {
    for (const current of [undefined, null, '', [], 'x', 0, false, ['x']]) {
      expect(operators.empty(current, 'ignored')).toBe(
        !operators.exists(current, 'ignored')
      )
    }
  })
})
