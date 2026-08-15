import { describe, expect, test } from 'vitest'
import {
  flattenListFields,
  getAssignedCount,
  getInitialList,
  getListBounds,
  getListLeaves,
  normalizeListRows,
} from '@/packages/luna-core/src/util/list'
import type { Column, Field, List } from '@/packages/luna-core/src/type'

describe('List', () => {
  test('should return [0] as default when no count is specified', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
    }

    expect(getInitialList(list)).toEqual([0])
  })

  test('should return [] when min is explicitly 0', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
      advanced: {
        length: {
          min: 0,
        },
      },
    }

    expect(getInitialList(list)).toEqual([])
  })

  test('should return an array of indices based on min', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
      advanced: {
        length: {
          min: 3,
        },
      },
    }

    expect(getInitialList(list)).toEqual([0, 1, 2])
  })

  test('should return an array of indices based on value length', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
    }
    const value = {
      items: [{}, {}, {}],
    }

    expect(getInitialList(list, value)).toEqual([0, 1, 2])
  })

  test('should return max of min and array length indices', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
      advanced: {
        length: {
          min: 5,
        },
      },
    }
    const value = {
      items: [{}, {}, {}],
    }

    expect(getInitialList(list, value)).toEqual([0, 1, 2, 3, 4])
  })

  test('should return array length when it exceeds min', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
      advanced: {
        length: {
          min: 2,
        },
      },
    }
    const value = {
      items: [{}, {}, {}, {}],
    }

    expect(getInitialList(list, value)).toEqual([0, 1, 2, 3])
  })
})

describe('flattenListFields', () => {
  test('returns an empty record for an empty array', () => {
    expect(flattenListFields([])).toEqual({})
  })

  test('keys top-level Field entries by name', () => {
    const a: Field = { name: 'a', type: 'input/text' }
    const b: Field = { name: 'b', type: 'checkbox' }
    expect(flattenListFields([a, b])).toEqual({ a, b })
  })

  test('flattens children of Column entries', () => {
    const inner: Field = { name: 'inner', type: 'input/text' }
    const column: Column = { type: 'column', fields: [inner] }
    const sibling: Field = { name: 'sibling', type: 'checkbox' }
    expect(flattenListFields([column, sibling])).toEqual({
      inner,
      sibling,
    })
  })
})

describe('getListLeaves', () => {
  test('returns the fields of a row in the order they are declared', () => {
    const key: Field = { name: 'key', type: 'input/text' }
    const amount: Field = { name: 'amount', type: 'input/text' }

    expect(getListLeaves([key, amount])).toEqual([key, amount])
  })

  test('walks through a column rather than returning it', () => {
    const first: Field = { name: 'first', type: 'input/text' }
    const second: Field = { name: 'second', type: 'input/text' }
    const third: Field = { name: 'third', type: 'input/text' }
    const column: Column = { type: 'column', fields: [first, second] }

    expect(getListLeaves([column, third])).toEqual([first, second, third])
  })

  test('returns a nested list, which is one of the row leaves', () => {
    const name: Field = { name: 'name', type: 'input/text' }
    const checks: List = { name: 'checks', type: 'list', fields: [] }

    expect(getListLeaves([name, checks])).toEqual([name, checks])
  })

  test('returns a nested list declared inside a column', () => {
    const checks: List = { name: 'checks', type: 'list', fields: [] }
    const column: Column = { type: 'column', fields: [checks] }

    expect(getListLeaves([column])).toEqual([checks])
  })
})

describe('getListBounds', () => {
  test('defaults to one row and no ceiling', () => {
    const list: List = { name: 'rows', type: 'list', fields: [] }

    expect(getListBounds(list)).toEqual({ min: 1, max: Infinity })
  })

  test('takes what the list declares', () => {
    const list: List = {
      name: 'rows',
      type: 'list',
      fields: [],
      advanced: { length: { min: 0, max: 3 } },
    }

    expect(getListBounds(list)).toEqual({ min: 0, max: 3 })
  })
})

describe('getAssignedCount', () => {
  const list = (min?: number, max?: number): List => ({
    name: 'rows',
    type: 'list',
    fields: [],
    advanced: { length: { min, max } },
  })

  test('takes the length it is given when it is within bounds', () => {
    expect(getAssignedCount(list(0, 5), 3)).toBe(3)
  })

  test('pads up to the minimum', () => {
    expect(getAssignedCount(list(2), 1)).toBe(2)
  })

  test('defaults the minimum to one, as a list on screen does', () => {
    expect(getAssignedCount(list(), 0)).toBe(1)
  })

  test('stops at the maximum', () => {
    expect(getAssignedCount(list(0, 2), 5)).toBe(2)
  })
})

describe('normalizeListRows', () => {
  const FLAT: List = {
    name: 'rows',
    type: 'list',
    fields: [
      { name: 'key', type: 'input/text' },
      { name: 'amount', type: 'input/text' },
    ],
    advanced: { length: { min: 0 } },
  }

  const NESTED: List = {
    name: 'groups',
    type: 'list',
    fields: [
      { name: 'name', type: 'input/text' },
      { ...FLAT, name: 'checks' },
    ],
    advanced: { length: { min: 0 } },
  }

  test('spells in every leaf, including the ones the row left out', () => {
    expect(normalizeListRows(FLAT, [{ key: 'alpha' }])).toEqual([
      { key: 'alpha', amount: undefined },
    ])
  })

  test('drops what the row carries under no leaf of its own', () => {
    expect(normalizeListRows(FLAT, [{ key: 'alpha', stray: 'x' }])).toEqual([
      { key: 'alpha', amount: undefined },
    ])
  })

  test('clamps the count the way the list would', () => {
    expect(
      normalizeListRows({ ...FLAT, advanced: undefined }, [])
    ).toHaveLength(1)

    expect(
      normalizeListRows({ ...FLAT, advanced: { length: { min: 0, max: 1 } } }, [
        { key: 'alpha' },
        { key: 'beta' },
      ])
    ).toEqual([{ key: 'alpha', amount: undefined }])
  })

  test('normalizes a leaf that is a list against its own fields', () => {
    expect(
      normalizeListRows(NESTED, [
        { name: 'first', checks: [{ key: 'alpha', amount: '1' }] },
      ])
    ).toEqual([
      {
        name: 'first',
        checks: [{ key: 'alpha', amount: '1' }],
      },
    ])
  })

  test('reads a nested leaf that is not rows as no rows at all', () => {
    expect(normalizeListRows(NESTED, [{ name: 'first' }])).toEqual([
      { name: 'first', checks: [] },
    ])

    expect(
      normalizeListRows(NESTED, [{ name: 'first', checks: 'nonsense' }])
    ).toEqual([{ name: 'first', checks: [] }])
  })

  test('goes as deep as the lists do', () => {
    const deep: List = {
      name: 'outer',
      type: 'list',
      fields: [{ ...NESTED, name: 'middle' }],
      advanced: { length: { min: 0 } },
    }

    expect(
      normalizeListRows(deep, [
        { middle: [{ name: 'first', checks: [{ key: 'alpha' }] }] },
      ])
    ).toEqual([
      {
        middle: [
          {
            name: 'first',
            checks: [{ key: 'alpha', amount: undefined }],
          },
        ],
      },
    ])
  })
})
