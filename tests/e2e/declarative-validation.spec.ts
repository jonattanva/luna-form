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
})
