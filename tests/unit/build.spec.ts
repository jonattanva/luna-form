import { expect, test } from '@playwright/test'
import {
  buildOptions,
  buildSource,
  buildFormData,
  buildOrientation,
  buildDisabled,
} from '@/packages/luna-core/src/util/build'
import { HORIZONTAL, VERTICAL } from '@/packages/luna-core/src/util/constant'
import type { Field } from '@/packages/luna-core/src/type'

test.describe('Build', { tag: ['@unit'] }, () => {
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

  test('should build FormData from form object', () => {
    const form = {
      username: 'john_doe',
      age: 30,
      email: null,
    }

    const formData = buildFormData(form)
    expect(formData.get('username')).toBe('john_doe')
    expect(formData.get('age')).toBe('30')
    expect(formData.get('email')).toBeNull()
  })

  test.describe('buildOrientation', () => {
    test('should return HORIZONTAL for radio fields', () => {
      const field = { type: 'radio', name: 'test' } as Field
      expect(buildOrientation(field)).toBe(HORIZONTAL)
    })

    test('should return HORIZONTAL for checkbox fields', () => {
      const field = { type: 'checkbox', name: 'test' } as Field
      expect(buildOrientation(field)).toBe(HORIZONTAL)
    })

    test('should return VERTICAL for other fields by default', () => {
      const field = { type: 'text', name: 'test' } as Field
      expect(buildOrientation(field)).toBe(VERTICAL)
    })

    test('should return custom orientation from advanced config', () => {
      const field = {
        type: 'text',
        name: 'test',
        advanced: { orientation: HORIZONTAL },
      } as Field
      expect(buildOrientation(field)).toBe(HORIZONTAL)
    })
  })

  test.describe('buildDisabled', () => {
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
})
