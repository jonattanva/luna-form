import { expect, test } from '@playwright/test'
import {
  extract,
  getType,
  getArray,
  getCurrentValue,
  getValue,
  getEntity,
  toOptions,
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
})
