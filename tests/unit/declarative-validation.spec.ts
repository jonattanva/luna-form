import {
  buildFormSchema,
  collectIssues,
} from '@/packages/luna-core/src/util/schema'
import { describe, expect, test } from 'vitest'
import type { Sections } from '@/packages/luna-core/src/type'

describe('declarative validation vocabulary', () => {
  test('requiredWhen makes a field required only when the condition holds', () => {
    const sections: Sections = [
      {
        fields: [
          { name: 'authType', type: 'select' },
          {
            name: 'token',
            type: 'input',
            validation: {
              requiredWhen: {
                field: 'authType',
                operator: 'eq',
                value: 'bearer',
                message: 'Provide the access token',
              },
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ authType: 'none' }).success).toBe(true)
    expect(schema.safeParse({ authType: 'bearer', token: 'abc' }).success).toBe(
      true
    )

    const missing = schema.safeParse({ authType: 'bearer' })
    expect(missing.success).toBe(false)
    if (!missing.success) {
      expect(collectIssues(missing.error)).toContainEqual({
        path: 'token',
        message: 'Provide the access token',
      })
    }
  })

  test('requiredWhen with multiple rules ORs the conditions', () => {
    const sections: Sections = [
      {
        fields: [
          { name: 'authType', type: 'select' },
          {
            name: 'secret',
            type: 'input',
            validation: {
              requiredWhen: [
                { field: 'authType', operator: 'eq', value: 'basic' },
                { field: 'authType', operator: 'eq', value: 'oauth2' },
              ],
              required: 'Secret is required',
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)
    expect(schema.safeParse({ authType: 'none' }).success).toBe(true)
    expect(schema.safeParse({ authType: 'basic' }).success).toBe(false)
    expect(schema.safeParse({ authType: 'oauth2' }).success).toBe(false)
  })

  test('requiredWhen resolves the condition field in item scope inside lists', () => {
    // conditional-shaped: value is required unless operator is truthy/exists.
    const sections = [
      {
        fields: [
          {
            name: 'rules',
            type: 'list',
            fields: [
              {
                name: 'operator',
                type: 'select',
              },
              {
                name: 'value',
                type: 'input',
                validation: {
                  requiredWhen: {
                    field: 'operator',
                    operator: 'nin',
                    value: ['truthy', 'exists'],
                    message: 'Enter the value to compare against',
                  },
                },
              },
            ],
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections as unknown as Sections)

    expect(
      schema.safeParse({ rules: [{ operator: 'truthy', value: '' }] }).success
    ).toBe(true)

    const missing = schema.safeParse({
      rules: [{ operator: 'eq', value: '' }],
    })
    expect(missing.success).toBe(false)
    if (!missing.success) {
      expect(collectIssues(missing.error)).toContainEqual({
        path: 'rules.0.value',
        message: 'Enter the value to compare against',
      })
    }
  })

  test('pattern validates format and honors allowInterpolation', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'url',
            type: 'input',
            validation: {
              pattern: {
                regex: '^https?://',
                allowInterpolation: true,
                message: 'Web address must start with http:// or https://',
              },
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ url: 'https://example.com' }).success).toBe(true)
    expect(schema.safeParse({ url: '' }).success).toBe(true) // empty is required's job
    expect(schema.safeParse({ url: 'https://{host}/path' }).success).toBe(true)
    expect(schema.safeParse({ url: 'ftp://example.com' }).success).toBe(false)
  })

  test('list length.min enforces a minimum number of items', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'rules',
            type: 'list',
            advanced: { length: { min: 1 } },
            validation: {
              length: { min: 'Add at least one condition' },
            },
            fields: [{ name: 'label', type: 'input' }],
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ rules: [{ label: 'a' }] }).success).toBe(true)

    const empty = schema.safeParse({ rules: [] })
    expect(empty.success).toBe(false)
    if (!empty.success) {
      expect(collectIssues(empty.error)).toContainEqual({
        path: 'rules',
        message: 'Add at least one condition',
      })
    }
  })

  test('rules DSL: oneOf whitelists a value', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'operator',
            type: 'select',
            validation: {
              rules: [
                {
                  assert: 'oneOf',
                  value: ['eq', 'neq', 'gt'],
                  message: 'Choose a valid operator',
                },
              ],
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)
    expect(schema.safeParse({ operator: 'eq' }).success).toBe(true)
    expect(schema.safeParse({ operator: 'like' }).success).toBe(false)
  })

  test('rules DSL: a when-gated assertion only fires when the gate holds', () => {
    const sections: Sections = [
      {
        fields: [
          { name: 'kind', type: 'select' },
          {
            name: 'port',
            type: 'input/number',
            validation: {
              rules: [
                {
                  when: { field: 'kind', operator: 'eq', value: 'custom' },
                  assert: 'required',
                  message: 'Port is required for custom connections',
                },
              ],
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)
    expect(schema.safeParse({ kind: 'default' }).success).toBe(true)
    expect(schema.safeParse({ kind: 'custom' }).success).toBe(false)
    expect(schema.safeParse({ kind: 'custom', port: 8080 }).success).toBe(true)
  })

  test('requiredWhen treats a whitespace-only value as empty (hasValue trims)', () => {
    // A `radio` value is not trimmed by getSchema, so the whitespace reaches
    // hasValue intact and exercises its own trim.
    const sections: Sections = [
      {
        fields: [
          { name: 'trigger', type: 'select' },
          {
            name: 'answer',
            type: 'radio',
            validation: {
              requiredWhen: {
                field: 'trigger',
                operator: 'eq',
                value: 'yes',
                message: 'Answer is required',
              },
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    // Condition not met -> whitespace is fine.
    expect(schema.safeParse({ trigger: 'no', answer: '   ' }).success).toBe(
      true
    )

    // Condition met + whitespace-only -> treated as empty -> required fires.
    const blank = schema.safeParse({ trigger: 'yes', answer: '   ' })
    expect(blank.success).toBe(false)
    if (!blank.success) {
      expect(collectIssues(blank.error)).toContainEqual({
        path: 'answer',
        message: 'Answer is required',
      })
    }

    expect(schema.safeParse({ trigger: 'yes', answer: 'ok' }).success).toBe(
      true
    )
  })

  test('new operators: truthy gate drives a requiredWhen', () => {
    const sections: Sections = [
      {
        fields: [
          { name: 'enabled', type: 'select/active' },
          {
            name: 'endpoint',
            type: 'input',
            validation: {
              requiredWhen: {
                field: 'enabled',
                operator: 'truthy',
                message: 'Endpoint is required when enabled',
              },
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)
    expect(schema.safeParse({ enabled: false }).success).toBe(true)
    expect(schema.safeParse({ enabled: true }).success).toBe(false)
    expect(
      schema.safeParse({ enabled: true, endpoint: 'https://x' }).success
    ).toBe(true)
  })

  test('new operators: empty gates an all-clause "at least one secret" rule', () => {
    // The webhook secret case: `secretKey` is required when security uses a
    // secret key AND no persisted `secretKeyPrefix` marker is present. After
    // save the prefix stands in for the (cleared) plaintext key, so the `empty`
    // gate goes false and the requirement lifts.
    const sections: Sections = [
      {
        fields: [
          { name: 'security', type: 'select' },
          { name: 'secretKeyPrefix', type: 'input', hidden: true },
          {
            name: 'secretKey',
            type: 'input',
            validation: {
              rules: [
                {
                  when: {
                    all: [
                      {
                        field: 'security',
                        operator: 'eq',
                        value: 'with-secret-key',
                      },
                      { field: 'secretKeyPrefix', operator: 'empty' },
                    ],
                  },
                  assert: 'required',
                  message: 'Enter the secret key to sign or verify your data',
                },
              ],
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    // Security off -> no secret needed.
    expect(schema.safeParse({ security: 'none' }).success).toBe(true)

    // Security on, no prefix and no key -> required fires.
    const missing = schema.safeParse({ security: 'with-secret-key' })
    expect(missing.success).toBe(false)
    if (!missing.success) {
      expect(collectIssues(missing.error)).toContainEqual({
        path: 'secretKey',
        message: 'Enter the secret key to sign or verify your data',
      })
    }

    // Security on + plaintext key provided -> satisfied.
    expect(
      schema.safeParse({ security: 'with-secret-key', secretKey: 's3cret' })
        .success
    ).toBe(true)

    // Security on + persisted prefix (post-save) -> `empty` false, rule lifts.
    expect(
      schema.safeParse({ security: 'with-secret-key', secretKeyPrefix: 'whk_' })
        .success
    ).toBe(true)
  })

  test('requiredWhen on nested (dotted) fields validates the nested config', () => {
    // The web-request auth case: hidden nested credentials required only for the
    // chosen authType, matching against the nested config the runtime persists.
    const sections: Sections = [
      {
        fields: [
          { name: 'authType', type: 'select' },
          {
            name: 'basicAuth.username',
            type: 'input',
            hidden: true,
            validation: {
              requiredWhen: {
                field: 'authType',
                operator: 'eq',
                value: 'basic',
              },
              required: 'Username is required for Basic Auth',
            },
          },
          {
            name: 'basicAuth.password',
            type: 'input',
            hidden: true,
            validation: {
              requiredWhen: {
                field: 'authType',
                operator: 'eq',
                value: 'basic',
              },
              required: 'Password is required for Basic Auth',
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    // No auth -> the whole nested group is absent -> valid.
    expect(schema.safeParse({ authType: 'none' }).success).toBe(true)

    // basic + only username -> password fires with the NESTED path and the
    // form.json message.
    const partial = schema.safeParse({
      authType: 'basic',
      basicAuth: { username: 'u' },
    })
    expect(partial.success).toBe(false)
    if (!partial.success) {
      expect(collectIssues(partial.error)).toContainEqual({
        path: 'basicAuth.password',
        message: 'Password is required for Basic Auth',
      })
    }

    expect(
      schema.safeParse({
        authType: 'basic',
        basicAuth: { username: 'u', password: 'p' },
      }).success
    ).toBe(true)
  })

  test('pattern allowInterpolation also exempts @-reference expressions', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'url',
            type: 'input/expression',
            validation: {
              pattern: {
                regex: '^https?://',
                allowInterpolation: true,
                message: 'Web address must start with http:// or https://',
              },
            },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ url: 'https://api.example.com' }).success).toBe(
      true
    )
    // `@`-references are resolved at run time, so the scheme check is skipped.
    expect(schema.safeParse({ url: '@Trigger.url' }).success).toBe(true)
    expect(schema.safeParse({ url: 'example.com' }).success).toBe(false)
  })
})
