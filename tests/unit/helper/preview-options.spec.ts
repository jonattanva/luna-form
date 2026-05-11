import { describe, expect, test } from 'vitest'
import {
  getPreviewOptions,
  resolveOptionLabel,
} from '@/packages/luna-core/src/helper/input'
import type { Field } from '@/packages/luna-core/src/type'

describe('getPreviewOptions', () => {
  test('returns undefined for fields without options', () => {
    const field: Field = { name: 'title', type: 'input/text' }
    expect(getPreviewOptions(field)).toBeUndefined()
  })

  test('returns weekday options for chips/day', () => {
    const field: Field = { name: 'days', type: 'chips/day' }
    const options = getPreviewOptions(field)
    expect(options).toHaveLength(7)
    expect(options?.[0]).toMatchObject({ value: '0' })
    expect(options?.[0]).toHaveProperty('label')
  })

  test('returns month options for chips/month', () => {
    const field: Field = { name: 'months', type: 'chips/month' }
    const options = getPreviewOptions(field)
    expect(options).toHaveLength(12)
  })

  test('returns active options for select/active', () => {
    const field: Field = { name: 'active', type: 'select/active' }
    expect(getPreviewOptions(field)).toEqual([
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ])
  })

  test('returns literal array source for chips', () => {
    const field: Field = {
      name: 'priority',
      type: 'chips',
      source: [
        { value: 'low', label: 'Low' },
        { value: 'high', label: 'High' },
      ],
    }
    expect(getPreviewOptions(field)).toEqual([
      { value: 'low', label: 'Low' },
      { value: 'high', label: 'High' },
    ])
  })

  test('returns literal array source for select', () => {
    const field: Field = {
      name: 'status',
      type: 'select',
      source: [
        { value: 'info', label: 'Información' },
        { value: 'warn', label: 'Advertencia' },
      ],
    }
    expect(getPreviewOptions(field)).toEqual([
      { value: 'info', label: 'Información' },
      { value: 'warn', label: 'Advertencia' },
    ])
  })

  test('returns undefined for $ref DataSource', () => {
    const field: Field = {
      name: 'country',
      type: 'select',
      source: { $ref: '#/definitions/countries' },
    }
    expect(getPreviewOptions(field)).toBeUndefined()
  })

  test('filters out items without flat value/label (e.g. timezone groups)', () => {
    const field: Field = { name: 'tz', type: 'select/timezone' }
    expect(getPreviewOptions(field)).toBeUndefined()
  })

  test('applies advanced.options mapping over source objects', () => {
    const field: Field = {
      name: 'priority',
      type: 'select',
      source: [
        { id: 'low', name: 'Bajo' },
        { id: 'high', name: 'Alto' },
      ],
      advanced: {
        options: { value: 'id', label: 'name' },
      },
    }
    expect(getPreviewOptions(field)).toEqual([
      { value: 'low', label: 'Bajo' },
      { value: 'high', label: 'Alto' },
    ])
  })
})

describe('resolveOptionLabel', () => {
  const options = [
    { value: 'low', label: 'Bajo' },
    { value: 'high', label: 'Alto' },
  ]

  test('returns the label of a matching option', () => {
    expect(resolveOptionLabel('low', options)).toBe('Bajo')
    expect(resolveOptionLabel('high', options)).toBe('Alto')
  })

  test('returns String(value) when no option matches', () => {
    expect(resolveOptionLabel('unknown', options)).toBe('unknown')
    expect(resolveOptionLabel(42, options)).toBe('42')
  })

  test('treats string options as their own label', () => {
    expect(resolveOptionLabel('yes', ['yes', 'no'])).toBe('yes')
    expect(resolveOptionLabel('missing', ['yes', 'no'])).toBe('missing')
  })
})
