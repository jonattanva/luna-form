import { expect, test } from '@playwright/test'
import { prepare } from '@/packages/luna-core/src/util/prepare'

test.describe('Prepare with $ref', { tag: ['@unit'] }, () => {
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

    const prepared = prepare(sections, definition)
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

    const prepared = prepare(sections, definition)
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

    const prepared = prepare(sections, definition)
    expect(prepared[0].fields[0].source).toEqual({
      $ref: '#/definition/missing',
    })
  })
})
