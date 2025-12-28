import { expect, test } from '@playwright/test'
import {
  buildOptions,
  buildSource,
  buildFormData,
} from '@/packages/luna-core/src/util/build'

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
})
