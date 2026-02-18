import { expect, test } from '@playwright/test'
import {
  getInitialCount,
  getInitialList,
} from '@/packages/luna-core/src/util/list'
import type { List } from '@/packages/luna-core/src/type'

test.describe('List', { tag: ['@unit'] }, () => {
  test('should return 1 when no min and no value', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
    }

    expect(getInitialCount(list)).toBe(1)
  })

  test('should return 0 when min is explicitly 0', () => {
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

    expect(getInitialCount(list)).toBe(0)
  })

  test('should return min when no value', () => {
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

    expect(getInitialCount(list)).toBe(3)
  })

  test('should return array length when value is provided', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
    }
    const value = {
      items: [{}, {}, {}],
    }

    expect(getInitialCount(list, value)).toBe(3)
  })

  test('should return max of min and array length', () => {
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

    expect(getInitialCount(list, value)).toBe(5)
  })

  test('should return array length if it exceeds min', () => {
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

    expect(getInitialCount(list, value)).toBe(4)
  })

  test('should return 1 if value is not an array and no min', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
    }

    const value = {
      items: 'not an array',
    }

    expect(getInitialCount(list, value)).toBe(1)
  })

  test('should return min if value is not an array', () => {
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
      items: 'not an array',
    }

    expect(getInitialCount(list, value)).toBe(2)
  })

  test('should return 0 if min is negative', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
      advanced: {
        length: {
          min: -1,
        },
      },
    }

    expect(getInitialCount(list)).toBe(0)
  })

  test('should return 1 when value is null', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [],
    }

    expect(getInitialCount(list, null)).toBe(1)
  })

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
