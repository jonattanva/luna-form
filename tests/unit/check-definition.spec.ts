import { describe, expect, test } from 'vitest'
import { checkDefinition } from '@/packages/luna-core/src/util/check-definition'

const TYPES = ['input/text', 'input/email', 'select']

function field(name: string, type = 'input/text', extra: object = {}) {
  return { name, type, ...extra }
}

function form(fields: object[], definition?: object) {
  return { definition, sections: [{ fields }] }
}

describe('checkDefinition', () => {
  test('should find nothing in a form that renders as written', () => {
    expect(
      checkDefinition(
        form([
          field('name', 'input/text', {
            event: {
              change: [
                { action: 'value', value: { email: '{value}' } },
                { action: 'state', state: { hidden: false }, target: 'items' },
              ],
            },
          }),
          field('email', 'input/email'),
          {
            fields: [field('city'), field('country', 'select')],
            type: 'column',
          },
          {
            fields: [
              field('sku', 'input/text', {
                event: {
                  change: [
                    { action: 'value', value: { 'items/label': '{value}' } },
                  ],
                },
              }),
              field('label'),
              // A row's leaf may share a name with a field of the form.
              field('name'),
            ],
            name: 'items',
            type: 'list',
          },
        ]),
        TYPES
      )
    ).toEqual([])
  })

  test('should ask for an array of sections', () => {
    expect(checkDefinition({}, TYPES)).toEqual([
      { message: 'Expected an array of sections.', path: 'sections' },
    ])
    expect(checkDefinition({ sections: [1] }, TYPES)).toEqual([
      { message: 'Expected a section object.', path: 'sections[0]' },
    ])
    expect(checkDefinition({ sections: [{ fields: {} }] }, TYPES)).toEqual([
      { message: 'Expected an array of fields.', path: 'sections[0].fields' },
    ])
  })

  test('should tell a field without a type, a name, or a registered type', () => {
    expect(
      checkDefinition(
        form([{ name: 'a' }, { type: 'input/text' }, field('b', 'input/mail')]),
        TYPES
      )
    ).toEqual([
      {
        message: 'Expected a field object with a type.',
        path: 'sections[0].fields[0]',
      },
      { message: 'The field has no name.', path: 'sections[0].fields[1]' },
      {
        message:
          'No input is registered for the type "input/mail", so "b" would not render.',
        path: 'sections[0].fields[2]',
      },
    ])
  })

  test('should take two fields under one name, which hold one value', () => {
    expect(
      checkDefinition(
        {
          sections: [
            { fields: [field('document')] },
            {
              fields: [
                { fields: [field('document')], type: 'column' },
                {
                  fields: [field('sku'), field('sku')],
                  name: 'items',
                  type: 'list',
                },
              ],
            },
          ],
        },
        TYPES
      )
    ).toEqual([])
  })

  test('should resolve $ref first, and tell one that resolves to nothing', () => {
    expect(
      checkDefinition(
        form([{ $ref: '#/definition/email' }], {
          email: field('email', 'input/email'),
        }),
        TYPES
      )
    ).toEqual([])

    expect(
      checkDefinition(form([{ $ref: '#/definition/missing' }], {}), TYPES)
    ).toEqual([
      {
        message: '"#/definition/missing" resolves to nothing.',
        path: 'sections[0].fields[0]',
      },
    ])
  })

  test('should leave a $ref into the context to the host', () => {
    expect(
      checkDefinition(
        form([
          field('room', 'select', { source: { $ref: '#/context/rooms' } }),
        ]),
        TYPES
      )
    ).toEqual([])
    expect(checkDefinition(form([{ $ref: '#/context/field' }]), TYPES)).toEqual(
      []
    )
  })

  test('should take a number in a field name as part of it, not as a row', () => {
    expect(
      checkDefinition(
        form([
          field('address.1'),
          field('picker', 'input/text', {
            event: {
              change: [{ action: 'value', value: { 'address.1': 'x' } }],
            },
          }),
        ]),
        TYPES
      )
    ).toEqual([])
  })

  test('should not check the targets of a form with a field the host puts in, whose name it cannot know', () => {
    expect(
      checkDefinition(
        form([
          { $ref: '#/context/field' },
          field('name', 'input/text', {
            event: {
              change: [
                { action: 'state', state: { hidden: true }, target: 'extra' },
              ],
            },
          }),
        ]),
        TYPES
      )
    ).toEqual([])
  })

  test('should tell an event aimed at a field the form does not have', () => {
    const problems = checkDefinition(
      form([
        field('name', 'input/text', {
          event: {
            change: [
              { action: 'value', value: { nickname: '{value}' } },
              {
                action: 'state',
                state: { hidden: true },
                target: ['email', 'phone'],
              },
              { action: 'source', source: { url: '/x' }, target: 'items/sku' },
            ],
          },
        }),
        field('email', 'input/email'),
        // A row's leaf is reached through its list, not by its name alone.
        { fields: [field('label')], name: 'items', type: 'list' },
        field('other', 'input/text', {
          event: {
            change: [{ action: 'value', value: { label: 'x' } }],
          },
        }),
      ]),
      TYPES
    )
    expect(problems).toEqual([
      {
        message: 'The event targets "nickname", which no field is.',
        path: 'sections[0].fields[0].event.change[0]',
      },
      {
        message: 'The event targets "phone", which no field is.',
        path: 'sections[0].fields[0].event.change[1]',
      },
      {
        message: 'The event targets "items/sku", which no field is.',
        path: 'sections[0].fields[0].event.change[2]',
      },
      {
        message: 'The event targets "label", which no field is.',
        path: 'sections[0].fields[3].event.change[0]',
      },
    ])
  })

  test('should read a target the way the form does, from where the field that sends it is', () => {
    const groups = {
      fields: [
        field('title'),
        { fields: [field('qty')], name: 'items', type: 'list' },
      ],
      name: 'groups',
      type: 'list',
    }
    const items = {
      fields: [
        field('sku', 'input/text', {
          event: {
            change: [{ action: 'value', value: { 'items/label': '{value}' } }],
          },
        }),
        field('label'),
      ],
      name: 'items',
      type: 'list',
    }
    const sender = (change: object[]) =>
      field('picker', 'input/text', { event: { change } })

    // A position reaches a row, whichever it is; a list nested under another
    // of the same name keeps its own leaves.
    expect(
      checkDefinition(
        form([
          sender([
            { action: 'value', value: { 'groups.1.items': [] } },
            { action: 'value', value: { 'groups.0.title': 'x' } },
          ]),
          groups,
          items,
        ]),
        TYPES
      )
    ).toEqual([])

    // `list/leaf` reaches the row the sender sits in: from outside the list,
    // it is the plain name, which no field here is.
    expect(
      checkDefinition(
        form([
          sender([{ action: 'value', value: { 'items/label': 'x' } }]),
          groups,
          items,
        ]),
        TYPES
      )
    ).toEqual([
      {
        message: 'The event targets "items/label", which no field is.',
        path: 'sections[0].fields[0].event.change[0]',
      },
    ])

    // From a row of `groups`, `items/sku` is its own inner list, which has no
    // `sku`.
    expect(
      checkDefinition(
        form([
          {
            ...groups,
            fields: [
              ...groups.fields,
              field('copy', 'input/text', {
                event: {
                  change: [{ action: 'value', value: { 'items/sku': 'x' } }],
                },
              }),
            ],
          },
          items,
        ]),
        TYPES
      )
    ).toEqual([
      {
        message: 'The event targets "items/sku", which no field is.',
        path: 'sections[0].fields[0].fields[2].event.change[0]',
      },
    ])
  })
})
