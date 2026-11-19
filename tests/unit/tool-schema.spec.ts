import { describe, expect, test } from 'vitest'
import {
  buildToolSchema,
  type ToolSchema,
  type ToolSchemaOptions,
} from '@/packages/luna-core/src/util/tool-schema'
import type { Fields, Sections } from '@/packages/luna-core/src/type'

function build(fields: Fields, options?: ToolSchemaOptions) {
  return buildToolSchema([{ fields }], options)
}

function propertyOf(fields: Fields, name: string, options?: ToolSchemaOptions) {
  return build(fields, options).schema.properties?.[name]
}

function namesOf(fields: Fields) {
  return Object.keys(build(fields).schema.properties ?? {})
}

// Every keyword a consumer of the schema may find, the portable subset.
const PORTABLE = new Set([
  'additionalProperties',
  'description',
  'enum',
  'format',
  'items',
  'maxItems',
  'maxLength',
  'maximum',
  'minItems',
  'minLength',
  'minimum',
  'pattern',
  'properties',
  'required',
  'title',
  'type',
])

function keywordsOf(schema: ToolSchema): string[] {
  const own = Object.keys(schema)
  const nested = [
    ...Object.values(schema.properties ?? {}),
    ...(schema.items ? [schema.items] : []),
  ].flatMap(keywordsOf)
  return [...own, ...nested]
}

const COUNTRIES = [
  { label: 'Colombia', value: 'co' },
  { label: 'México', value: 'mx' },
]

// A `state` event on the field that fires it, showing or unlocking `target`.
function reveal(target: string, state: { disabled?: false; hidden?: false }) {
  return { change: [{ action: 'state' as const, state, target }] }
}

