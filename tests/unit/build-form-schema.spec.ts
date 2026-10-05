import {
  buildFormSchema,
  collectIssues,
} from '@/packages/luna-core/src/util/schema'
import { describe, expect, test, vi } from 'vitest'
import type { Sections } from '@/packages/luna-core/src/type'

describe('buildFormSchema (headless)', () => {
  test('derives a required leaf field from the form definition', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'permission',
            type: 'radio',
            required: true,
            validation: { required: 'Please select a permission level' },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ permission: '' }).success).toBe(false)
    expect(schema.safeParse({ permission: 'owner' }).success).toBe(true)
  })

  test('surfaces the form.json message on a required failure', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'permission',
            type: 'radio',
            required: true,
            validation: { required: 'Please select a permission level' },
          },
        ],
      },
    ]

    const result = buildFormSchema(sections).safeParse({ permission: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issues = collectIssues(result.error)
      expect(issues).toContainEqual({
        path: 'permission',
        message: 'Please select a permission level',
      })
    }
  })

  test('flattens column children into the parent object namespace', () => {
    const sections: Sections = [
      {
        fields: [
          {
            type: 'column',
            fields: [
              { name: 'first', type: 'input', required: true },
              { name: 'second', type: 'input', required: true },
            ],
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ first: 'a', second: 'b' }).success).toBe(true)
    expect(schema.safeParse({ first: 'a', second: '' }).success).toBe(false)
  })

  test('models a list as an array of objects', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'items',
            type: 'list',
            fields: [
              {
                name: 'label',
                type: 'input',
                required: true,
                validation: { required: 'Label is required' },
              },
            ],
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ items: [{ label: 'x' }] }).success).toBe(true)
    expect(schema.safeParse({ items: 'not-an-array' }).success).toBe(false)
    expect(schema.safeParse({ items: [{ label: '' }] }).success).toBe(false)
  })

  test('models nested lists (conditional-shaped rules[].rule[])', () => {
    // Boundary cast: real forms arrive as JSON (luna-flow passes them as
    // `Record<string, unknown>`). The `List.fields` type does not yet model a
    // nested `List`, so we assert at the call boundary exactly as callers do.
    // See Phase 0 finding: widen `List.fields` when the runtime (react) is touched.
    const sections = [
      {
        fields: [
          {
            name: 'rules',
            type: 'list',
            fields: [
              {
                name: 'rule',
                type: 'list',
                fields: [
                  {
                    type: 'column',
                    fields: [
                      {
                        name: 'rule',
                        type: 'input/expression',
                        required: true,
                        validation: { required: 'Pick the value to check' },
                      },
                      {
                        name: 'operator',
                        type: 'select',
                        required: true,
                        validation: { required: 'Choose how to compare' },
                      },
                      {
                        name: 'value',
                        type: 'input/expression',
                        required: true,
                        validation: { required: 'Enter the value' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections as unknown as Sections)

    const valid = {
      rules: [{ rule: [{ rule: 'name', operator: 'eq', value: 'John' }] }],
    }
    expect(schema.safeParse(valid).success).toBe(true)

    const missingValue = {
      rules: [{ rule: [{ rule: 'name', operator: 'eq', value: '' }] }],
    }
    const result = schema.safeParse(missingValue)
    expect(result.success).toBe(false)
    if (!result.success) {
      const issues = collectIssues(result.error)
      expect(issues).toContainEqual({
        path: 'rules.0.rule.0.value',
        message: 'Enter the value',
      })
    }
  })

  test('models a chips field as a string array', () => {
    const sections: Sections = [
      {
        fields: [{ name: 'match', type: 'chips' }],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ match: ['or'] }).success).toBe(true)
    expect(schema.safeParse({ match: [] }).success).toBe(true)
  })

  test('honors cross-field validation.custom via core buildSchema (no re-derivation)', () => {
    const sections: Sections = [
      {
        fields: [
          { name: 'password', type: 'input', required: true },
          {
            name: 'confirm',
            type: 'input',
            required: true,
            validation: {
              custom: {
                field: 'password',
                operator: 'eq',
                message: 'Passwords must match',
              },
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(
      schema.safeParse({ password: 'secret', confirm: 'secret' }).success
    ).toBe(true)

    const mismatch = schema.safeParse({ password: 'secret', confirm: 'other' })
    expect(mismatch.success).toBe(false)
    if (!mismatch.success) {
      expect(collectIssues(mismatch.error)).toContainEqual({
        path: 'confirm',
        message: 'Passwords must match',
      })
    }
  })

  test('resolves $ref sources via the definition', () => {
    const sections: Sections = [
      {
        fields: [{ name: 'permission', type: 'radio', required: true }],
      },
    ]

    // No definition needed here, but a definition-carrying form must not throw.
    const schema = buildFormSchema(sections, undefined, { options: [] })
    expect(schema.safeParse({ permission: 'owner' }).success).toBe(true)
  })

  test('nests dotted field names into a nested object schema', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'basicAuth.username',
            type: 'input',
            required: true,
            validation: { required: 'Username is required' },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    // The config is nested (the runtime unflattens dotted keys on submit).
    expect(schema.safeParse({ basicAuth: { username: 'u' } }).success).toBe(
      true
    )

    const missing = schema.safeParse({ basicAuth: {} })
    expect(missing.success).toBe(false)
    if (!missing.success) {
      expect(collectIssues(missing.error)).toContainEqual({
        path: 'basicAuth.username',
        message: 'Username is required',
      })
    }
  })

  test('does not structurally require a hidden field (visibility-gated)', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'collectionType',
            type: 'input',
            required: true,
            hidden: true,
            validation: { required: 'This should never fire when hidden' },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    // A hidden field is only mounted/required once an event reveals it, so the
    // headless deriver must not over-require it on an absent config.
    expect(schema.safeParse({}).success).toBe(true)
  })

  test('accepts specialized field variants in one Sections (union widening)', () => {
    // Regression guard for the `Fields` union: a JSON form mixes the base
    // `Field` with the specialized variants — `Input` carrying `advanced.length`
    // (a `textarea`), `Select` carrying `source` + `advanced.options`, a `List`
    // and a `Column`. The `: Sections` annotation makes this a COMPILE guard
    // too: before the union was widened, a leaf like a `textarea` with
    // `advanced.length` failed the weak-type "no properties in common" check
    // against the base `Field` alone.
    const sections: Sections = [
      {
        advanced: { compact: true },
        fields: [
          {
            // `data`/`aria` are authored with BARE keys (the runtime prefixes
            // `data-`/`aria-`), so this also guards the `DataAttributes` /
            // `AriaAttributes` shape.
            advanced: {
              length: { max: 500 },
              data: { testid: 'notes-input' },
              aria: { label: 'Release notes' },
            },
            name: 'notes',
            type: 'textarea',
            required: true,
            validation: { required: 'Release notes are required' },
          },
          {
            type: 'column',
            fields: [
              {
                advanced: { options: { label: 'name', value: 'id' } },
                name: 'category',
                type: 'select',
                source: [{ id: 'a', name: 'Alpha' }],
                required: true,
                validation: { required: 'Pick a category' },
              },
            ],
          },
          {
            advanced: { length: { min: 1 } },
            name: 'items',
            type: 'list',
            fields: [{ name: 'label', type: 'input', required: true }],
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(
      schema.safeParse({
        notes: 'shipped',
        category: 'a',
        items: [{ label: 'x' }],
      }).success
    ).toBe(true)

    // A missing required leaf still fails, proving the widened union did not
    // loosen the derived schema.
    const missing = schema.safeParse({
      notes: '',
      category: '',
      items: [{ label: 'x' }],
    })
    expect(missing.success).toBe(false)
    if (!missing.success) {
      const paths = collectIssues(missing.error).map((issue) => issue.path)
      expect(paths).toContain('notes')
      expect(paths).toContain('category')
    }
  })

  describe('list length messages', () => {
    const sections: Sections = [
      {
        fields: [
          {
            advanced: { length: { min: 2, max: 3 } },
            name: 'items',
            type: 'list',
            fields: [{ name: 'label', type: 'input' }],
            validation: {
              length: { min: 'items_min', max: 'items_max' },
            },
          },
        ],
      },
    ]

    function messagesFor(translations?: Record<string, string>) {
      const schema = buildFormSchema(sections, translations)
      const result = schema.safeParse({ items: [{ label: 'x' }] })

      expect(result.success).toBe(false)
      return result.success
        ? []
        : collectIssues(result.error).map((issue) => issue.message)
    }

    test('should resolve the message against the dictionary', () => {
      expect(messagesFor({ items_min: 'Agrega al menos dos' })).toContain(
        'Agrega al menos dos'
      )
    })

    test('should keep the key when there is no dictionary', () => {
      expect(messagesFor()).toContain('items_min')
    })

    test('should keep the key when it is missing from the dictionary', () => {
      expect(messagesFor({ other_key: 'Otro' })).toContain('items_min')
    })
  })
})

// The server validates with the same schema the form submits through, so a day
// comes out of it as `yyyy-MM-dd` and a `$ref` into context reads what the host
// passed, exactly as on the client.
describe('buildFormSchema with dates and context', () => {
  test('returns a date as yyyy-MM-dd whatever shape it was stored in', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'check_in',
            type: 'input/date',
            advanced: { format: 'dd/MM/yyyy' },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.parse({ check_in: '15/06/2024' })).toEqual({
      check_in: '2024-06-15',
    })
    expect(schema.parse({ check_in: '2024-06-15' })).toEqual({
      check_in: '2024-06-15',
    })
  })

  test('resolves a $ref into the context it is given', () => {
    const sections = [
      { fields: [{ $ref: '#/context/fields.email' }] },
    ] as unknown as Sections
    const context = {
      fields: { email: { name: 'email', type: 'input/email', required: true } },
    }

    const result = buildFormSchema(
      sections,
      undefined,
      undefined,
      context
    ).safeParse({})

    expect(result.success).toBe(false)
    expect(collectIssues(result.error!).map((issue) => issue.path)).toEqual([
      'email',
    ])
  })

  test('validates nothing that only a missing context would have declared', () => {
    const sections = [
      { fields: [{ $ref: '#/context/fields.email' }] },
    ] as unknown as Sections

    expect(buildFormSchema(sections).safeParse({}).success).toBe(true)
  })

  // The two hidden inputs a range is submitted with arrive as an array.
  test('checks a range against the reserved days the host passes', () => {
    const sections = [
      {
        fields: [
          {
            name: 'stay',
            type: 'input/date',
            advanced: { mode: 'range', reserved: { $ref: '#/context/booked' } },
            validation: { reserved: 'A night in it is taken' },
          },
        ],
      },
    ] as unknown as Sections
    const schema = buildFormSchema(sections, undefined, undefined, {
      booked: ['2026-12-24'],
    })

    expect(
      collectIssues(
        schema.safeParse({ stay: ['2026-12-20', '2026-12-27'] }).error!
      )
    ).toEqual([{ path: 'stay', message: 'A night in it is taken' }])
    expect(schema.parse({ stay: ['2026-12-25', '2026-12-27'] })).toEqual({
      stay: ['2026-12-25', '2026-12-27'],
    })
  })

  // What is booked is the host's to know, at the moment it validates.
  describe('reserved days the host passes in context', () => {
    const form = () =>
      [
        {
          fields: [
            {
              name: 'night',
              type: 'input/date',
              advanced: { reserved: { $ref: '#/context/booked' } },
              validation: { reserved: 'That night is taken' },
            },
          ],
        },
      ] as unknown as Sections

    test('holds back a day the list holds', () => {
      const schema = buildFormSchema(form(), undefined, undefined, {
        booked: ['2026-12-24', '2026-12-25'],
      })

      expect(
        collectIssues(schema.safeParse({ night: '2026-12-24' }).error!)
      ).toEqual([{ path: 'night', message: 'That night is taken' }])
      expect(schema.parse({ night: '2026-12-23' })).toEqual({
        night: '2026-12-23',
      })
    })

    // A host may keep one list and add to it as nights are booked. Each request
    // hands over a new context, and the schema checks the list as it is then:
    // the night booked a moment ago is not taken twice.
    test('checks the list as the host holds it at each request', () => {
      const booked = ['2026-12-24']
      const request = () =>
        buildFormSchema(form(), undefined, undefined, { booked }).safeParse({
          night: '2026-12-26',
        }).success

      expect(request()).toBe(true)
      booked.push('2026-12-26')
      expect(request()).toBe(false)
    })

    // A server that forgot its `context` cannot tell a booked night from a
    // free one, so it takes none: letting them all through would let a booked
    // night be booked again, with nothing to say so in production.
    test('holds back every night when the context does not hold the list', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        const schema = buildFormSchema(form())

        expect(
          collectIssues(schema.safeParse({ night: '2026-12-23' }).error!)
        ).toEqual([{ path: 'night', message: 'This date cannot be checked' }])
        expect(schema.parse({})).toEqual({})
        expect(warn).toHaveBeenCalledTimes(1)
      } finally {
        warn.mockRestore()
      }
    })
  })

  // The same for a year: the host says which years a field offers, and the
  // server checks the ones it was told.
  describe('years the host passes in context', () => {
    const form = () =>
      [
        {
          fields: [
            {
              name: 'expiry',
              type: 'select/year',
              advanced: {
                length: {
                  min: { $ref: '#/context/years.current' },
                  max: { $ref: '#/context/years.last' },
                },
              },
            },
          ],
        },
      ] as unknown as Sections

    test('holds back a year outside the ones the context gives', () => {
      const schema = buildFormSchema(form(), undefined, undefined, {
        years: { current: 2026, last: 2031 },
      })

      expect(schema.parse({ expiry: '2028' })).toEqual({ expiry: 2028 })
      expect(schema.safeParse({ expiry: '2025' }).success).toBe(false)
      expect(schema.safeParse({ expiry: '2032' }).success).toBe(false)
    })
  })

  // The library keeps no clock: the host says what today is, and a bound reads
  // it from context, the same on the server as in the browser.
  describe('a bound the host passes in context', () => {
    // A new definition for each test: a bound is named once for the object
    // that declares it.
    const form = () =>
      [
        {
          fields: [
            {
              name: 'check_in',
              type: 'input/date',
              advanced: { length: { min: { $ref: '#/context/today' } } },
              validation: { length: { min: 'Pick today or a later day' } },
            },
          ],
        },
      ] as unknown as Sections

    const warnings = (warn: { mock: { calls: unknown[][] } }) =>
      warn.mock.calls.map((call) => call.slice(1).join(' '))

    test('holds back a day before it', () => {
      const schema = buildFormSchema(form(), undefined, undefined, {
        today: '2026-10-03',
      })

      expect(schema.parse({ check_in: '2026-10-03' })).toEqual({
        check_in: '2026-10-03',
      })
      expect(
        collectIssues(schema.safeParse({ check_in: '2026-10-02' }).error!)
      ).toEqual([{ path: 'check_in', message: 'Pick today or a later day' }])
    })

    test('holds back every day when the context does not hold it', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        expect(
          buildFormSchema(form()).safeParse({ check_in: '2099-01-01' }).success
        ).toBe(false)
      } finally {
        warn.mockRestore()
      }
    })

    // A host's context is JavaScript, and the day may not be known yet.
    test('holds back every day, and is named, when the context holds nothing there', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        const schema = buildFormSchema(form(), undefined, undefined, {
          today: undefined,
        })

        expect(schema.safeParse({ check_in: '2099-01-01' }).success).toBe(false)
        expect(warnings(warn)).toEqual([
          'check_in: advanced.length.min points at #/context/today, which nothing resolved, so the field takes no day',
        ])
      } finally {
        warn.mockRestore()
      }
    })

    // Each request builds the schema again, from a copy of every optional
    // field: the bound is named once all the same.
    test('is named once however many times the schema is built', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        const sections = form()
        for (let request = 0; request < 3; request++) {
          buildFormSchema(sections)
        }

        expect(warn).toHaveBeenCalledTimes(1)
      } finally {
        warn.mockRestore()
      }
    })
  })
})
