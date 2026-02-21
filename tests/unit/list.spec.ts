import { expect, test } from '@playwright/test'
import { getInitialList } from '@/packages/luna-core/src/util/list'
import type { List } from '@/packages/luna-core/src/type'

test.describe('List', { tag: ['@unit'] }, () => {
  test.describe('getInitialList', () => {
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
})
