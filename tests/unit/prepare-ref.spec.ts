import { describe, expect, test } from 'vitest'
import { prepare } from '@/packages/luna-core/src/util/prepare'
import type { Filterable } from '@/packages/luna-core/src/type'

describe('Prepare with $ref', () => {
  test('should resolve $ref correctly', () => {
    const definition = {
      common_source: {
        url: 'https://api.example.com/data',
        namespace: 'items',
      },
    }

    const sections = [
      {
        fields: [
          {
            name: 'field1',
            type: 'select',
            source: { $ref: '#/definition/common_source' },
          },
        ],
        order: 1,
      },
    ]

    const prepared = prepare(sections as unknown as Filterable[], definition)
    expect(prepared[0].fields[0].source).toEqual(definition.common_source)
  })

  test('should resolve nested $ref', () => {
    const definition = {
      sources: {
        pokemon: {
          url: 'https://pokeapi.co/api/v2/pokemon',
          namespace: 'results',
        },
      },
    }

    const sections = [
      {
        fields: [
          {
            name: 'pokemon',
            type: 'select',
            source: { $ref: '#/definition/sources.pokemon' },
          },
        ],
        order: 1,
      },
    ]

    const prepared = prepare(sections as unknown as Filterable[], definition)
    expect(prepared[0].fields[0].source).toEqual(definition.sources.pokemon)
  })

  test('should keep original object if $ref is not found', () => {
    const definition = {}
    const sections = [
      {
        fields: [
          {
            name: 'field1',
            type: 'select',
            source: { $ref: '#/definition/missing' },
          },
        ],
        order: 1,
      },
    ]

    const prepared = prepare(sections as unknown as Filterable[], definition)
    expect(prepared[0].fields[0].source).toEqual({
      $ref: '#/definition/missing',
    })
  })

  // What identity buys: a field that comes back as the object it already was
  // matches its memo, keeps its schema, and leaves a list's hand-off alone.
  // Rebuilding the tree on every render is what took all three away.
  describe('identity', () => {
    const definition = { common: { url: 'https://api.example.com' } }

    const form = () => [
      {
        fields: [{ name: 'plain', type: 'input/text' }],
        order: 1,
      },
      {
        fields: [
          {
            name: 'remote',
            type: 'select',
            source: { $ref: '#/definition/common' },
          },
        ],
        order: 2,
      },
    ]

    test('should keep a section with no $ref under it as the same object', () => {
      const sections = form()

      const prepared = prepare(sections as unknown as Filterable[], definition)

      expect(prepared[0]).toBe(sections[0])
      expect(prepared[0].fields[0]).toBe(sections[0].fields[0])
    })

    test('should rebuild only the branch a $ref resolved into', () => {
      const sections = form()

      const prepared = prepare(sections as unknown as Filterable[], definition)

      expect(prepared[1]).not.toBe(sections[1])
      expect(prepared[1].fields[0].source).toEqual(definition.common)
    })

    test('should answer the same pair with the same array', () => {
      const sections = form() as unknown as Filterable[]

      const prepared = prepare(sections, definition)

      expect(prepare(sections, definition)).toBe(prepared)
    })

    test('should resolve again for another definition', () => {
      const sections = form() as unknown as Filterable[]
      const other = { common: { url: 'https://api.other.com' } }

      const prepared = prepare(sections, definition)

      expect(prepare(sections, other)).not.toBe(prepared)
      expect(prepare(sections, other)[1].fields[0].source).toEqual(other.common)
    })
  })
})
