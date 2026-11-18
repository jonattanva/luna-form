import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

// End-to-end coverage for the declarative validation vocabulary (Phase 1) as it
// flows through the rendered <Form> submit path (buildSchema -> applyDeclarativeRules).
// Scope: top-level requiredWhen + pattern, which the flat runtime supports.
// List-scoped requiredWhen and list length are covered headlessly (unit) and in
// luna-flow, since the flat runtime does not resolve item scope.
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
