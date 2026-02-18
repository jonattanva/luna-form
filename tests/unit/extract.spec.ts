import { expect, test } from '@playwright/test'
import {
  extract,
  getArray,
  getCurrentValue,
  getEntity,
  getFormData,
  getType,
  getValue,
  toOptions,
  unflatten,
} from '@/packages/luna-core/src/util/extract'

test.describe('Extract', { tag: ['@unit'] }, () => {
  test('should extract values correctly', () => {
    const data = {
      user: {
        name: 'John Doe',
        address: {
          city: 'New York',
          zip: '10001',
        },
      },
      items: [1, 2, 3],
    }

    expect(extract(data, 'user.name')).toBe('John Doe')
    expect(extract(data, 'user.address.city')).toBe('New York')
    expect(extract(data, 'user.address.zip')).toBe('10001')
    expect(extract(data, 'items')).toEqual([1, 2, 3])
  })

  test('should return null for non-existing paths', () => {
    const data = {
      user: {
        name: 'John Doe',
      },
    }

    expect(extract(data, 'user.age')).toBeNull()
    expect(extract(data, 'user.address.city')).toBeNull()
    expect(extract(data, 'items')).toBeNull()
  })

  test('should extract array correctly', () => {
    const data = {
      user: {
        name: 'John Doe',
        address: {
          city: 'New York',
          zip: '10001',
        },
      },
      items: [1, 2, 3],
    }

    expect(getArray(data, 'items')).toEqual([1, 2, 3])
    expect(getArray(data, 'user.name')).toBeNull()
  })

  test('should return null when namespace is not provided', () => {
    const data = {
      user: {
        name: 'John Doe',
      },
    }

    expect(extract(data)).toBeNull()
    expect(getArray(data)).toBeNull()
  })

  test('should get value correctly', () => {
    const data = {
      user: {
        name: 'John Doe',
        age: 30,
      },
      items: [1, 2, 3],
    }

    expect(getValue(data, 'user.name')).toBe('John Doe')
    expect(getValue(data, 'user.age')).toBe(30)
    expect(getValue(data, 'user.address')).toBeUndefined()
    expect(getValue(data, 'items')).toBeUndefined()
  })

  test('should get default value correctly', () => {
    const data = {
      label: 'John Doe',
      value: 2,
    }

    expect(getCurrentValue(data, 'label')).toBe('John Doe')
    expect(getCurrentValue(data)).toBe(2)
    expect(getCurrentValue('John Doe')).toBe('John Doe')
  })

  test('should get the correct type of input', () => {
    expect(getType('select/month')).toBe('month')
    expect(getType('select/year')).toBe('year')
    expect(getType('select/options')).toBe('options')
    expect(getType('text')).toBe('text')
    expect(getType()).toBe('text')
  })

  test('should get entity correctly', () => {
    const collection = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ]

    expect(getEntity('1', collection)).toEqual({
      label: 'Option 1',
      value: '1',
    })
    expect(getEntity('3', collection)).toEqual({ value: '3' })
    expect(getEntity('2', collection, 'value')).toEqual({
      label: 'Option 2',
      value: '2',
    })
  })

  test('should get entity when value is a number and selected is a string', () => {
    const collection = [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]

    expect(getEntity('1', collection)).toEqual({ label: 'Option 1', value: 1 })
  })

  test('should return default object when collection is empty', () => {
    expect(getEntity('1', [])).toEqual({ value: '1' })
  })

  test('should convert data to options correctly', () => {
    const data = [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]

    expect(toOptions(data)).toEqual([
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ])
  })

  test('should convert data to options with custom keys', () => {
    const data = [
      { name: 'John', id: 101 },
      { name: 'Jane', id: 102 },
    ]

    expect(toOptions(data, { label: 'name', value: 'id' })).toEqual([
      { label: 'John', value: '101' },
      { label: 'Jane', value: '102' },
    ])
  })

  test('should handle nested paths in toOptions', () => {
    const data = [
      { info: { name: 'John' }, meta: { id: 1 } },
      { info: { name: 'Jane' }, meta: { id: 2 } },
    ]

    expect(toOptions(data, { label: 'info.name', value: 'meta.id' })).toEqual([
      { label: 'John', value: '1' },
      { label: 'Jane', value: '2' },
    ])
  })

  test('should return original item if label or value is missing', () => {
    const data = [
      { label: 'Only Label' },
      { value: 'Only Value' },
      'Not an object',
    ]

    expect(toOptions(data)).toEqual([
      { label: 'Only Label' },
      { value: 'Only Value' },
      'Not an object',
    ])
  })

  test('should return an empty object for empty FormData', async () => {
    const formData = new FormData()
    const result = getFormData(formData)
    expect(result).toEqual({})
  })

  test('should return single values for single keys', async () => {
    const formData = new FormData()
    formData.append('name', 'John')
    formData.append('age', '30')

    const result = getFormData(formData)
    expect(result).toEqual({
      name: 'John',
      age: '30',
    })
  })

  test('should return an array for keys with multiple values', async () => {
    const formData = new FormData()
    formData.append('tags', 'typescript')
    formData.append('tags', 'react')
    formData.append('tags', 'playwright')

    const result = getFormData(formData)
    expect(result).toEqual({
      tags: ['typescript', 'react', 'playwright'],
    })
  })

  test('should handle mixed single and multiple values', async () => {
    const formData = new FormData()
    formData.append('id', '123')
    formData.append('roles', 'admin')
    formData.append('roles', 'editor')

    const result = getFormData(formData)
    expect(result).toEqual({
      id: '123',
      roles: ['admin', 'editor'],
    })
  })

  test('should handle File objects', async () => {
    const formData = new FormData()
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    formData.append('file', file)

    const result = getFormData(formData)
    expect(result).toEqual({
      file: file,
    })
  })

  test('should pass through keys without dots', () => {
    const data = { username: 'john', age: '30' }
    expect(unflatten(data)).toEqual({ username: 'john', age: '30' })
  })

  test('should unflatten single-field array items', () => {
    const data = {
      'emails.0.email': 'a@b.com',
      'emails.1.email': 'c@d.com',
      username: 'john',
    }

    expect(unflatten(data)).toEqual({
      emails: [{ email: 'a@b.com' }, { email: 'c@d.com' }],
      username: 'john',
    })
  })

  test('should unflatten multi-field array items', () => {
    const data = {
      'addresses.0.street': '123 Main',
      'addresses.0.city': 'NYC',
      'addresses.1.street': '456 Oak',
      'addresses.1.city': 'LA',
    }

    expect(unflatten(data)).toEqual({
      addresses: [
        { street: '123 Main', city: 'NYC' },
        { street: '456 Oak', city: 'LA' },
      ],
    })
  })

  test('should handle empty data', () => {
    expect(unflatten({})).toEqual({})
  })

  test('should handle mixed flat and nested keys', () => {
    const data = {
      name: 'John',
      'phones.0.number': '555-1234',
      'phones.0.type': 'mobile',
      email: 'john@example.com',
    }

    expect(unflatten(data)).toEqual({
      name: 'John',
      phones: [{ number: '555-1234', type: 'mobile' }],
      email: 'john@example.com',
    })
  })

  test('should handle single item array', () => {
    const data = {
      'items.0.value': 'test',
    }

    expect(unflatten(data)).toEqual({
      items: [{ value: 'test' }],
    })
  })

  test('should handle deep nesting', () => {
    const data = {
      'a.b.c.d': 'value',
    }

    expect(unflatten(data)).toEqual({
      a: { b: { c: { d: 'value' } } },
    })
  })

  test('should handle objects with numeric keys that are not arrays', () => {
    const data = {
      'user.123.id': 'abc',
    }

    // Since it matches REGEX_NUMERIC, it will be treated as an array index
    // Note: The current implementation initializes an array if the next part is numeric
    const result = unflatten(data)
    expect(Array.isArray(result.user)).toBe(true)
    // @ts-expect-error - testing dynamic structure
    expect(result.user[123]).toEqual({ id: 'abc' })
  })
})
