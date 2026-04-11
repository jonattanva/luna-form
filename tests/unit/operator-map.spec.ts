import { operators } from '@/packages/luna-core/src/util/operator'
import { describe, expect, test } from 'vitest'

describe('operators map', () => {
  test('should expose all expected operators', () => {
    expect(Object.keys(operators).sort()).toEqual([
      'eq',
      'gt',
      'gte',
      'in',
      'lt',
      'lte',
      'neq',
      'nin',
    ])
  })

  test('all operators should be functions', () => {
    for (const key of Object.keys(operators)) {
      expect(typeof operators[key]).toBe('function')
    }
  })
})
