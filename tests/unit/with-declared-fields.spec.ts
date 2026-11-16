import { describe, expect, test } from 'vitest'
import { withDeclaredFields } from '@/packages/luna-react/src/client/lib/with-declared-fields'
import type { Sections } from '@luna-form/core'

// What this defends is a distinction the form draws and a host's own state
// usually does not: a name the value object carries is a field the form will
// re-read, and a name it leaves out is one the form leaves alone. A host only
// holds what something wrote, so every field nobody has touched yet — and every
// field a revert took the last of — falls on the wrong side of that line.
describe('with declared fields', () => {
  const sections = [
    {
      fields: [
        { label: 'Label', name: 'label', type: 'textarea' },
        { label: 'Description', name: 'description', type: 'textarea' },
      ],
    },
  ] as Sections

  test('should name a field the value leaves out', () => {
    expect(withDeclaredFields(sections, { label: 'Send invoice' })).toEqual({
      label: 'Send invoice',
      description: undefined,
    })
  })

  // `toEqual` treats a missing key and an explicit `undefined` as the same
  // thing, which is the one difference this whole module is about.
  test('should name it as a key and not as an absence', () => {
    const result = withDeclaredFields(sections, { label: 'Send invoice' })
    expect(Object.keys(result).sort()).toEqual(['description', 'label'])
  })

  test('should leave a value that is already empty alone', () => {
    expect(withDeclaredFields(sections, { description: '' })).toEqual({
      label: undefined,
      description: '',
    })
  })

  test('should return the value untouched when it names every field', () => {
    const value = { label: 'Send invoice', description: 'Monthly' }
    expect(withDeclaredFields(sections, value)).toBe(value)
  })

  test('should not write to the value it is given', () => {
    const value = { label: 'Send invoice' }
    withDeclaredFields(sections, value)
    expect(value).toEqual({ label: 'Send invoice' })
  })

  test('should walk through a column to the fields it groups', () => {
    const columns = [
      {
        fields: [
          {
            type: 'column',
            fields: [{ label: 'Label', name: 'label', type: 'textarea' }],
          },
        ],
      },
    ] as Sections

    expect(withDeclaredFields(columns, {})).toEqual({ label: undefined })
  })

  // A list is one name holding an array. Its children are addressed by position
  // inside that array, so naming them at the top level would describe a shape
  // the form never reads.
  test('should name a list without naming what is inside it', () => {
    const lists = [
      {
        fields: [
          {
            type: 'list',
            name: 'headers',
            fields: [{ label: 'Key', name: 'key', type: 'input/text' }],
          },
        ],
      },
    ] as Sections

    expect(withDeclaredFields(lists, {})).toEqual({ headers: undefined })
  })

  test('should leave a nested path that resolves alone', () => {
    const nested = [
      {
        fields: [
          { label: 'Username', name: 'basicAuth.username', type: 'input/text' },
        ],
      },
    ] as Sections

    const value = { basicAuth: { username: 'ada' } }
    expect(withDeclaredFields(nested, value)).toBe(value)
  })

  test('should name a nested path that does not resolve', () => {
    const nested = [
      {
        fields: [
          { label: 'Username', name: 'basicAuth.username', type: 'input/text' },
        ],
      },
    ] as Sections

    expect(withDeclaredFields(nested, { basicAuth: {} })).toEqual({
      basicAuth: {},
      'basicAuth.username': undefined,
    })
  })

  test('should read a section that declares no fields', () => {
    expect(withDeclaredFields([{ title: 'Empty' }] as Sections, {})).toEqual({})
  })

  // A host that keeps a list as row objects loses a row's key the same way it
  // loses one of the value's: an undo, or a field reported empty. And a row
  // that moves up when one above it is removed reads what the row it replaced
  // held until the host's answer says otherwise.
  describe('the rows of a list', () => {
    const headers = [
      {
        fields: [
          {
            type: 'list',
            name: 'headers',
            fields: [
              { label: 'Key', name: 'key', type: 'input/text' },
              { label: 'Value', name: 'value', type: 'input/text' },
            ],
          },
        ],
      },
    ] as Sections

    // `toStrictEqual` here and below: a missing key and an explicit `undefined`
    // are what this module tells apart, and `toEqual` does not.
    test('should name the fields a row leaves out, as keys', () => {
      expect(
        withDeclaredFields(headers, { headers: [{ key: 'Accept' }, {}] })
      ).toStrictEqual({
        headers: [
          { key: 'Accept', value: undefined },
          { key: undefined, value: undefined },
        ],
      })
    })

    test('should return the value untouched when every row names every field', () => {
      const value = { headers: [{ key: 'Accept', value: 'text/html' }] }
      expect(withDeclaredFields(headers, value)).toBe(value)
    })

    test('should keep a row that names every field as it is', () => {
      const complete = { key: 'Accept', value: 'text/html' }
      const result = withDeclaredFields(headers, {
        headers: [complete, { key: 'Range' }],
      })

      expect((result.headers as unknown[])[0]).toBe(complete)
    })

    test('should not write to the rows it is given', () => {
      const value = { headers: [{ key: 'Accept' }] }
      withDeclaredFields(headers, value)
      expect(value).toEqual({ headers: [{ key: 'Accept' }] })
      expect(Object.keys(value.headers[0])).toEqual(['key'])
    })

    test('should leave a row that is not an object alone', () => {
      const value = { headers: ['Accept', null] }
      expect(withDeclaredFields(headers, value)).toBe(value)
    })

    test('should walk through a column inside a row', () => {
      const columns = [
        {
          fields: [
            {
              type: 'list',
              name: 'headers',
              fields: [
                {
                  type: 'column',
                  fields: [{ label: 'Key', name: 'key', type: 'input/text' }],
                },
              ],
            },
          ],
        },
      ] as Sections

      expect(withDeclaredFields(columns, { headers: [{}] })).toStrictEqual({
        headers: [{ key: undefined }],
      })
    })

    test('should name the fields of a list inside a row', () => {
      const nested = [
        {
          fields: [
            {
              type: 'list',
              name: 'rules',
              fields: [
                { label: 'Name', name: 'name', type: 'input/text' },
                {
                  type: 'list',
                  name: 'checks',
                  fields: [
                    { label: 'Check', name: 'check', type: 'input/text' },
                  ],
                },
              ],
            },
          ],
        },
      ] as Sections

      expect(
        withDeclaredFields(nested, { rules: [{ name: 'a', checks: [{}] }, {}] })
      ).toStrictEqual({
        rules: [
          { name: 'a', checks: [{ check: undefined }] },
          { name: undefined, checks: undefined },
        ],
      })
    })
  })

  // A field brought in through a `$ref` has no name until the reference is
  // resolved, which takes the `definition` the form itself is given.
  describe('a field from the definition', () => {
    const definition = {
      key: { label: 'Key', name: 'key', type: 'input/text' },
    }

    test('should name a field a section brings in by reference', () => {
      const sections = [
        { fields: [{ $ref: '#/definition/key' }] },
      ] as unknown as Sections

      expect(withDeclaredFields(sections, {}, definition)).toStrictEqual({
        key: undefined,
      })
    })

    test('should name a field a row brings in by reference', () => {
      const sections = [
        {
          fields: [
            {
              type: 'list',
              name: 'headers',
              fields: [{ $ref: '#/definition/key' }],
            },
          ],
        },
      ] as unknown as Sections

      expect(
        withDeclaredFields(sections, { headers: [{}] }, definition)
      ).toStrictEqual({ headers: [{ key: undefined }] })
    })

    test('should leave a reference it cannot resolve alone', () => {
      const sections = [
        { fields: [{ $ref: '#/definition/key' }] },
      ] as unknown as Sections

      expect(withDeclaredFields(sections, {})).toEqual({})
    })
  })
})
