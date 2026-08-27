import { describe, expect, test } from 'vitest'
import {
  isObject,
  isValue,
  isEmpty,
  isMultiple,
  isString,
  isDataSource,
} from '@/packages/luna-core/src/util/is-type'

describe('Is Type Utility', () => {
  test('should identify objects correctly', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ key: 'value' })).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(123)).toBe(false)
  })

  test('should identify values correctly', () => {
    expect(isValue('string')).toBe(true)
    expect(isValue(123)).toBe(true)
    expect(isValue(true)).toBe(true)
    expect(isValue(false)).toBe(true)
    expect(isValue(null)).toBe(false)
    expect(isValue(undefined)).toBe(false)
    expect(isValue({})).toBe(false)
    expect(isValue([])).toBe(false)
  })

  test('should identify multi-value selections correctly', () => {
    expect(isMultiple(['a', 'b'])).toBe(true)
    expect(isMultiple(['a'])).toBe(true)
    expect(isMultiple([])).toBe(true)
    expect(isMultiple([1, 2])).toBe(true)
    expect(isMultiple('a')).toBe(false)
    expect(isMultiple(null)).toBe(false)
    expect(isMultiple(undefined)).toBe(false)
    expect(isMultiple({})).toBe(false)
    expect(isMultiple([{ value: 'a' }])).toBe(false)
  })

  test('should identify empty values correctly', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('text')).toBe(false)
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(false)).toBe(false)
    expect(isEmpty({})).toBe(false)
    expect(isEmpty([])).toBe(false)
  })

  test('should identify strings correctly', () => {
    expect(isString('hello')).toBe(true)
    expect(isString('')).toBe(true)
    expect(isString('123')).toBe(true)
    expect(isString(123)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString({})).toBe(false)
    expect(isString([])).toBe(false)
    expect(isString(true)).toBe(false)
  })

  test('should identify DataSource correctly', () => {
    expect(isDataSource({ url: '/api/data' })).toBe(true)
    expect(isDataSource({ url: '/api/data', method: 'POST' })).toBe(true)
    expect(isDataSource({ url: '' })).toBe(true)
    expect(isDataSource({})).toBe(false)
    expect(isDataSource({ path: '/api' })).toBe(false)
    expect(isDataSource(null)).toBe(false)
    expect(isDataSource(undefined)).toBe(false)
    expect(isDataSource('string')).toBe(false)
    expect(isDataSource(123)).toBe(false)
    expect(isDataSource([])).toBe(false)
  })
})
