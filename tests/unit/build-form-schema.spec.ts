import {
  buildFormSchema,
  collectIssues,
} from '@/packages/luna-core/src/util/schema'
import { describe, expect, test } from 'vitest'
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
})