describe('buildToolSchema', () => {
  describe('text', () => {
    test('should describe a text field as a string with its label as title', () => {
      expect(
        propertyOf(
          [{ label: 'Name', name: 'name', type: 'input/text' }],
          'name'
        )
      ).toEqual({ title: 'Name', type: 'string' })
    })

    test('should bound a text by its length', () => {
      expect(
        propertyOf(
          [
            {
              advanced: { length: { max: 5, min: 2 } },
              name: 'code',
              type: 'input/text',
            },
          ],
          'code'
        )
      ).toEqual({ maxLength: 5, minLength: 2, type: 'string' })
    })

    test('should carry a pattern without flags', () => {
      expect(
        propertyOf(
          [
            {
              name: 'code',
              type: 'input/text',
              validation: { pattern: { regex: '^[A-Z]{3}$' } },
            },
          ],
          'code'
        )
      ).toEqual({ pattern: '^[A-Z]{3}$', type: 'string' })
    })

    test('should only mention a pattern that needs a flag', () => {
      const code = propertyOf(
        [
          {
            name: 'code',
            type: 'input/text',
            validation: { pattern: { flags: 'i', regex: '^[a-z]{3}$' } },
          },
        ],
        'code'
      )
      expect(code?.pattern).toBeUndefined()
      expect(code?.description).toContain('pattern')
    })

    // JSON Schema reads a pattern in Unicode mode, where an escape such as
    // `\#` is no longer allowed: carried as it is, it would break the tool.
    test('should only mention a pattern that only compiles outside Unicode mode', () => {
      expect(
        propertyOf(
          [
            {
              name: 'color',
              type: 'input/text',
              validation: { pattern: { regex: '^\\#[0-9a-f]{6}$' } },
            },
          ],
          'color'
        )?.pattern
      ).toBeUndefined()
    })

    test('should describe a textarea as a string', () => {
      expect(
        propertyOf([{ name: 'note', type: 'textarea' }], 'note')?.type
      ).toBe('string')
    })

    test('should describe an email with its format', () => {
      expect(
        propertyOf([{ name: 'email', type: 'input/email' }], 'email')
      ).toEqual({ format: 'email', type: 'string' })
    })

    test('should leave a password out', () => {
      expect(namesOf([{ name: 'secret', type: 'input/password' }])).toEqual([])
    })
  })

  describe('numbers, dates and times', () => {
    test('should describe a number without a step as an integer', () => {
      expect(
        propertyOf([{ name: 'qty', type: 'input/number' }], 'qty')
      ).toEqual({
        type: 'integer',
      })
    })

    test('should bound a number and describe its step', () => {
      const amount = propertyOf(
        [
          {
            advanced: { length: { max: 10, min: 1 }, step: 2 },
            name: 'amount',
            type: 'input/number',
          },
        ],
        'amount'
      )
      expect(amount).toMatchObject({ maximum: 10, minimum: 1, type: 'integer' })
      expect(amount?.description).toBe('In steps of 2 from 1.')
    })

    test('should describe a number with a fractional step as a number', () => {
      expect(
        propertyOf(
          [{ advanced: { step: 0.5 }, name: 'rate', type: 'input/number' }],
          'rate'
        )?.type
      ).toBe('number')
    })

    test('should describe a day as an ISO date with its limits', () => {
      const day = propertyOf(
        [
          {
            advanced: {
              length: { max: '2026-12-31', min: '2026-01-01' },
              reserved: ['2026-12-25'],
            },
            name: 'day',
            type: 'input/date',
          },
        ],
        'day'
      )
      expect(day).toMatchObject({ format: 'date', type: 'string' })
      expect(day?.description).toBe(
        'Days from 2026-01-01 until 2026-12-31. Not these days: 2026-12-25. A day as yyyy-MM-dd.'
      )
    })

    test('should describe a range as two days that span no reserved day', () => {
      const stay = propertyOf(
        [
          {
            advanced: { mode: 'range', reserved: ['2026-12-25'] },
            name: 'stay',
            type: 'input/date',
          },
        ],
        'stay'
      )
      expect(stay).toMatchObject({
        items: { format: 'date', type: 'string' },
        maxItems: 2,
        minItems: 2,
        type: 'array',
      })
      expect(stay?.description).toContain(
        'No day from the first to the last may be one of these: 2026-12-25.'
      )
    })

    test('should describe a time as the 24-hour time a time input takes', () => {
      expect(
        propertyOf([{ name: 'at', type: 'input/time' }], 'at')
      ).toMatchObject({ pattern: '^\\d{2}:\\d{2}$', type: 'string' })
      expect(
        propertyOf(
          [
            {
              advanced: { format: 'hh:mm:ss a' },
              name: 'at',
              type: 'input/time',
            },
          ],
          'at'
        )
      ).toMatchObject({ pattern: '^\\d{2}:\\d{2}:\\d{2}$', type: 'string' })
    })
  })

  describe('choices', () => {
    test('should describe a checkbox, a switch and a Yes/No as booleans', () => {
      const { properties } = build([
        { name: 'agree', type: 'checkbox' },
        { name: 'notify', type: 'checkbox/switch' },
        { name: 'active', type: 'select/active' },
      ]).schema
      expect(properties?.agree?.type).toBe('boolean')
      expect(properties?.notify?.type).toBe('boolean')
      expect(properties?.active?.type).toBe('boolean')
    })

    test('should list a few options by value, with their labels in the description', () => {
      for (const type of ['select', 'radio']) {
        expect(
          propertyOf([{ name: 'country', source: COUNTRIES, type }], 'country')
        ).toEqual({
          description: 'Options: co (Colombia), mx (México).',
          enum: ['co', 'mx'],
          type: 'string',
        })
      }
    })

    test('should read options through advanced.options', () => {
      expect(
        propertyOf(
          [
            {
              advanced: { options: { label: 'name', value: 'id' } },
              name: 'country',
              source: [{ id: 'co', name: 'Colombia' }],
              type: 'select',
            },
          ],
          'country'
        )?.enum
      ).toEqual(['co'])
    })

    test('should list an option once, and none when there are none', () => {
      const { properties } = build([
        {
          name: 'twice',
          source: [...COUNTRIES, { label: 'Colombia', value: 'co' }],
          type: 'select',
        },
        { name: 'empty', source: [], type: 'select' },
      ]).schema
      expect(properties?.twice?.enum).toEqual(['co', 'mx'])
      expect(properties?.empty).toEqual({
        description: 'It offers no options.',
        type: 'string',
      })
    })

    test('should look up options that are too many to list', () => {
      const source = Array.from({ length: 26 }, (_, index) => ({
        label: `Option ${index}`,
        value: `${index}`,
      }))
      const result = build([{ name: 'many', source, type: 'select' }])

      expect(result.schema.properties?.many?.type).toBe('string')
      expect(result.schema.properties?.many?.enum).toBeUndefined()
      expect(result.lookup).toEqual(['many'])
    })

    test('should look up options that are fetched or that an event installs', () => {
      const result = build([
        {
          name: 'city',
          source: { url: 'https://example.com/cities' },
          type: 'select',
        },
        {
          event: {
            change: [
              {
                action: 'source',
                source: { url: 'https://example.com/zones' },
                target: 'zone',
              },
            ],
          },
          name: 'region',
          source: COUNTRIES,
          type: 'select',
        },
        { name: 'zone', source: COUNTRIES, type: 'select' },
      ])
      expect(result.lookup).toEqual(['city', 'zone'])
    })

    test('should describe chips as an array of their options', () => {
      expect(
        propertyOf(
          [
            {
              advanced: { multiple: false },
              name: 'tags',
              required: true,
              source: COUNTRIES,
              type: 'chips',
            },
          ],
          'tags'
        )
      ).toMatchObject({
        items: { enum: ['co', 'mx'], type: 'string' },
        maxItems: 1,
        minItems: 1,
        type: 'array',
      })
    })

    test('should describe the days and months a field offers', () => {
      const { properties } = build(
        [
          { name: 'day', type: 'select/day' },
          { name: 'days', type: 'chips/day' },
          { name: 'month', type: 'select/month' },
          { name: 'months', type: 'chips/month' },
        ],
        { localization: { lang: 'en' } }
      ).schema

      expect(properties?.day?.enum).toEqual(['0', '1', '2', '3', '4', '5', '6'])
      expect(properties?.day?.description).toContain('0 (Sunday)')
      expect(properties?.days?.items?.enum).toHaveLength(7)
      expect(properties?.month).toMatchObject({
        maximum: 12,
        minimum: 1,
        type: 'integer',
      })
      expect(properties?.month?.description).toContain('1 (January)')
      expect(properties?.months?.items?.enum).toHaveLength(12)
    })

    test('should bound a year by the years it offers', () => {
      expect(
        propertyOf(
          [
            {
              advanced: { length: { max: 2030, min: 2020 } },
              name: 'year',
              type: 'select/year',
            },
          ],
          'year'
        )
      ).toEqual({ maximum: 2030, minimum: 2020, type: 'integer' })
    })

    test('should say when a year select offers no year', () => {
      expect(
        propertyOf(
          [
            {
              advanced: { length: { min: 2020 } },
              name: 'year',
              type: 'select/year',
            },
          ],
          'year'
        )?.description
      ).toContain('It offers no year')
    })

    test('should look up a time zone', () => {
      const result = build([{ name: 'zone', type: 'select/timezone' }])
      expect(result.schema.properties?.zone?.type).toBe('string')
      expect(result.lookup).toEqual(['zone'])
    })
  })

  describe('structure', () => {
    test('should name the fixed lists, a nested one through the first row of its list', () => {
      const result = build([
        {
          advanced: { fixed: true },
          fields: [{ name: 'sku', type: 'input/text' }],
          name: 'items',
          type: 'list',
        },
        {
          fields: [
            {
              advanced: { fixed: true },
              fields: [{ name: 'check', type: 'input/text' }],
              name: 'checks',
              type: 'list',
            },
          ],
          name: 'groups',
          type: 'list',
        },
      ])

      expect(result.fixed).toEqual(['items', 'groups.0.checks'])
    })

    test('should merge a column into the level that holds it', () => {
      expect(
        namesOf([
          {
            fields: [
              { name: 'first', type: 'input/text' },
              { name: 'last', type: 'input/text' },
            ],
            type: 'column',
          },
        ])
      ).toEqual(['first', 'last'])
    })

    test('should describe a built-in type by the schema the host declares for it', () => {
      expect(
        propertyOf([{ name: 'when', type: 'input/date' }], 'when', {
          types: { 'input/date': { pattern: '^Q[1-4]$', type: 'string' } },
        })
      ).toEqual({ pattern: '^Q[1-4]$', type: 'string' })
    })

    test('should describe a list as rows, with its length and its required leaves', () => {
      const result = build([
        {
          advanced: { length: { max: 3, min: 1 } },
          fields: [
            { name: 'sku', required: true, type: 'input/text' },
            { name: 'qty', type: 'input/number' },
          ],
          label: 'Items',
          name: 'items',
          type: 'list',
        },
      ])

      expect(result.schema.properties?.items).toEqual({
        description:
          'Sending the list replaces its rows. To write one field of one row, send its route instead, the row counted from 0: items.<row>.<field>.',
        items: {
          additionalProperties: false,
          properties: { qty: { type: 'integer' }, sku: { type: 'string' } },
          required: ['sku'],
          type: 'object',
        },
        maxItems: 3,
        minItems: 1,
        title: 'Items',
        type: 'array',
      })
      expect(result.required).toEqual(['items'])
    })

    // The rendered list holds one row when it declares no length, and the
    // submit checks that row's required leaves.
    test('should ask for the row a list holds when it declares no length', () => {
      const result = build([
        {
          fields: [{ name: 'sku', required: true, type: 'input/text' }],
          name: 'items',
          type: 'list',
        },
        {
          fields: [{ name: 'note', type: 'input/text' }],
          name: 'notes',
          type: 'list',
        },
      ])

      expect(result.schema.properties?.items?.minItems).toBe(1)
      expect(result.schema.properties?.items?.maxItems).toBeUndefined()
      expect(result.required).toEqual(['items'])
    })

    test('should describe a list inside a row', () => {
      expect(
        propertyOf(
          [
            {
              fields: [
                {
                  fields: [{ name: 'check', type: 'input/text' }],
                  name: 'checks',
                  type: 'list',
                },
              ],
              name: 'groups',
              type: 'list',
            },
          ],
          'groups'
        )?.items?.properties?.checks?.type
      ).toBe('array')
    })

    test('should follow the order the form shows', () => {
      expect(
        namesOf([
          { name: 'second', order: 2, type: 'input/text' },
          { name: 'first', order: 1, type: 'input/text' },
        ])
      ).toEqual(['first', 'second'])
    })

    test('should resolve references the way the form does', () => {
      const sections: Sections = JSON.parse(`[
        {
          "fields": [
            {
              "name": "country",
              "source": { "$ref": "#/definition/countries" },
              "type": "select"
            }
          ]
        }
      ]`)
      expect(
        buildToolSchema(sections, { definition: { countries: COUNTRIES } })
          .schema.properties?.country?.enum
      ).toEqual(['co', 'mx'])
    })

    test('should leave the top level open to a fill that names some fields', () => {
      const result = build([
        { name: 'name', required: true, type: 'input/text' },
        { name: 'nickname', type: 'input/text' },
      ])
      expect(result.schema.required).toBeUndefined()
      expect(result.schema.additionalProperties).toBe(false)
      expect(result.required).toEqual(['name'])
    })
  })

  describe('what an agent may write', () => {
    test('should leave out what the agent may not write or that holds nothing', () => {
      expect(
        namesOf([
          { advanced: { agent: false }, name: 'document', type: 'input/text' },
          { advanced: { transient: true }, name: 'add', type: 'select' },
          { disabled: true, name: 'code', type: 'input/text' },
          { name: 'id', readonly: true, type: 'input/text' },
          { hidden: true, name: 'never', type: 'input/text' },
          {
            advanced: { agent: false },
            fields: [{ name: 'leaf', type: 'input/text' }],
            name: 'rows',
            type: 'list',
          },
          { name: 'kept', type: 'input/text' },
        ])
      ).toEqual(['kept'])
    })

    test('should keep a hidden field that an event shows, and say so', () => {
      const result = build([
        {
          event: reveal('frequency', { hidden: false }),
          name: 'newsletter',
          type: 'checkbox',
        },
        {
          hidden: true,
          name: 'frequency',
          required: true,
          source: [{ label: 'Weekly', value: 'weekly' }],
          type: 'select',
        },
      ])

      expect(result.schema.properties?.frequency?.description).toBe(
        'Options: weekly (Weekly). Hidden until a change to newsletter makes it available: send it in the same call. Required once it is available.'
      )
      expect(result.required).toEqual([])
    })

    // The credit card in docs/events/change.md: hidden and locked until the
    // payment method asks for it.
    test('should keep a field that an event shows and unlocks', () => {
      const result = build([
        {
          event: reveal('cardNumber', { disabled: false, hidden: false }),
          name: 'paymentMethod',
          source: [{ label: 'Card', value: 'card' }],
          type: 'select',
        },
        {
          disabled: true,
          hidden: true,
          name: 'cardNumber',
          required: true,
          type: 'input/text',
        },
      ])

      expect(result.schema.properties?.cardNumber?.description).toBe(
        'Hidden and locked until a change to paymentMethod makes it available: send it in the same call. Required once it is available.'
      )
      expect(result.required).toEqual([])
    })

    test('should keep a hidden leaf of a row that a change in the row shows', () => {
      expect(
        propertyOf(
          [
            {
              fields: [
                {
                  event: reveal('items/note', { hidden: false }),
                  name: 'flag',
                  type: 'checkbox',
                },
                { hidden: true, name: 'note', type: 'input/text' },
              ],
              name: 'items',
              type: 'list',
            },
          ],
          'items'
        )?.items?.properties?.note
      ).toBeDefined()
    })

    // From outside the row, the form resolves `items/discount` to the
    // top-level `discount`: the row's leaf is never shown.
    test('should leave out a leaf of a row that only a change outside the row targets', () => {
      expect(
        propertyOf(
          [
            {
              event: reveal('items/discount', { hidden: false }),
              name: 'plan',
              type: 'checkbox',
            },
            {
              fields: [{ hidden: true, name: 'discount', type: 'input/text' }],
              name: 'items',
              type: 'list',
            },
          ],
          'items'
        )?.items?.properties
      ).toEqual({})
    })

    // An agent cannot fire a change on a field it may not write, and naming
    // that field would tell the agent it exists.
    test('should leave out a field that only a field the agent may not write shows', () => {
      const schema = build([
        {
          advanced: { agent: false },
          event: reveal('detail', { hidden: false }),
          name: 'secret',
          type: 'checkbox',
        },
        { hidden: true, name: 'detail', type: 'input/text' },
      ]).schema
      expect(Object.keys(schema.properties ?? {})).toEqual([])
      expect(JSON.stringify(schema)).not.toContain('secret')
    })

    test('should not require a hidden list before it shows', () => {
      const result = build([
        {
          event: reveal('extras', { hidden: false }),
          name: 'hasExtras',
          type: 'checkbox',
        },
        {
          advanced: { length: { min: 1 } },
          fields: [{ name: 'item', required: true, type: 'input/text' }],
          hidden: true,
          name: 'extras',
          type: 'list',
        },
      ])
      expect(result.schema.properties?.extras).toBeDefined()
      expect(result.required).toEqual([])
    })

    test('should describe when a field is required', () => {
      expect(
        propertyOf(
          [
            {
              name: 'vat',
              type: 'input/text',
              validation: {
                requiredWhen: {
                  field: 'kind',
                  operator: 'eq',
                  value: 'company',
                },
              },
            },
          ],
          'vat'
        )?.description
      ).toBe('Required when kind eq "company".')
    })

    test('should say a rule in a row reads its own row', () => {
      const result = build([
        {
          fields: [
            { name: 'mode', type: 'input/text' },
            {
              name: 'value',
              type: 'input/text',
              validation: {
                requiredWhen: {
                  field: 'mode',
                  operator: 'eq',
                  value: 'strict',
                },
              },
            },
          ],
          name: 'items',
          type: 'list',
        },
      ])
      expect(
        result.schema.properties?.items?.items?.properties?.value?.description
      ).toContain('Required when this row\'s mode eq "strict".')
    })

    test('should hold no rule only a submit checks when it checks none', () => {
      const fields: Fields = [
        {
          name: 'vat',
          type: 'input/text',
          validation: {
            pattern: { flags: 'i', regex: '^[a-z]{3}$' },
            requiredWhen: { field: 'kind', operator: 'eq', value: 'company' },
            rules: [{ assert: 'minItems', message: 'Too few.', value: 2 }],
          },
        },
        {
          name: 'sku',
          type: 'input/text',
          validation: { pattern: { regex: '^[A-Z]{3}$' } },
        },
        { name: 'code', required: true, type: 'checkbox' },
        {
          name: 'confirm',
          type: 'input/text',
          validation: { custom: { field: 'vat', operator: 'eq' } },
        },
      ]

      const checked = build(fields).schema.properties
      expect(checked?.vat?.description).toBe(
        'It must match a pattern the submit checks. Required when kind eq "company". The submit checks more rules for it.'
      )
      expect(checked?.sku).toEqual({ pattern: '^[A-Z]{3}$', type: 'string' })

      // What the field checks as it is written stays.
      const unchecked = build(fields, { validates: false }).schema.properties
      expect(unchecked?.vat).toEqual({ type: 'string' })
      expect(unchecked?.sku).toEqual({ type: 'string' })
      expect(unchecked?.code?.description).toBe('Required to be true.')
      expect(unchecked?.confirm?.description).toBe(
        'More rules are checked as it is written.'
      )
    })
  })

  describe('text the agent reads', () => {
    test('should translate labels, descriptions and options', () => {
      const country = propertyOf(
        [
          {
            description: 'country_help',
            label: 'country_label',
            name: 'country',
            source: [{ label: 'colombia', value: 'co' }],
            type: 'select',
          },
        ],
        'country',
        {
          localization: {
            lang: 'es',
            translations: {
              colombia: 'Colombia',
              country_help: 'Donde vives.',
              country_label: 'País',
            },
          },
        }
      )
      expect(country).toEqual({
        description: 'Donde vives. Options: co (Colombia).',
        enum: ['co'],
        title: 'País',
        type: 'string',
      })
    })

    // What the host puts in through `#/context/` can hold text people wrote,
    // and a long text is room for instructions in what an agent reads first.
    test('should cut a long label or description', () => {
      const fields: Fields = JSON.parse(`[
        {
          "description": { "$ref": "#/context/help" },
          "label": { "$ref": "#/context/label" },
          "name": "note",
          "type": "input/text"
        }
      ]`)
      const note = propertyOf(fields, 'note', {
        context: { help: 'a'.repeat(600), label: 'a'.repeat(250) },
      })

      expect(note?.title).toBe(`${'a'.repeat(197)}...`)
      expect(note?.description).toBe(`${'a'.repeat(497)}...`)
    })

    // An agent names an option by its value or its label, so neither is cut:
    // a field whose options take more than 1000 characters to list is looked
    // up, through a tool whose answer is untrusted.
    test('should look up the options of a field that take too long to list', () => {
      const options = (count: number, length: number) =>
        Array.from({ length: count }, (_, index) => ({
          label: String(index).padStart(length, 'a'),
          value: `v${index}`,
        }))
      const result = build([
        { name: 'one', source: options(1, 1001), type: 'select' },
        { name: 'many', source: options(20, 50), type: 'radio' },
        { name: 'fits', source: options(10, 50), type: 'select' },
      ])

      expect(result.lookup).toEqual(['one', 'many'])
      expect(result.schema.properties?.one?.enum).toBeUndefined()
      expect(result.schema.properties?.many?.enum).toBeUndefined()
      expect(result.schema.properties?.fits?.enum).toHaveLength(10)
    })

    // Counted in code points: one outside the basic plane is two UTF-16 units.
    test('should keep a label as long as the limit, counted in code points', () => {
      const label = `${'b'.repeat(199)}\u{10400}`
      expect(label.length).toBe(201)
      expect(
        propertyOf([{ label, name: 'one', type: 'input/text' }], 'one')?.title
      ).toBe(label)
    })

    test('should leave out text that interpolates a value', () => {
      expect(
        propertyOf(
          [
            {
              description: 'We will greet you as {value}.',
              label: 'Hello {env.name}',
              name: 'nickname',
              type: 'input/text',
            },
          ],
          'nickname'
        )
      ).toEqual({ type: 'string' })
    })

    test('should take the schema a custom type declares', () => {
      const rating: ToolSchema = { maximum: 5, minimum: 1, type: 'integer' }
      expect(
        propertyOf(
          [{ label: 'Rating', name: 'stars', type: 'rating' }],
          'stars',
          {
            types: { rating },
          }
        )
      ).toEqual({ maximum: 5, minimum: 1, title: 'Rating', type: 'integer' })
      expect(
        propertyOf([{ name: 'stars', type: 'rating' }], 'stars')?.type
      ).toBe('string')
    })
  })

  describe('names, bounds and types the form cannot take as written', () => {
    test('should describe a name held by two fields once, by the first the agent may write', () => {
      const result = build([
        {
          label: 'Locked',
          name: 'contact',
          readonly: true,
          type: 'input/text',
        },
        {
          label: 'Open',
          name: 'contact',
          required: true,
          type: 'input/email',
        },
        { name: 'contact', required: true, type: 'input/text' },
      ])

      expect(result.schema.properties?.contact).toEqual({
        format: 'email',
        title: 'Open',
        type: 'string',
      })
      expect(result.required).toEqual(['contact'])
    })

    test('should keep a field named __proto__ as a property of its own', () => {
      const fields: Fields = JSON.parse(
        '[{ "name": "__proto__", "required": true, "type": "input/text" }]'
      )
      const result = build(fields)

      expect(namesOf(fields)).toEqual(['__proto__'])
      expect(JSON.stringify(result.schema.properties)).toBe(
        '{"__proto__":{"type":"string"}}'
      )
      expect(result.required).toEqual(['__proto__'])
    })

    test('should say a required checkbox has to be ticked', () => {
      expect(
        propertyOf(
          [{ name: 'terms', required: true, type: 'checkbox' }],
          'terms'
        )
      ).toEqual({ description: 'Required to be true.', type: 'boolean' })
      expect(
        propertyOf([{ name: 'terms', type: 'checkbox' }], 'terms')
      ).toEqual({ type: 'boolean' })
    })

    test('should say a field whose bounds cannot be read takes no value', () => {
      const fields: Fields = JSON.parse(`[
        { "advanced": { "length": { "min": "x" } }, "name": "code", "type": "input/text" },
        { "advanced": { "length": { "max": "y" } }, "name": "age", "type": "input/number" },
        { "advanced": { "length": { "min": "z" } }, "name": "day", "type": "input/date" }
      ]`)
      const { properties } = build(fields).schema
      const unreadable =
        'The form cannot read its bounds, so the submit refuses any value for it.'

      expect(properties?.code).toEqual({
        description: unreadable,
        type: 'string',
      })
      expect(properties?.age).toEqual({
        description: unreadable,
        type: 'integer',
      })
      expect(properties?.day?.description).toBe(
        `${unreadable} A day as yyyy-MM-dd.`
      )
    })

    test('should not take what an object inherits for the schema of a type', () => {
      expect(
        propertyOf([{ name: 'note', type: 'toString' }], 'note', {
          types: {},
        })
      ).toEqual({ type: 'string' })
    })

    // `a` is asked first. Deciding it asks `b`, which only `a` reveals and is
    // still being decided, so `b` reads as not writable there; `d` then makes
    // `a` writable after all, and `b` with it.
    test('should not keep an answer reached inside a loop of revealers', () => {
      expect(
        namesOf([
          {
            hidden: true,
            event: reveal('b', { hidden: false }),
            name: 'a',
            type: 'input/text',
          },
          {
            hidden: true,
            event: reveal('a', { hidden: false }),
            name: 'b',
            type: 'input/text',
          },
          {
            event: reveal('a', { hidden: false }),
            name: 'd',
            type: 'input/text',
          },
        ])
      ).toEqual(['a', 'b', 'd'])
    })
  })

  describe('what every consumer reads', () => {
    const fields: Fields = [
      { name: 'name', required: true, type: 'input/text' },
      { name: 'email', type: 'input/email' },
      { advanced: { mode: 'range' }, name: 'stay', type: 'input/date' },
      { name: 'country', source: COUNTRIES, type: 'select' },
      { name: 'tags', source: COUNTRIES, type: 'chips' },
      { name: 'month', type: 'select/month' },
      {
        fields: [{ name: 'sku', required: true, type: 'input/text' }],
        name: 'items',
        type: 'list',
      },
    ]

    test('should use only the portable subset of JSON Schema', () => {
      const keywords = keywordsOf(build(fields).schema)
      expect(keywords.filter((keyword) => !PORTABLE.has(keyword))).toEqual([])
    })

    test('should give the same bytes for the same definition', () => {
      const once = JSON.stringify(build(fields).schema)
      const again = JSON.stringify(build(structuredClone(fields)).schema)
      expect(again).toBe(once)
    })
  })
})
