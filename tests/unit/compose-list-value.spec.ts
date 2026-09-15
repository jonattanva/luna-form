import { describe, expect, test } from 'vitest'
import { positionalEntries } from '@/packages/luna-react/src/client/lib/compose-list-value'

// What a list tells a consumer about its positional names when its rows are
// rewritten. A consumer that keeps every report in one record holds each leaf
// under `items.<position>.<leaf>` as well as inside the list's array, so every
// name a removal or an assignment can have left out of date has to come back:
// with what its position holds now, or `undefined` where no row is left.
describe('positional entries', () => {
  const A = { value: 'A' }
  const B = { value: 'B' }
  const C = { value: 'C' }
  const X = { value: 'X' }
  const Y = { value: 'Y' }

  test('should move every row after a removed first row up one position', () => {
    expect(positionalEntries('items', 0, [A, B, C], [B, C])).toEqual([
      { name: 'items.0.value', value: 'B' },
      { name: 'items.1.value', value: 'C' },
      { name: 'items.2.value', value: undefined },
    ])
  })

  test('should leave the rows before a removed one alone', () => {
    expect(positionalEntries('items', 1, [A, B, C], [A, C])).toEqual([
      { name: 'items.1.value', value: 'C' },
      { name: 'items.2.value', value: undefined },
    ])
  })

  test('should empty every position a shrinking assignment leaves', () => {
    expect(positionalEntries('items', 0, [A, B, C], [X])).toEqual([
      { name: 'items.0.value', value: 'X' },
      { name: 'items.1.value', value: undefined },
      { name: 'items.2.value', value: undefined },
    ])
  })

  test('should reach the new positions of a growing assignment', () => {
    expect(positionalEntries('items', 0, [A], [X, Y])).toEqual([
      { name: 'items.0.value', value: 'X' },
      { name: 'items.1.value', value: 'Y' },
    ])
  })

  // What the consumer holds is not necessarily what the list last said, so a
  // position whose value did not change is reported all the same.
  test('should report a position that did not change', () => {
    expect(positionalEntries('items', 0, [A, B], [A, B])).toEqual([
      { name: 'items.0.value', value: 'A' },
      { name: 'items.1.value', value: 'B' },
    ])
  })

  test('should name the leaves of either row when only one has them', () => {
    expect(positionalEntries('items', 0, [{}, C], [C])).toEqual([
      { name: 'items.0.value', value: 'C' },
      { name: 'items.1.value', value: undefined },
    ])
  })

  test('should report a leaf worth undefined', () => {
    const empty = { value: undefined }
    expect(positionalEntries('items', 0, [empty], [empty])).toEqual([
      { name: 'items.0.value', value: undefined },
    ])
  })

  test('should spell a list inside a row out down to its own leaves', () => {
    const first = { label: 'G1', checks: [{ v: 'a' }, { v: 'b' }] }
    const second = { label: 'G2', checks: [{ v: 'c' }] }

    expect(positionalEntries('groups', 0, [first, second], [second])).toEqual([
      { name: 'groups.0.label', value: 'G2' },
      { name: 'groups.0.checks', value: [{ v: 'c' }] },
      { name: 'groups.0.checks.0.v', value: 'c' },
      { name: 'groups.0.checks.1.v', value: undefined },
      { name: 'groups.1.label', value: undefined },
      { name: 'groups.1.checks', value: undefined },
      { name: 'groups.1.checks.0.v', value: undefined },
    ])
  })

  // A chips field reports its selection as one array, so the array is the
  // value and nothing inside it is a name.
  test('should keep an array of values whole', () => {
    const before = { colors: ['red', 'blue'] }
    const after = { colors: ['red'] }

    expect(positionalEntries('items', 0, [before], [after])).toEqual([
      { name: 'items.0.colors', value: ['red'] },
    ])
  })

  test('should prefix every name with the positional name it is given', () => {
    expect(positionalEntries('groups.1.checks', 0, [{ v: 'a' }], [])).toEqual([
      { name: 'groups.1.checks.0.v', value: undefined },
    ])
  })

  test('should report nothing from a position past both lists', () => {
    expect(positionalEntries('items', 2, [A, B], [A])).toEqual([])
  })
})
