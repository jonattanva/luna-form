import { expect, test } from '@playwright/test'
import { entries, prepare } from '@/packages/luna-core/src/util/prepare'
import type { Filterable, Section } from '@/packages/luna-core/src/type'

test.describe('Prepare Utility', { tag: ['@unit'] }, () => {
  test('should sort by order', () => {
    const input = [
      { id: '1', order: 2 },
      { id: '2', order: 1 },
      { id: '3' },
      { id: '4', order: 0 },
    ]

    const result = prepare(input)
    expect(result).toEqual([
      { id: '4', order: 0 },
      { id: '2', order: 1 },
      { id: '1', order: 2 },
      { id: '3' },
    ])
  })

  test('should return an empty array when given no input', () => {
    const result = prepare()
    expect(result).toEqual([])
  })

  test('should return entries for a valid record', () => {
    const input = { a: 1, b: 2 }
    const result = entries(input)
    expect(result).toEqual([
      ['a', 1],
      ['b', 2],
    ])
  })

  test('should return an empty array for null or undefined', () => {
    expect(entries(null)).toEqual([])
    expect(entries(undefined)).toEqual([])
  })

  test('should return an empty array for an empty record', () => {
    expect(entries({})).toEqual([])
  })

  test.describe('filter', () => {
    test('should NOT hide a section just because one field is hidden', () => {
      const sections = [
        {
          id: 'section-1',
          fields: [
            { name: 'visible-field', hidden: false },
            { name: 'hidden-field', hidden: true },
          ],
        },
      ]

      const prepared = prepare(sections)
      expect(prepared.length).toBe(1)
      expect(prepared[0].id).toBe('section-1')
    })

    test('should hide section if all fields are hidden', () => {
      const sections = [
        {
          id: 'section-1',
          fields: [
            { name: 'f1', hidden: true },
            { name: 'f2', hidden: true },
          ],
        },
      ]

      const prepared = prepare(sections satisfies Filterable[])
      expect(prepared.length).toBe(0)
    })

    test('should hide section if all columns are hidden because their fields are hidden', () => {
      const sections = [
        {
          id: 'section-1',
          fields: [
            {
              type: 'column',
              fields: [{ name: 'f1', hidden: true }],
            },
          ],
        },
      ]

      const prepared = prepare(sections satisfies Filterable[])
      expect(prepared.length).toBe(0)
    })

    test('should hide section if fields is an empty array', () => {
      const sections = [
        {
          id: 'section-1',
          fields: [],
        },
      ]

      const prepared = prepare(sections satisfies Filterable[])
      expect(prepared.length).toBe(0)
    })

    test('should keep section if fields are not defined', () => {
      const sections = [
        {
          id: 'section-1',
          title: 'Title Only',
        },
      ] as Section[]

      const prepared = prepare(sections)
      expect(prepared.length).toBe(1)
    })
  })
})
