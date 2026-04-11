import { atom, createStore } from 'jotai'
import { describe, expect, test } from 'vitest'
import {
  createAtomStore,
  createNestedClearAtom,
  createNestedRecordAtomFamily,
} from '@/packages/luna-react/src/client/lib/store-helper'

describe('store-helper', () => {
  describe('createClearAtom — falsy values not deleted', () => {
    test('clears a boolean false value', () => {
      const store = createStore()
      const { atom: base, report, clear } = createAtomStore<boolean>()

      store.set(report('active'), false)
      expect(store.get(base)).toEqual({ active: false })

      store.set(clear, ['active'])
      // Bug: `if (next[name])` skips deletion when value is false
      // Fix: use `name in next`
      expect(store.get(base)).toEqual({})
    })

    test('clears a numeric 0 value', () => {
      const store = createStore()
      const { atom: base, report, clear } = createAtomStore<number>()

      store.set(report('count'), 0)
      expect(store.get(base)).toEqual({ count: 0 })

      store.set(clear, ['count'])
      // Bug: `if (next[name])` skips deletion when value is 0
      expect(store.get(base)).toEqual({})
    })

    test('clears an empty string value', () => {
      const store = createStore()
      const { atom: base, report, clear } = createAtomStore<string>()

      store.set(report('label'), '')
      expect(store.get(base)).toEqual({ label: '' })

      store.set(clear, ['label'])
      // Bug: `if (next[name])` skips deletion when value is ''
      expect(store.get(base)).toEqual({})
    })

    test('only clears requested keys, leaving others intact', () => {
      const store = createStore()
      const { atom: base, report, clear } = createAtomStore<boolean>()

      store.set(report('a'), false)
      store.set(report('b'), true)

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

  describe('createRecordAtomFamily setter — spurious update when current value is falsy', () => {
    test('does not update when setting false over an existing false', () => {
      const store = createStore()
      const { atom: base, report } = createAtomStore<boolean>()

      store.set(report('flag'), false)

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(report('flag'), false)
      // Bug: `!currentValue` is true when currentValue === false,
      // so deepEqual is bypassed and set() fires unconditionally
      expect(updates).toBe(0)
    })

    test('does not update when setting 0 over an existing 0', () => {
      const store = createStore()
      const { atom: base, report } = createAtomStore<number>()

      store.set(report('score'), 0)

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(report('score'), 0)
      // Bug: `!currentValue` is true when currentValue === 0
      expect(updates).toBe(0)
    })

    test('does update when the new value differs from a falsy current value', () => {
      const store = createStore()
      const { atom: base, report } = createAtomStore<number>()

      store.set(report('score'), 0)

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(report('score'), 1)
      expect(updates).toBe(1)
      expect(store.get(base)).toEqual({ score: 1 })
    })

    test('does not update when a truthy value is set to itself via deepEqual', () => {
      const store = createStore()
      const { atom: base, report } = createAtomStore<Record<string, string>>()

      store.set(report('user'), { name: 'alice' })

      let updates = 0
      store.sub(base, () => {
        updates++
      })

      store.set(report('user'), { name: 'alice' })
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
        }),
        null
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
        }),
        null
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
        }),
        null
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

  describe('createNestedRecordAtomFamily — read and write consistency', () => {
    test('stores contribution and returns merged value for the target', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, string>>>({})
      const family = createNestedRecordAtomFamily<string>(base, {
        merge: (values) => values.join(','),
      })

      // Contributor "fieldA" contributes to target "fieldB"
      store.set(family('fieldA'), 'fieldB', 'hello')
      expect(store.get(base)).toEqual({ fieldB: { fieldA: 'hello' } })

      // Reading via target "fieldB" returns the merged value
      expect(store.get(family('fieldB'))).toBe('hello')
    })

    test('removes target key entirely when value is set to undefined', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, string>>>({})
      const family = createNestedRecordAtomFamily<string>(base, {
        merge: (values) => values.join(','),
      })

      store.set(family('fieldA'), 'fieldB', 'hello')
      store.set(family('fieldA'), 'fieldB', undefined)

      expect(store.get(base)).toEqual({})
    })

    test('skips write when validateTarget returns false', () => {
      const store = createStore()
      const base = atom<Record<string, Record<string, string>>>({})
      const family = createNestedRecordAtomFamily<string>(base, {
        merge: (values) => values.join(','),
        validateTarget: (t) => t.trim() !== '',
      })

      store.set(family('fieldA'), '  ', 'hello')
      expect(store.get(base)).toEqual({})
    })
  })
})
