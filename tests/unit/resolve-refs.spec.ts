import { describe, expect, test } from 'vitest'
import { resolveRefs } from '../../packages/luna-core/src/util/prepare'

describe('Resolve refs', () => {
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

// `#/context/` reads what the host passed as the form's `context`, beside the
// definition the form reuses, with the same syntax and the same walk.
describe('Resolve refs into context', () => {
  test('should resolve a reference into context', () => {
    const obj = { min: { $ref: '#/context/dates.today' } }
    const result = resolveRefs(obj, undefined, {
      dates: { today: '2026-10-02' },
    })
    expect(result).toEqual({ min: '2026-10-02' })
  })

  test('should read each root from its own object', () => {
    const obj = [{ $ref: '#/definition/item' }, { $ref: '#/context/item' }]
    const result = resolveRefs(
      obj,
      { item: 'from definition' },
      { item: 'from context' }
    )
    expect(result).toEqual(['from definition', 'from context'])
  })

  test('should let a definition entry point into context', () => {
    const definition = { checkIn: { min: { $ref: '#/context/today' } } }
    const obj = { $ref: '#/definition/checkIn' }
    const result = resolveRefs(obj, definition, { today: '2026-10-02' })
    expect(result).toEqual({ min: '2026-10-02' })
  })

  test('should leave a reference into context standing without a context', () => {
    const obj = { $ref: '#/context/today' }
    expect(resolveRefs(obj, { today: 'definition' })).toEqual(obj)
    expect(resolveRefs(obj, undefined, {})).toEqual(obj)
  })

  test('should keep reading a path with no root from the definition', () => {
    const obj = { $ref: 'input' }
    const result = resolveRefs(obj, { input: { id: 1 } }, { input: { id: 2 } })
    expect(result).toEqual({ id: 1 })
  })
})
