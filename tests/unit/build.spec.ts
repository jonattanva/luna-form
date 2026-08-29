import { describe, expect, test } from 'vitest'
import {
  buildOptions,
  buildSource,
  buildOrientation,
  buildDisabled,
  isArraySource,
} from '@/packages/luna-core/src/util/build'
import type { Field } from '@/packages/luna-core/src/type'

describe('Build', () => {
  test('should build source for radio fields', () => {
    const field = {
      source: [
        {
          label: 'Male',
          value: 'male',
        },
      ],
      type: 'radio',
      name: 'gender',
    }

    const result = buildSource(field)
    expect(result).toEqual([{ label: 'Male', value: 'male' }])
  })

  test('should build source for select fields', () => {
    const field = {
      source: [
        {
          label: 'USA',
          value: 'us',
        },
      ],
      type: 'select',
      name: 'country',
      disabled: false,
    }

    const result = buildSource(field)
    expect(result).toEqual([{ label: 'USA', value: 'us' }])
  })

  test('should return undefined for non-radio/select fields', () => {
    const field = {
      type: 'text',
      name: 'username',
    }

    const result = buildSource(field)
    expect(result).toBeUndefined()
  })

  test('should return undefined for select fields without source', () => {
    const field = {
      type: 'select',
      name: 'country',
      disabled: false,
    }

    const result = buildSource(field)
    expect(result).toBeUndefined()
  })

  test('should build options for disabled select fields', () => {
    const field = {
      type: 'select',
      name: 'country',
      disabled: true,
    }

    const values = {
      country: { label: 'USA', value: 'us' },
    }

    const options = buildOptions(field, values)
    expect(options).toEqual([{ label: 'USA', value: 'us' }])
  })

  test('should return empty for non-disabled select fields', () => {
    const field = {
      type: 'select',
      name: 'country',
      disabled: false,
    }

    const values = {
      country: { label: 'USA', value: 'us' },
    }

    const options = buildOptions(field, values)
    expect(options).toBeUndefined()
  })

  test('should return empty for non-select fields', () => {
    const field = {
      type: 'text',
      name: 'username',
    }

    const values = {
      username: 'john_doe',
    }

    const options = buildOptions(field, values)
    expect(options).toBeUndefined()
  })

  describe('buildOrientation', () => {
    test('should return true for radio fields', () => {
      const field = { type: 'radio', name: 'test' } as Field
      expect(buildOrientation(field)).toBe(true)
    })

    test('should return true for checkbox fields', () => {
      const field = { type: 'checkbox', name: 'test' } as Field
      expect(buildOrientation(field)).toBe(true)
    })

    test('should say nothing for other fields by default', () => {
      // Not `false`: an answer here overrules `config.style.horizontal`, and a
      // field that declares nothing has no opinion to overrule it with.
      const field = { type: 'text', name: 'test' } as Field
      expect(buildOrientation(field)).toBeUndefined()
    })

    test('should return false when the field opts out explicitly', () => {
      const field = {
        type: 'text',
        name: 'test',
        advanced: { horizontal: false },
      } as Field
      expect(buildOrientation(field)).toBe(false)
    })

    test('should return custom orientation from advanced config', () => {
      const field = {
        type: 'text',
        name: 'test',
        advanced: { horizontal: true },
      } as Field
      expect(buildOrientation(field)).toBe(true)
    })
  })

  describe('buildDisabled', () => {
    test('should return true if disabled param is true', () => {
      const field = { type: 'text', name: 'test' } as Field
      expect(buildDisabled(field, true)).toBe(true)
    })

    test('should return false if disabled param is false and field is not readonly', () => {
      const field = { type: 'text', name: 'test' } as Field
      expect(buildDisabled(field, false)).toBe(false)
    })

    test('should return true if field is readonly', () => {
      const field = { type: 'text', name: 'test', readonly: true } as Field
      expect(buildDisabled(field, false)).toBe(true)
    })

    test('should return false if field is not readonly and no disabled param', () => {
      const field = { type: 'text', name: 'test' } as Field
      expect(buildDisabled(field)).toBe(false)
    })
  })

  describe('isArraySource', () => {
    const source = [{ label: 'Apple', value: 'apple' }]

    test('should return true for select, radio and chips with an array source', () => {
      for (const type of ['select', 'radio', 'chips']) {
        expect(isArraySource({ type, name: 'test', source } as Field)).toBe(
          true
        )
      }
    })

    test('should return false for a remote data source', () => {
      const field = {
        type: 'select',
        name: 'test',
        source: { url: '/api/options' },
      } as Field

      expect(isArraySource(field)).toBe(false)
    })

    test('should return false for an unresolved reference', () => {
      const field = {
        type: 'select',
        name: 'test',
        source: { $ref: '#/source/options' },
      } as unknown as Field

      expect(isArraySource(field)).toBe(false)
    })

    test('should return false for a disabled select', () => {
      const field = {
        type: 'select',
        name: 'test',
        disabled: true,
        source,
      } as Field

      expect(isArraySource(field)).toBe(false)
    })

    test('should return false for specialized selectors without a source', () => {
      for (const type of ['select/month', 'select/active', 'chips/day']) {
        expect(isArraySource({ type, name: 'test' } as Field)).toBe(false)
      }
    })

    test('should return false for fields that cannot carry options', () => {
      const field = { type: 'input/text', name: 'test', source } as Field
      expect(isArraySource(field)).toBe(false)
    })
  })
})
