import { expect, test } from '@playwright/test'
import { resolveRefs } from '../../packages/luna-core/src/util/prepare'

test.describe('Resolve refs', { tag: ['@unit'] }, () => {
  test('should return the original value if definition is invalid', () => {
    const obj = { $ref: '#/definition/nonexistent' }
    const result = resolveRefs(obj, undefined)
    expect(result).toEqual(obj)
  })

  test('should return the original value if base is not an object', () => {
    const obj = 'not-an-object'
    const result = resolveRefs(obj, { someDef: {} })
    expect(result).toBe(obj)
  })

  test('should return the original value if $ref is not a string', () => {
    const obj = { $ref: 123 }
    const result = resolveRefs(obj, { someDef: {} })
    expect(result).toEqual(obj)
  })

  test('should resolve simple references', () => {
    const definition = {
      input: { type: 'text', label: 'Name' },
    }
    const obj = { $ref: '#/definition/input' }
    const result = resolveRefs(obj, definition)
    expect(result).toEqual(definition.input)
  })

  test('should resolve nested references', () => {
    const definition = {
      a: { id: 'a', value: 'A' },
      b: { id: 'b', nested: { $ref: '#/definition/a' } },
    }
    const obj = { $ref: '#/definition/b' }
    const result = resolveRefs(obj, definition)
    expect(result).toEqual({
      id: 'b',
      nested: { id: 'a', value: 'A' },
    })
  })

  test('should handle circular object structures without stack overflow', () => {
    interface Circular {
      id: string
      self?: Circular
    }
    const a: Circular = { id: 'a' }
    a.self = a

    const result = resolveRefs(a, {}) as Circular
    expect(result.id).toBe('a')
    expect(result.self).toBe(a)
  })

  test('should handle circular $ref definitions gracefully', () => {
    const definition = {
      a: { $ref: '#/definition/b' },
      b: { $ref: '#/definition/a' },
    }
    const obj = { $ref: '#/definition/a' }

    const result = resolveRefs(obj, definition)
    // It should stop at the first cycle detection and return the object that caused the cycle
    expect(result).toEqual({ $ref: '#/definition/b' })
  })

  test('should resolve references in arrays', () => {
    const definition = {
      item: { id: 1 },
    }
    const obj = [{ $ref: '#/definition/item' }, { id: 2 }]
    const result = resolveRefs(obj, definition)
    expect(result).toEqual([{ id: 1 }, { id: 2 }])
  })
})
