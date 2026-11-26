import { describe, expect, test } from 'vitest'
import {
  buildToolSchema,
  joinSentences,
  type ToolSchema,
  type ToolSchemaOptions,
} from '@/packages/luna-core/src/util/tool-schema'
import type {
  Field,
  Fields,
  Operator,
  PatternRule,
  Sections,
  StateEvent,
  WhenRule,
} from '@/packages/luna-core/src/type'

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
      expect(code?.description).toBe('It must match /^[a-z]{3}$/i.')
    })

    // A pattern left to the note still has to say what it expects: an
    // address checked case-insensitively on an `input/text`, with no
    // `format: email`, is only known by its rule.
    describe('a pattern only mentioned', () => {
      const email = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
      const describeContact = (
        pattern: PatternRule,
        translations?: Record<string, string>
      ) =>
        propertyOf(
          [{ name: 'contact', type: 'input/text', validation: { pattern } }],
          'contact',
          { localization: { translations } }
        )?.description

      test('should quote it with its flags and its message', () => {
        expect(
          describeContact({
            flags: 'i',
            message: 'Enter an email address, such as ana@example.com',
            regex: email,
          })
        ).toBe(
          `It must match /${email}/i. Enter an email address, such as ana@example.com`
        )
      })

      test('should quote it alone when it has no message', () => {
        expect(describeContact({ flags: 'i', regex: email })).toBe(
          `It must match /${email}/i.`
        )
      })

      // A part of a pattern would expect something else: one too long to
      // quote is named, and its message still says what it wants.
      test('should name one too long to quote, and keep its message', () => {
        const regex = `^${'[a-z]'.repeat(20)}$`
        expect(describeContact({ flags: 'i', regex })).toBe(
          'It must match a pattern the form checks.'
        )
        expect(
          describeContact({ flags: 'i', message: 'Twenty letters.', regex })
        ).toBe('It must match a pattern the form checks. Twenty letters.')
      })

      test('should translate its message', () => {
        expect(
          describeContact(
            { flags: 'i', message: 'invalid_code', regex: '^[a-z]{3}$' },
            { invalid_code: 'Three letters.' }
          )
        ).toBe('It must match /^[a-z]{3}$/i. Three letters.')
      })

      // The agent would read the placeholder. The pattern is quoted all the
      // same: its quantifier `{3}` is no placeholder.
      test('should leave out a message that interpolates a value', () => {
        expect(
          describeContact({
            flags: 'i',
            message: 'Not like {contact}',
            regex: '^[a-z]{3}$',
          })
        ).toBe('It must match /^[a-z]{3}$/i.')
      })

      test('should quote one that lets a template through', () => {
        expect(
          describeContact({ allowInterpolation: true, regex: '^https?://' })
        ).toBe('It must match /^https?:\\/\\//.')
      })

      // Quoted as a literal writes it: a bare `/` would end the literal early.
      test('should escape a slash once, and leave an escaped one alone', () => {
        expect(describeContact({ flags: 'i', regex: '^a\\/b/c$' })).toBe(
          'It must match /^a\\/b\\/c$/i.'
        )
        expect(describeContact({ flags: 'i', regex: '^a\\\\/$' })).toBe(
          'It must match /^a\\\\\\/$/i.'
        )
      })

      // The length is the literal's as the agent reads it, escapes included.
      test('should count the escapes in the length it quotes', () => {
        const regex = `${'a'.repeat(96)}/`
        expect(describeContact({ flags: 'i', regex })).toBe(
          'It must match a pattern the form checks.'
        )
      })
    })

    // The keyword holds the pattern, and its message what it is for.
    test('should say the message of a pattern the keyword carries', () => {
      expect(
        propertyOf(
          [
            {
              name: 'code',
              type: 'input/text',
              validation: {
                pattern: { message: 'Three capitals.', regex: '^[A-Z]{3}$' },
              },
            },
          ],
          'code'
        )
      ).toEqual({
        description: 'Three capitals.',
        pattern: '^[A-Z]{3}$',
        type: 'string',
      })
    })

    // The submit checks a pattern against the text of any field: a number
    // as typed, a day as picked, the value of a type the host declares. Only
    // a field typed as text takes it as a keyword.
    test('should quote the pattern of a field not typed as text', () => {
      const pattern: PatternRule = {
        message: 'Four digits.',
        regex: '^\\d{4}$',
      }
      const result = build(
        [
          { name: 'pin', type: 'input/number', validation: { pattern } },
          { name: 'zone', type: 'select/timezone', validation: { pattern } },
          { name: 'phone', type: 'phone', validation: { pattern } },
        ],
        { types: { phone: { type: 'string' } } }
      )
      const note = 'It must match /^\\d{4}$/. Four digits.'

      expect(result.schema.properties?.pin).toEqual({
        description: note,
        type: 'integer',
      })
      expect(result.schema.properties?.zone?.description).toContain(note)
      expect(result.schema.properties?.zone?.pattern).toBeUndefined()
      expect(result.schema.properties?.phone).toEqual({
        description: note,
        type: 'string',
      })
    })

    // A pattern checks text only: a box, a list of chips, the two days of a
    // range or an object never break it.
    test('should not speak of a pattern a value of its type never meets', () => {
      const pattern: PatternRule = { regex: '^\\d{4}$' }
      const point: ToolSchema = {
        properties: { x: { type: 'number' } },
        type: 'object',
      }
      const result = build(
        [
          { name: 'terms', type: 'input/checkbox', validation: { pattern } },
          {
            name: 'tags',
            source: [{ label: 'A', value: 'a' }],
            type: 'chips',
            validation: { pattern },
          },
          {
            advanced: { mode: 'range' },
            name: 'stay',
            type: 'input/date',
            validation: { pattern },
          },
          { name: 'spot', type: 'point', validation: { pattern } },
        ],
        { types: { point } }
      )

      for (const property of Object.values(result.schema.properties ?? {})) {
        expect(property.description ?? '').not.toContain('It must match')
      }
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

    // The schema of a field looked up holds no `enum`: nothing else tells an
    // agent that the label it found is enough, and not only the value.
    test('should say that an option looked up is taken by its value or its label', () => {
      const lookedUp =
        'Its options are not listed here: find them with the options tool of this form. Pass an option by its value or its label.'
      const many = Array.from({ length: 26 }, (_, index) => ({
        label: `Option ${index}`,
        value: `${index}`,
      }))
      const { properties } = build([
        { name: 'many', source: many, type: 'select' },
        {
          name: 'city',
          source: { url: 'https://example.com/cities' },
          type: 'select',
        },
        { name: 'tags', source: many, type: 'chips' },
      ]).schema

      expect(properties?.many?.description).toBe(lookedUp)
      expect(properties?.city?.description).toBe(lookedUp)
      expect(properties?.tags?.description).toBe(`${lookedUp} No option twice.`)
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

    // As a password: in every form, at the top level and in the rows of a
    // list, and the definition has no way to open it again.
    test('should leave out a field of a type its registration keeps from agents', () => {
      const result = build(
        [
          { name: 'token', type: 'secret' },
          {
            fields: [
              { name: 'key', type: 'secret' },
              { name: 'label', type: 'input/text' },
            ],
            name: 'keys',
            type: 'list',
          },
          { name: 'kept', type: 'input/text' },
        ],
        { types: { secret: false } }
      )

      expect(Object.keys(result.schema.properties ?? {})).toEqual([
        'keys',
        'kept',
      ])
      expect(
        Object.keys(result.schema.properties?.keys?.items?.properties ?? {})
      ).toEqual(['label'])
    })

    // `true` is what a form imported from JSON can say alongside `false`, and
    // it is the same as saying nothing: it opens nothing kept from agents.
    test('should read advanced.agent true as if it were left out', () => {
      const fields = (agent?: true): Fields => [
        { advanced: { agent }, name: 'password', type: 'input/password' },
        { advanced: { agent }, name: 'token', type: 'secret' },
        {
          advanced: { agent },
          fields: [
            { advanced: { agent }, name: 'key', type: 'secret' },
            { advanced: { agent }, name: 'pin', type: 'input/password' },
            { advanced: { agent }, name: 'label', type: 'input/text' },
          ],
          name: 'keys',
          type: 'list',
        },
        { advanced: { agent }, name: 'kept', type: 'input/text' },
      ]
      const options = { types: { secret: false } } as const

      const result = build(fields(true), options)
      expect(result).toEqual(build(fields(), options))
      expect(Object.keys(result.schema.properties ?? {})).toEqual([
        'keys',
        'kept',
      ])
      expect(
        Object.keys(result.schema.properties?.keys?.items?.properties ?? {})
      ).toEqual(['label'])
    })

    test('should still leave out what says advanced.agent false beside true', () => {
      expect(
        namesOf([
          { advanced: { agent: true }, name: 'kept', type: 'input/text' },
          { advanced: { agent: false }, name: 'document', type: 'input/text' },
          {
            advanced: { agent: false },
            fields: [
              { advanced: { agent: true }, name: 'leaf', type: 'input/text' },
            ],
            name: 'rows',
            type: 'list',
          },
        ])
      ).toEqual(['kept'])
    })

    test('should leave out a field that only a field of a type kept from agents shows', () => {
      const schema = build(
        [
          {
            event: reveal('detail', { hidden: false }),
            name: 'token',
            type: 'secret',
          },
          { hidden: true, name: 'detail', type: 'input/text' },
        ],
        { types: { secret: false } }
      ).schema
      expect(schema.properties).toEqual({})
      expect(JSON.stringify(schema)).not.toContain('token')
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
        'Options: weekly (Weekly). Shown for some values of newsletter: send it in the same call. Required while it is available.'
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
        'Shown and unlocked for some values of paymentMethod: send it in the same call. Required while it is available.'
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

    // The event fires in every row, and reaches the row it fired in: the note
    // names no row by its number.
    describe('a field a change in a row makes available', () => {
      const rowOf = (fields: Fields) =>
        propertyOf(fields, 'outer')?.items?.properties

      // Every note a row holds, nested or not: a state event, a requiredWhen,
      // an assertion's when and a custom rule.
      test('should name no row by its number in any note', () => {
        const fields: Fields = [
          {
            fields: [
              {
                event: reveal('outer/note', { hidden: false }),
                name: 'flag',
                type: 'checkbox',
              },
              {
                hidden: true,
                name: 'note',
                required: true,
                type: 'input/text',
              },
              {
                name: 'name',
                type: 'input/text',
                validation: {
                  custom: { field: 'flag', operator: 'neq' },
                  requiredWhen: { field: 'flag', operator: 'truthy' },
                  rules: [
                    {
                      assert: 'min',
                      message: 'Too short.',
                      value: 2,
                      when: { field: 'flag', operator: 'truthy' },
                    },
                  ],
                },
              },
              {
                fields: [
                  {
                    event: reveal('inner/x', { hidden: false }),
                    name: 'on',
                    type: 'checkbox',
                  },
                  {
                    hidden: true,
                    name: 'x',
                    type: 'input/text',
                    validation: {
                      requiredWhen: { field: 'on', operator: 'truthy' },
                    },
                  },
                ],
                name: 'inner',
                type: 'list',
              },
            ],
            name: 'outer',
            type: 'list',
          },
        ]
        const descriptions = JSON.stringify(build(fields).schema).match(
          /"description":"(?:[^"\\]|\\.)*"/g
        )
        expect(descriptions?.length).toBe(5)
        for (const description of descriptions ?? []) {
          expect(description).not.toMatch(/\.0\./)
        }
      })

      test('should name a field of its own row as this row', () => {
        expect(
          rowOf([
            {
              fields: [
                {
                  event: reveal('outer/note', { hidden: false }),
                  name: 'flag',
                  type: 'checkbox',
                },
                { hidden: true, name: 'note', type: 'input/text' },
              ],
              name: 'outer',
              type: 'list',
            },
          ])?.note?.description
        ).toBe(
          "Shown for some values of this row's flag: send it in the same call."
        )
      })

      test('should name a field of its own row in a nested list as this row', () => {
        expect(
          rowOf([
            {
              fields: [
                {
                  fields: [
                    {
                      event: reveal('inner/note', { disabled: false }),
                      name: 'flag',
                      type: 'checkbox',
                    },
                    { disabled: true, name: 'note', type: 'input/text' },
                  ],
                  name: 'inner',
                  type: 'list',
                },
              ],
              name: 'outer',
              type: 'list',
            },
          ])?.inner?.items?.properties?.note?.description
        ).toBe(
          "Unlocked for some values of this row's flag: send it in the same call."
        )
      })

      test('should name a field of its own row that shows a nested list as this row', () => {
        expect(
          rowOf([
            {
              fields: [
                {
                  event: reveal('outer/inner', { hidden: false }),
                  name: 'flag',
                  type: 'checkbox',
                },
                {
                  fields: [{ name: 'item', type: 'input/text' }],
                  hidden: true,
                  name: 'inner',
                  type: 'list',
                },
              ],
              name: 'outer',
              type: 'list',
            },
          ])?.inner?.description
        ).toContain("Shown for some values of this row's flag")
      })

      test('should name a field of a nested row by any of its rows', () => {
        const note = rowOf([
          {
            fields: [
              {
                fields: [
                  {
                    event: reveal('outer/note', { hidden: false }),
                    name: 'flag',
                    type: 'checkbox',
                  },
                ],
                name: 'inner',
                type: 'list',
              },
              { hidden: true, name: 'note', type: 'input/text' },
            ],
            name: 'outer',
            type: 'list',
          },
        ])?.note?.description
        expect(note).toBe(
          "Shown for some values of this row's inner.<row>.flag: send it in the same call."
        )
      })

      test('should name a field of a row by any of its rows from outside the list', () => {
        const note = propertyOf(
          [
            {
              fields: [
                {
                  event: reveal('summary', { hidden: false }),
                  name: 'flag',
                  type: 'checkbox',
                },
              ],
              name: 'outer',
              type: 'list',
            },
            { hidden: true, name: 'summary', type: 'input/text' },
          ],
          'summary'
        )?.description
        expect(note).toBe(
          'Shown for some values of outer.<row>.flag: send it in the same call.'
        )
      })
    })

    // A `when` the event compares the new value with: the note says which
    // value makes the slot available, so the agent does not try each one.
    describe('a field an event makes available for some values', () => {
      const shownBy = (when: StateEvent['when'], type = 'select') =>
        propertyOf(
          [
            {
              event: {
                change: [
                  {
                    action: 'state',
                    state: { hidden: false },
                    target: 'detail',
                    when,
                  },
                ],
              },
              name: 'kind',
              source: [
                { label: 'List', value: 'list' },
                { label: 'Group', value: 'group' },
              ],
              type,
            },
            { hidden: true, name: 'detail', type: 'input/text' },
          ],
          'detail'
        )?.description

      test('should cite the value a string matches', () => {
        expect(shownBy('list')).toBe(
          'Shown while kind equals "list": send it in the same call.'
        )
      })

      test('should cite the values an array matches', () => {
        expect(shownBy(['list', 'group'])).toBe(
          'Shown while kind is one of ["list","group"]: send it in the same call.'
        )
      })

      test('should cite a condition in words', () => {
        expect(shownBy({ operator: 'gt', value: 100 })).toBe(
          'Shown while kind is greater than 100: send it in the same call.'
        )
        expect(shownBy({ value: 'list' })).toBe(
          'Shown while kind equals "list": send it in the same call.'
        )
      })

      // `field` reads a key of the chosen option, which the agent does not
      // write; a chips field is matched by its selections, not by its value.
      test('should keep the change when the values cannot be cited', () => {
        const generic =
          'Shown for some values of kind: send it in the same call.'
        expect(shownBy({ field: 'dial', value: '+56' })).toBe(generic)
        expect(shownBy('list', 'chips')).toBe(generic)
        expect(
          shownBy({ operator: 'between' as Operator, value: 'list' })
        ).toBe(generic)
      })

      test("should cite the value of this row's field in a row", () => {
        expect(
          propertyOf(
            [
              {
                fields: [
                  {
                    event: {
                      change: [
                        {
                          action: 'state',
                          state: { hidden: false },
                          target: 'field/data_type',
                          when: 'list',
                        },
                      ],
                    },
                    name: 'type',
                    source: [{ label: 'List', value: 'list' }],
                    type: 'select',
                  },
                  { hidden: true, name: 'data_type', type: 'input/text' },
                ],
                name: 'field',
                type: 'list',
              },
            ],
            'field'
          )?.items?.properties?.data_type?.description
        ).toBe(
          'Shown while this row\'s type equals "list": send it in the same call.'
        )
      })

      test('should cite every event that shows it', () => {
        const fields = (second: StateEvent['when']): Fields => [
          {
            event: {
              change: [
                {
                  action: 'state',
                  state: { hidden: false },
                  target: 'detail',
                  when: 'list',
                },
              ],
            },
            name: 'kind',
            type: 'input/text',
          },
          {
            event: {
              change: [
                {
                  action: 'state',
                  state: { hidden: false },
                  target: 'detail',
                  when: second,
                },
              ],
            },
            name: 'mode',
            type: 'input/text',
          },
          { hidden: true, name: 'detail', type: 'input/text' },
        ]

        expect(propertyOf(fields('full'), 'detail')?.description).toBe(
          'Shown while kind equals "list" or mode equals "full": send it in the same call.'
        )
        expect(propertyOf(fields(undefined), 'detail')?.description).toBe(
          'Shown for some values of kind or mode: send it in the same call.'
        )
      })

      test('should say what shows it and what unlocks it apart', () => {
        expect(
          propertyOf(
            [
              {
                event: {
                  change: [
                    {
                      action: 'state',
                      state: { hidden: false },
                      target: 'detail',
                      when: 'list',
                    },
                    {
                      action: 'state',
                      state: { disabled: false },
                      target: 'detail',
                      when: 'group',
                    },
                  ],
                },
                name: 'kind',
                type: 'input/text',
              },
              {
                disabled: true,
                hidden: true,
                name: 'detail',
                type: 'input/text',
              },
            ],
            'detail'
          )?.description
        ).toBe(
          'Shown while kind equals "list" and unlocked while kind equals "group": send it in the same call.'
        )
        expect(
          propertyOf(
            [
              {
                event: {
                  change: [
                    {
                      action: 'state',
                      state: { disabled: false, hidden: false },
                      target: 'detail',
                      when: 'list',
                    },
                  ],
                },
                name: 'kind',
                type: 'input/text',
              },
              {
                disabled: true,
                hidden: true,
                name: 'detail',
                type: 'input/text',
              },
            ],
            'detail'
          )?.description
        ).toBe(
          'Shown and unlocked while kind equals "list": send it in the same call.'
        )
      })
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
      ).toBe('Required when kind equals "company".')
    })

    // Typed by every operator, so a new one cannot ship without its words.
    const phrases: Record<Operator, [WhenRule['value'], string]> = {
      contains: ['co', 'kind contains "co"'],
      empty: [undefined, 'kind has no value'],
      eq: ['co', 'kind equals "co"'],
      exists: [undefined, 'kind has a value'],
      gt: [3, 'kind is greater than 3'],
      gte: [3, 'kind is at least 3'],
      in: [['a', 'b'], 'kind is one of ["a","b"]'],
      lt: [3, 'kind is less than 3'],
      lte: [3, 'kind is at most 3'],
      neq: ['co', 'kind does not equal "co"'],
      nin: [['a', 'b'], 'kind is not one of ["a","b"]'],
      truthy: [undefined, 'kind has a value other than false or 0'],
    }
    for (const [operator, [value, words]] of Object.entries(phrases)) {
      test(`should write the ${operator} operator in words`, () => {
        expect(
          propertyOf(
            [
              {
                name: 'vat',
                type: 'input/text',
                validation: {
                  requiredWhen: {
                    field: 'kind',
                    operator: operator as Operator,
                    value,
                  },
                },
              },
            ],
            'vat'
          )?.description
        ).toBe(`Required when ${words}.`)
      })
    }

    test('should not write the value an operator ignores', () => {
      expect(
        propertyOf(
          [
            {
              name: 'vat',
              type: 'input/text',
              validation: {
                requiredWhen: { field: 'kind', operator: 'exists', value: 'x' },
              },
            },
          ],
          'vat'
        )?.description
      ).toBe('Required when kind has a value.')
    })

    test('should equal by default', () => {
      expect(
        propertyOf(
          [
            {
              name: 'vat',
              type: 'input/text',
              validation: { requiredWhen: { field: 'kind', value: 'co' } },
            },
          ],
          'vat'
        )?.description
      ).toBe('Required when kind equals "co".')
    })

    test('should not describe a rule whose operator the form cannot read', () => {
      const fields = JSON.parse(
        JSON.stringify([
          {
            name: 'vat',
            type: 'input/text',
            validation: {
              requiredWhen: [
                { field: 'kind', operator: 'like', value: 'co' },
                { field: 'size', operator: 'gt', value: 3 },
              ],
            },
          },
          {
            name: 'tax',
            type: 'input/text',
            validation: {
              requiredWhen: { field: 'kind', operator: 'like', value: 'co' },
            },
          },
        ])
      ) as Fields
      expect(propertyOf(fields, 'vat')?.description).toBe(
        'Required when size is greater than 3.'
      )
      expect(propertyOf(fields, 'tax')).toEqual({ type: 'string' })
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
      ).toContain('Required when this row\'s mode equals "strict".')
    })

    // Each rule of `rules` and `custom` is said with its message, so the agent
    // writes a value that passes it instead of learning it from an error.
    describe('the rules no keyword says', () => {
      const describeRules = (field: Field) =>
        propertyOf([field], field.name)?.description

      test('should say each assertion and its message', () => {
        expect(
          describeRules({
            name: 'code',
            type: 'input/text',
            validation: {
              rules: [
                { assert: 'required', message: 'Name the key' },
                { assert: 'min', message: 'Too short.', value: 3 },
                { assert: 'max', message: 'Too long.', value: 20 },
                {
                  assert: 'oneOf',
                  message: 'Choose a valid operator.',
                  value: ['eq', 'neq'],
                },
                {
                  assert: 'pattern',
                  message: 'Lowercase letters only.',
                  value: { flags: 'i', regex: '^[a-z_]+$' },
                },
              ],
            },
          })
        ).toBe(
          'Required. Name the key. At least 3 characters. Too short. At most 20 characters. Too long. One of ["eq","neq"]. Choose a valid operator. It must match /^[a-z_]+$/i. Lowercase letters only.'
        )
      })

      test('should measure a bound by what the field holds', () => {
        expect(
          describeRules({
            name: 'port',
            type: 'input/number',
            validation: {
              rules: [{ assert: 'min', message: 'Too low.', value: 1024 }],
            },
          })
        ).toBe('At least 1024. Too low.')
        expect(
          describeRules({
            name: 'tags',
            source: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ],
            type: 'chips',
            validation: {
              rules: [
                { assert: 'minItems', message: 'Pick two.', value: 2 },
                { assert: 'max', message: 'Pick fewer.', value: 3 },
              ],
            },
          })
        ).toBe(
          'Options: a (A), b (B). No option twice. At least 2 items. Pick two. At most 3 items. Pick fewer.'
        )
      })

      test('should say when an assertion applies', () => {
        expect(
          describeRules({
            name: 'port',
            type: 'input/number',
            validation: {
              rules: [
                {
                  assert: 'required',
                  message: 'Port is required for custom connections.',
                  when: { field: 'kind', value: 'custom' },
                },
                {
                  assert: 'max',
                  message: 'Too high.',
                  value: 9,
                  when: [
                    { field: 'kind', value: 'a' },
                    { field: 'size', operator: 'gt', value: 2 },
                  ],
                },
                {
                  assert: 'min',
                  message: 'Too low.',
                  value: 1,
                  when: {
                    all: [{ field: 'kind', value: 'a' }],
                    any: [
                      { field: 'size', operator: 'exists' },
                      { field: 'mode', value: 'b' },
                    ],
                  },
                },
              ],
            },
          })
        ).toBe(
          'Required when kind equals "custom". Port is required for custom connections. At most 9 when kind equals "a" and size is greater than 2. Too high. At least 1 when kind equals "a" and (size has a value or mode equals "b"). Too low.'
        )
      })

      test('should compare with the field a custom rule names', () => {
        expect(
          describeRules({
            name: 'confirm',
            type: 'input/text',
            validation: {
              custom: [
                { field: 'password', message: 'Passwords must match.' },
                { field: 'start', operator: 'gte' },
                { field: 'other', operator: 'exists' },
              ],
            },
          })
        ).toBe(
          'The form checks that it equals the value of password. Passwords must match. The form checks that it is at least the value of start. The form checks that it has a value.'
        )
      })

      test("should read a row's fields as this row's", () => {
        const items = build([
          {
            fields: [
              {
                name: 'name',
                required: true,
                type: 'input/text',
                validation: {
                  custom: { field: 'label', operator: 'neq' },
                  rules: [
                    {
                      assert: 'pattern',
                      message: 'A technical key.',
                      value: { regex: '^[a-z_]+$' },
                      when: { field: 'kind', value: 'key' },
                    },
                  ],
                },
              },
            ],
            name: 'items',
            type: 'list',
          },
        ]).schema.properties?.items
        expect(items?.items?.properties?.name?.description).toBe(
          'The form checks that it does not equal the value of this row\'s label. It must match /^[a-z_]+$/ when this row\'s kind equals "key". A technical key.'
        )
      })

      // A rule that never fails is none; one that fails every value is, and
      // is named by its message when what it checks cannot be said.
      test('should say no rule that never fails, and name one it cannot say', () => {
        const fields = JSON.parse(
          JSON.stringify([
            {
              name: 'code',
              type: 'input/text',
              validation: {
                custom: { field: 'other', operator: 'like' },
                rules: [
                  { assert: 'unknown', message: 'Never.' },
                  { assert: 'pattern', message: 'No pattern.', value: 3 },
                  {
                    assert: 'required',
                    message: 'Never applies.',
                    when: { field: 'kind', operator: 'like', value: 'a' },
                  },
                  {
                    assert: 'required',
                    message: 'Never applies either.',
                    when: { any: [] },
                  },
                ],
              },
            },
            {
              name: 'vat',
              type: 'input/text',
              validation: {
                rules: [
                  { assert: 'minItems', message: 'Too few.', value: 2 },
                  { assert: 'min', message: 'No bound.', value: 'x' },
                  { assert: 'oneOf', message: 'No list.', value: 'a' },
                ],
              },
            },
          ])
        ) as Fields
        expect(propertyOf(fields, 'code')).toEqual({ type: 'string' })
        expect(propertyOf(fields, 'vat')?.description).toBe(
          'The form checks more rules for it. Too few. No bound. No list.'
        )
      })

      test('should leave out a message that interpolates a value', () => {
        expect(
          describeRules({
            name: 'code',
            type: 'input/text',
            validation: {
              rules: [{ assert: 'min', message: 'At least {min}.', value: 3 }],
            },
          })
        ).toBe('At least 3 characters.')
      })

      test('should translate the messages', () => {
        expect(
          propertyOf(
            [
              {
                name: 'code',
                type: 'input/text',
                validation: {
                  rules: [{ assert: 'required', message: 'code_required' }],
                },
              },
            ],
            'code',
            {
              localization: {
                lang: 'es',
                translations: { code_required: 'Escribe la clave.' },
              },
            }
          )?.description
        ).toBe('Required. Escribe la clave.')
      })
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
        'It must match /^[a-z]{3}$/i. Required when kind equals "company". The form checks more rules for it. Too few.'
      )
      expect(checked?.sku).toEqual({ pattern: '^[A-Z]{3}$', type: 'string' })

      // What the field checks as it is written stays.
      const unchecked = build(fields, { validates: false }).schema.properties
      expect(unchecked?.vat).toEqual({ type: 'string' })
      expect(unchecked?.sku).toEqual({ type: 'string' })
      expect(unchecked?.code?.description).toBe('Required to be true.')
      expect(unchecked?.confirm?.description).toBe(
        'The form checks that it equals the value of vat.'
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

    // A dictionary key cannot always end in a period, so the author's text
    // may stop without one: the notes start a sentence of their own.
    test("should close the author's description before the notes", () => {
      const describe = (description: string) =>
        propertyOf(
          [
            {
              description,
              name: 'code',
              type: 'input/text',
              validation: { pattern: { flags: 'i', regex: '^[a-z]{3}$' } },
            },
          ],
          'code'
        )?.description

      const note = 'It must match /^[a-z]{3}$/i.'
      expect(describe('Already approved in your account')).toBe(
        `Already approved in your account. ${note}`
      )
      expect(describe('Already approved in your account.')).toBe(
        `Already approved in your account. ${note}`
      )
      expect(describe('Already approved in your account  ')).toBe(
        `Already approved in your account. ${note}`
      )
      expect(describe('Which one?')).toBe(`Which one? ${note}`)
      expect(describe('   ')).toBe(note)

      const rating: ToolSchema = {
        description: 'From one to five',
        type: 'integer',
      }
      expect(
        propertyOf(
          [{ description: 'How you rate it', name: 'stars', type: 'rating' }],
          'stars',
          { types: { rating } }
        )?.description
      ).toBe('How you rate it. From one to five')

      // A list's description too, before the note on its rows.
      expect(
        propertyOf(
          [
            {
              description: 'The data group',
              fields: [{ name: 'sku', type: 'input/text' }],
              name: 'items',
              type: 'list',
            },
          ],
          'items'
        )?.description
      ).toMatch(/^The data group\. Sending the list replaces its rows\./)

      // Written as a message, and on a list inside a row.
      const inner = build([
        {
          fields: [
            {
              description: {
                message: 'Define the fields you expect inside it',
              },
              fields: [{ name: 'name', type: 'input/text' }],
              name: 'fields',
              type: 'list',
            },
          ],
          name: 'groups',
          type: 'list',
        },
      ]).schema.properties?.groups?.items?.properties?.fields
      expect(inner?.description).toMatch(
        /^Define the fields you expect inside it\. Sending the list replaces its rows\./
      )
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
        'The form cannot read its bounds, so it accepts no value for it.'

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

describe('joinSentences', () => {
  test('should close a piece that does not end a sentence before the next', () => {
    expect(joinSentences(['Signs a person up', 'Fills this form.'])).toBe(
      'Signs a person up. Fills this form.'
    )
    expect(joinSentences(['Own', 'From the schema', 'A note.'])).toBe(
      'Own. From the schema. A note.'
    )
  })

  test('should leave a piece that already ends a sentence as it is', () => {
    for (const piece of [
      'Signs up.',
      'Signs up!',
      'Signs up?',
      'Pick one:',
      'Signs up...',
      'Signs up\u2026',
      'Say "signs up."',
      '(Signs up.)',
      '\u767b\u9332\u3057\u307e\u3059\u3002',
    ]) {
      expect(joinSentences([piece, 'Next.'])).toBe(`${piece} Next.`)
    }
  })

  test('should trim each piece and leave out a blank or missing one', () => {
    expect(joinSentences([' Signs up \n', undefined, '', '  ', 'Next.'])).toBe(
      'Signs up. Next.'
    )
    expect(joinSentences([undefined, 'Next.'])).toBe('Next.')
    expect(joinSentences([])).toBe('')
  })

  test('should keep the last piece as it was written', () => {
    expect(joinSentences(['Next.', 'Signs a person up'])).toBe(
      'Next. Signs a person up'
    )
  })
})
