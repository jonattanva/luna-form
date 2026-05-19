import { describe, expect, test } from 'vitest'
import { evaluateCondition } from '@/packages/luna-core/src/util/condition'

describe('evaluateCondition - string when', () => {
  test('returns true when scalar selected equals when', () => {
    expect(evaluateCondition('list', 'list')).toBe(true)
  })

  test('returns false when scalar selected does not equal when', () => {
    expect(evaluateCondition('text', 'list')).toBe(false)
  })

  test('returns true for single-element array selected matching when', () => {
    expect(evaluateCondition(['list'], 'list')).toBe(true)
  })

  test('returns false for multi-element array selected (even if when is included)', () => {
    expect(evaluateCondition(['list', 'text'], 'list')).toBe(false)
  })

  test('returns false for empty array', () => {
    expect(evaluateCondition([], 'list')).toBe(false)
  })

  test('reads VALUE from object selected wrapping a single-element array', () => {
    expect(evaluateCondition({ value: ['list'] }, 'list')).toBe(true)
  })
})

describe('evaluateCondition - boolean when', () => {
  test('non-empty array is truthy', () => {
    expect(evaluateCondition(['x'], true)).toBe(true)
    expect(evaluateCondition(['x'], false)).toBe(false)
  })

  test('empty array is falsy', () => {
    expect(evaluateCondition([], true)).toBe(false)
    expect(evaluateCondition([], false)).toBe(true)
  })

  test('scalar values still evaluate via Boolean()', () => {
    expect(evaluateCondition('hello', true)).toBe(true)
    expect(evaluateCondition('', true)).toBe(false)
  })
})

describe('evaluateCondition - string[] when', () => {
  test('returns true for scalar selected included in when list', () => {
    expect(evaluateCondition('a', ['a', 'b'])).toBe(true)
  })

  test('returns true when any element of array selected is in when list', () => {
    expect(evaluateCondition(['b', 'c'], ['a', 'b'])).toBe(true)
  })

  test('returns false when no element of array selected matches', () => {
    expect(evaluateCondition(['x', 'y'], ['a', 'b'])).toBe(false)
  })

  test('returns false for empty array selected', () => {
    expect(evaluateCondition([], ['a', 'b'])).toBe(false)
  })
})

describe('evaluateCondition - undefined when', () => {
  test('always returns true', () => {
    expect(evaluateCondition('anything', undefined)).toBe(true)
    expect(evaluateCondition(null, undefined)).toBe(true)
    expect(evaluateCondition([], undefined)).toBe(true)
  })
})
