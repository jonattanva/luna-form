import { describe, expect, test } from 'vitest'
import { translateOptions } from '@/packages/luna-core/src/util/translate'

describe('Translate Options', () => {
  test('should translate the label of each option', () => {
    const options = [
      { label: 'fruit_apple', value: 'apple' },
      { label: 'fruit_banana', value: 'banana' },
    ]

    expect(
      translateOptions(options, {
        fruit_apple: 'Manzana',
        fruit_banana: 'Plátano',
      })
    ).toEqual([
      { label: 'Manzana', value: 'apple' },
      { label: 'Plátano', value: 'banana' },
    ])
  })

  test('should translate the description of an option', () => {
    const options = [
      { label: 'plan_pro', value: 'pro', description: 'plan_pro_help' },
    ]

    expect(
      translateOptions(options, {
        plan_pro: 'Profesional',
        plan_pro_help: 'Incluye soporte prioritario',
      })
    ).toEqual([
      {
        label: 'Profesional',
        value: 'pro',
        description: 'Incluye soporte prioritario',
      },
    ])
  })

  test('should keep the key when it is missing from the dictionary', () => {
    const options = [{ label: 'fruit_apple', value: 'apple' }]

    expect(translateOptions(options, { other_key: 'Otro' })).toEqual([
      { label: 'fruit_apple', value: 'apple' },
    ])
  })

  test('should never translate the value', () => {
    const options = [{ label: 'fruit_apple', value: 'apple' }]

    const result = translateOptions(options, {
      fruit_apple: 'Manzana',
      apple: 'Manzana',
    })

    expect(result[0].value).toBe('apple')
  })

  test('should return the same reference when there is no dictionary', () => {
    const options = [{ label: 'fruit_apple', value: 'apple' }]
    expect(translateOptions(options)).toBe(options)
  })

  test('should return the same reference when nothing resolves', () => {
    const options = [{ label: 'fruit_apple', value: 'apple' }]
    expect(translateOptions(options, { unrelated: 'Nada' })).toBe(options)
  })

  test('should leave plain string items untouched', () => {
    const options = ['apple', 'banana']
    const result = translateOptions(options, { apple: 'Manzana' })

    expect(result).toBe(options)
    expect(result).toEqual(['apple', 'banana'])
  })

  test('should leave options without a label untouched', () => {
    const options = [{ value: 'apple' }]
    expect(translateOptions(options, { apple: 'Manzana' })).toBe(options)
  })

  test('should translate the heading and the items of an option group', () => {
    const options = [
      {
        label: 'group_fruits',
        items: [{ label: 'fruit_apple', value: 'apple' }],
      },
    ]

    expect(
      translateOptions(options, {
        group_fruits: 'Frutas',
        fruit_apple: 'Manzana',
      })
    ).toEqual([
      {
        label: 'Frutas',
        items: [{ label: 'Manzana', value: 'apple' }],
      },
    ])
  })

  test('should return an empty array unchanged', () => {
    const options: Array<{ label: string; value: string }> = []
    expect(translateOptions(options, { fruit_apple: 'Manzana' })).toBe(options)
  })
})
