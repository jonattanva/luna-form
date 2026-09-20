import { atom, createStore, type PrimitiveAtom } from 'jotai'
import { describe, expect, test } from 'vitest'
import {
  createAtomStore,
  createContributionAtom,
  createEntryAtom,
  createNestedClearAtom,
  omitKey,
} from '@/packages/luna-react/src/client/lib/store-helper'

describe('store-helper', () => {
  describe('createClearAtom — falsy values not deleted', () => {
    test('clears a boolean false value', () => {
      const store = createStore()
      const { atom: base, clear } = createAtomStore<boolean>()

      store.set(createEntryAtom(base, 'active'), false)
      expect(store.get(base)).toEqual({ active: false })

      store.set(clear, ['active'])
      // Bug: `if (next[name])` skips deletion when value is false
      // Fix: use `name in next`
      expect(store.get(base)).toEqual({})
    })

    test('clears a numeric 0 value', () => {
      const store = createStore()
      const { atom: base, clear } = createAtomStore<number>()

      store.set(createEntryAtom(base, 'count'), 0)
      expect(store.get(base)).toEqual({ count: 0 })

      store.set(clear, ['count'])
      // Bug: `if (next[name])` skips deletion when value is 0
      expect(store.get(base)).toEqual({})
    })

    test('clears an empty string value', () => {
      const store = createStore()
      const { atom: base, clear } = createAtomStore<string>()

      store.set(createEntryAtom(base, 'label'), '')
      expect(store.get(base)).toEqual({ label: '' })

      store.set(clear, ['label'])
      // Bug: `if (next[name])` skips deletion when value is ''
      expect(store.get(base)).toEqual({})
    })

    test('only clears requested keys, leaving others intact', () => {
      const store = createStore()
      const { atom: base, clear } = createAtomStore<boolean>()

      store.set(createEntryAtom(base, 'a'), false)
      store.set(createEntryAtom(base, 'b'), true)

      store.set(clear, ['a'])
      expect(store.get(base)).toEqual({ b: true })
    })

    test('does not trigger a state update when no key matches', () => {
      const store = createStore()
      const { atom: base, clear } = createAtomStore<string>({ existing: 'x' })

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(clear, ['nonexistent'])
      expect(updates).toBe(0)
    })
  })

  describe('createEntryAtom setter — spurious update when current value is falsy', () => {
    test('does not update when setting false over an existing false', () => {
      const store = createStore()
      const { atom: base } = createAtomStore<boolean>()

      store.set(createEntryAtom(base, 'flag'), false)

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(createEntryAtom(base, 'flag'), false)
      // Bug: `!currentValue` is true when currentValue === false,
      // so deepEqual is bypassed and set() fires unconditionally
      expect(updates).toBe(0)
    })

    test('does not update when setting 0 over an existing 0', () => {
      const store = createStore()
      const { atom: base } = createAtomStore<number>()

      store.set(createEntryAtom(base, 'score'), 0)

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(createEntryAtom(base, 'score'), 0)
      // Bug: `!currentValue` is true when currentValue === 0
      expect(updates).toBe(0)
    })

    test('does update when the new value differs from a falsy current value', () => {
      const store = createStore()
      const { atom: base } = createAtomStore<number>()

      store.set(createEntryAtom(base, 'score'), 0)

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(createEntryAtom(base, 'score'), 1)
      expect(updates).toBe(1)
      expect(store.get(base)).toEqual({ score: 1 })
    })

    test('does not update when a truthy value is set to itself via deepEqual', () => {
      const store = createStore()
      const { atom: base } = createAtomStore<Record<string, string>>()

      store.set(createEntryAtom(base, 'user'), { name: 'alice' })

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(createEntryAtom(base, 'user'), { name: 'alice' })
      expect(updates).toBe(0)
    })
  })

  describe('createNestedClearAtom — falsy values not deleted', () => {
    test('clears a nested contributor key whose value is false', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, boolean>>>({})
      const clear = createNestedClearAtom(base)

      // Seed directly to bypass the setter's own falsy guard
      store.set(
        atom(null, (_get, set) => {
          set(base, { field1: { validatorA: false, validatorB: true } })
        })
      )

      store.set(clear, ['validatorA'])
      // Bug: `if (targetContributions[contributorName])` skips deletion when false
      expect(store.get(base)).toEqual({ field1: { validatorB: true } })
    })

    test('removes the target entirely when its only contributor is cleared', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, boolean>>>({})
      const clear = createNestedClearAtom(base)

      store.set(
        atom(null, (_get, set) => {
          set(base, { field1: { validatorA: false } })
        })
      )

      store.set(clear, ['validatorA'])
      // After the last contributor is removed, the target key must go too
      expect(store.get(base)).toEqual({})
    })

    test('clears a contributor that appears as both outer key and inner key', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, boolean>>>({})
      const clear = createNestedClearAtom(base)

      store.set(
        atom(null, (_get, set) => {
          // validatorA appears as an outer key (was also a target) AND as inner contributor
          set(base, {
            validatorA: { someOther: true },
            field1: { validatorA: false },
          })
        })
      )

      store.set(clear, ['validatorA'])
      expect(store.get(base)).toEqual({})
    })

    test('does not trigger a state update when no contributors match', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, boolean>>>({
        field1: { validatorA: true },
      })
      const clear = createNestedClearAtom(base)

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(clear, ['nonexistent'])
      expect(updates).toBe(0)
    })
  })

  describe('createContributionAtom — read and write consistency', () => {
    const anyTarget = (target: string) => target.trim() !== ''

    const contribution = (
      base: PrimitiveAtom<Record<string, Record<string, string>>>,
      name: string,
      merge: (values: string[]) => string | undefined
    ) =>
      createContributionAtom<string>(base, name, {
        merge,
        validateTarget: anyTarget,
      })

    test('stores contribution and returns merged value for the target', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, string>>>({})
      const merge = (values: string[]) => values.join(',')

      // Contributor "fieldA" contributes to target "fieldB"
      store.set(contribution(base, 'fieldA', merge), 'fieldB', 'hello')
      expect(store.get(base)).toEqual({ fieldB: { fieldA: 'hello' } })

      // Reading via target "fieldB" returns the merged value
      expect(store.get(contribution(base, 'fieldB', merge))).toBe('hello')
    })

    test('removes target key entirely when value is set to undefined', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, string>>>({})
      const merge = (values: string[]) => values.join(',')

      store.set(contribution(base, 'fieldA', merge), 'fieldB', 'hello')
      store.set(contribution(base, 'fieldA', merge), 'fieldB', undefined)

      expect(store.get(base)).toEqual({})
    })

    test('skips write when validateTarget returns false', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, string>>>({})
      const merge = (values: string[]) => values.join(',')

      store.set(contribution(base, 'fieldA', merge), '  ', 'hello')
      expect(store.get(base)).toEqual({})
    })

    test('merges multiple contributors for the same target', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, string>>>({})
      const merge = (values: string[]) => values.sort().join(',')

      store.set(contribution(base, 'fieldA', merge), 'target', 'alpha')
      store.set(contribution(base, 'fieldB', merge), 'target', 'beta')

      expect(store.get(base)).toEqual({
        target: { fieldA: 'alpha', fieldB: 'beta' },
      })
      expect(store.get(contribution(base, 'target', merge))).toBe('alpha,beta')
    })

    test('does not trigger a state update when writing the same value (deepEqual guard)', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, string>>>({})
      const merge = (values: string[]) => values.join(',')

      store.set(contribution(base, 'fieldA', merge), 'target', 'hello')

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(contribution(base, 'fieldA', merge), 'target', 'hello')
      expect(updates).toBe(0)
    })
  })

  // Two readers of one name are two atoms now, and they have to agree: the
  // atom holds nothing of its own, the record holds everything.
  describe('createEntryAtom — two views of one record', () => {
    test('answers the same for two atoms made for the same name', () => {
      const store = createStore()
      const { atom: base } = createAtomStore<string>()

      store.set(createEntryAtom(base, 'email'), 'ada@example.com')

      expect(store.get(createEntryAtom(base, 'email'))).toBe('ada@example.com')
    })

    test('a write through one is seen through the other', () => {
      const store = createStore()
      const { atom: base } = createAtomStore<string>()
      const one = createEntryAtom(base, 'email')
      const other = createEntryAtom(base, 'email')

      store.set(one, 'ada@example.com')
      store.set(other, undefined)

      expect(store.get(one)).toBeUndefined()
      expect(store.get(base)).toEqual({})
    })
  })

  describe('omitKey', () => {
    test('removes the specified key from the object', () => {
      const result = omitKey({ a: 1, b: 2, c: 3 }, 'b')
      expect(result).toEqual({ a: 1, c: 3 })
    })

    test('returns a new object without mutating the original', () => {
      const original = { a: 1, b: 2 }
      const result = omitKey(original, 'a')
      expect(result).toEqual({ b: 2 })
      expect(original).toEqual({ a: 1, b: 2 })
    })

    test('returns the same shape when the key does not exist', () => {
      const result = omitKey({ a: 1 }, 'z')
      expect(result).toEqual({ a: 1 })
    })
  })

  describe('createAtomStore — clearAll', () => {
    test('removes all keys from the store', () => {
      const store = createStore()
      const { atom: base, clearAll } = createAtomStore<string>()

      store.set(createEntryAtom(base, 'a'), 'x')
      store.set(createEntryAtom(base, 'b'), 'y')
      expect(store.get(base)).toEqual({ a: 'x', b: 'y' })

      store.set(clearAll)
      expect(store.get(base)).toEqual({})
    })

    test('does not trigger a state update when store is already empty', () => {
      const store = createStore()
      const { atom: base, clearAll } = createAtomStore<string>()

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(clearAll)
      expect(updates).toBe(0)
    })
  })

  describe('createAtomStore — bulkReport', () => {
    test('replaces the entire store with the provided value', () => {
      const store = createStore()
      const { atom: base, bulkReport } = createAtomStore<number>()

      store.set(createEntryAtom(base, 'a'), 1)
      store.set(createEntryAtom(base, 'b'), 2)

      store.set(bulkReport, { c: 3, d: 4 })
      expect(store.get(base)).toEqual({ c: 3, d: 4 })
    })

    test('does not trigger a state update when the new value is deepEqual to the current', () => {
      const store = createStore()
      const { atom: base, bulkReport } = createAtomStore<number>({ a: 1, b: 2 })

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(bulkReport, { a: 1, b: 2 })
      expect(updates).toBe(0)
    })

    test('triggers a state update when the new value differs', () => {
      const store = createStore()
      const { atom: base, bulkReport } = createAtomStore<number>({ a: 1 })

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(bulkReport, { a: 2 })
      expect(updates).toBe(1)
      expect(store.get(base)).toEqual({ a: 2 })
    })
  })
})
