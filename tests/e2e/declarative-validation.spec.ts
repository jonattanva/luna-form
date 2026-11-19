import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

// End-to-end coverage for the declarative validation vocabulary as it flows
// through the rendered <Form> submit path (buildSchema -> applyDeclarativeRules):
// requiredWhen and pattern, at the top level and in a list's rows. List length
// is covered headlessly (unit).
test.describe('Declarative validation', { tag: ['@e2e'] }, () => {
  test('requiredWhen shows the error when the condition holds', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Mode",
                "name": "mode",
                "type": "input/text",
                "required": true
              },
              {
                "label": "Token",
                "name": "token",
                "type": "input/text",
                "validation": {
                  "requiredWhen": {
                    "field": "mode",
                    "operator": "eq",
                    "value": "advanced",
                    "message": "Token is required in advanced mode"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.locator('input[name="mode"]').fill('advanced')
    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Token is required in advanced mode', {
      exact: true,
    })
    await expect(message).toBeVisible()
  })

  test('requiredWhen stays silent when the condition does not hold', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Mode",
                "name": "mode",
                "type": "input/text",
                "required": true
              },
              {
                "label": "Token",
                "name": "token",
                "type": "input/text",
                "validation": {
                  "requiredWhen": {
                    "field": "mode",
                    "operator": "eq",
                    "value": "advanced",
                    "message": "Token is required in advanced mode"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.locator('input[name="mode"]').fill('basic')
    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Token is required in advanced mode', {
      exact: true,
    })
    await expect(message).toHaveCount(0)
  })

  test('pattern shows the error for an invalid format', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "URL",
                "name": "url",
                "type": "input/text",
                "validation": {
                  "pattern": {
                    "regex": "^https?://",
                    "allowInterpolation": true,
                    "message": "URL must start with http:// or https://"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.locator('input[name="url"]').fill('ftp://example.com')
    await page.locator('button[type="submit"]').click()

    const message = page.getByText('URL must start with http:// or https://', {
      exact: true,
    })
    await expect(message).toBeVisible()
  })

  test('pattern passes for a valid format', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "URL",
                "name": "url",
                "type": "input/text",
                "validation": {
                  "pattern": {
                    "regex": "^https?://",
                    "allowInterpolation": true,
                    "message": "URL must start with http:// or https://"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.locator('input[name="url"]').fill('https://example.com')
    await page.locator('button[type="submit"]').click()

    const message = page.getByText('URL must start with http:// or https://', {
      exact: true,
    })
    await expect(message).toHaveCount(0)
  })

  test('pattern is bypassed for an interpolation template', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "URL",
                "name": "url",
                "type": "input/text",
                "validation": {
                  "pattern": {
                    "regex": "^https?://",
                    "allowInterpolation": true,
                    "message": "URL must start with http:// or https://"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.locator('input[name="url"]').fill('{step.url}')
    await page.locator('button[type="submit"]').click()

    const message = page.getByText('URL must start with http:// or https://', {
      exact: true,
    })
    await expect(message).toHaveCount(0)
  })

  // A pattern that does not compile threw out of the submit, and React took
  // the whole form down with it. It holds the value back with its message now.
  test('a pattern that does not compile shows its message and keeps the form', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Code",
                "name": "code",
                "type": "input/text",
                "validation": {
                  "pattern": {
                    "regex": "(",
                    "message": "Code has an invalid format"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.locator('input[name="code"]').fill('abc')
    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Code has an invalid format', {
      exact: true,
    })
    await expect(message).toBeVisible()
    await expect(page.locator('input[name="code"]')).toHaveValue('abc')
    expect(errors).toEqual([])
  })
})

// A field whose definition gives no message says why in the library's words,
// in the language of the form, as its labels and buttons already do.
test.describe(
  'Validation messages the definition does not give',
  { tag: ['@e2e'] },
  () => {
    test('should hold a submit back with messages in the language of the form', async ({
      page,
    }) => {
      await inject(
        page,
        JSON.stringify({
          lang: 'es',
          sections: [
            {
              fields: [
                {
                  label: 'Nombre',
                  name: 'name',
                  required: true,
                  type: 'input/text',
                },
                {
                  advanced: { length: { min: 3 } },
                  label: 'Código',
                  name: 'code',
                  type: 'input/text',
                },
                { label: 'Correo', name: 'email', type: 'input/email' },
              ],
            },
          ],
        })
      )
      await page.goto('')

      await page.locator('input[name="code"]').fill('ab')
      await page.locator('input[name="email"]').fill('ada')
      await page.locator('button[type="submit"]').click()

      await expect(page.locator('[id="name-error"]')).toHaveText(
        'Este campo es obligatorio'
      )
      await expect(page.locator('[id="code-error"]')).toHaveText(
        'Escribe al menos 3 caracteres'
      )
      await expect(page.locator('[id="email-error"]')).toHaveText(
        'Correo electrónico no válido'
      )
    })
  }
)

test.describe('Declarative validation in a list', { tag: ['@e2e'] }, () => {
  test('should read the requiredWhen of a row in its own row', async ({
    page,
  }) => {
    await inject(
      page,
      JSON.stringify({
        sections: [
          {
            fields: [
              { label: 'Mode', name: 'mode', type: 'input/text' },
              {
                fields: [
                  { label: 'Row mode', name: 'mode', type: 'input/text' },
                  {
                    label: 'Value',
                    name: 'value',
                    type: 'input/text',
                    validation: {
                      requiredWhen: {
                        field: 'mode',
                        message: 'Value is required in strict mode',
                        operator: 'eq',
                        value: 'strict',
                      },
                    },
                  },
                ],
                label: 'Items',
                name: 'items',
                type: 'list',
              },
            ],
          },
        ],
      })
    )
    await page.goto('/reactive')

    // The mode at the top is not the one a row reads: only the second row asks
    // for its value.
    await page.locator('input[name="mode"]').fill('strict')
    await page.getByRole('button', { name: 'Add item' }).click()
    await page.locator('input[name$=".mode"]').nth(0).fill('loose')
    await page.locator('input[name$=".mode"]').nth(1).fill('strict')
    await page.getByRole('button', { name: 'Submit' }).click()

    const message = page.getByText('Value is required in strict mode', {
      exact: true,
    })
    await expect(message).toHaveCount(1)
    await expect(page.getByText('Form submitted successfully')).toHaveCount(0)

    await page.locator('input[name$=".value"]').nth(1).fill('42')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
  })

  test('should compare a custom rule with its own row', async ({ page }) => {
    await inject(
      page,
      JSON.stringify({
        sections: [
          {
            fields: [
              {
                fields: [
                  { label: 'Value', name: 'value', type: 'input/text' },
                  {
                    label: 'Confirm',
                    name: 'confirm',
                    type: 'input/text',
                    validation: {
                      custom: { field: 'value', message: 'Does not match' },
                    },
                  },
                ],
                label: 'Items',
                name: 'items',
                type: 'list',
              },
            ],
          },
        ],
      })
    )
    await page.goto('/reactive')

    await page.locator('input[name$=".value"]').fill('42')
    await page.locator('input[name$=".confirm"]').fill('41')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(
      page.getByText('Does not match', { exact: true })
    ).toBeVisible()

    await page.locator('input[name$=".confirm"]').fill('42')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
  })
})
