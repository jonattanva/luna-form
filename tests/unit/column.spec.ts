import { expect, test } from '@playwright/test'
import { getColumn, getSpan } from '@/packages/luna-core/src/util/column'

test.describe('Column', { tag: ['@unit'] }, () => {
  test('should return the correct column class', () => {
    expect(getColumn()).toBe('md:grid-cols-2')
    expect(getColumn(1)).toBe('md:grid-cols-1')
    expect(getColumn(2)).toBe('md:grid-cols-2')
    expect(getColumn(3)).toBe('md:grid-cols-3')
    expect(getColumn(4)).toBe('md:grid-cols-2')
  })

  test('should return the correct span class', () => {
    expect(getSpan(1)).toBe('md:col-span-1')
    expect(getSpan(2)).toBe('md:col-span-2')
    expect(getSpan(3)).toBe('md:col-span-3')
  })

  test('should return undefined for invalid span values', () => {
    expect(getSpan(0)).toBeUndefined()
    expect(getSpan(4)).toBeUndefined()
    expect(getSpan()).toBeUndefined()
  })
})
