import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

/**
 * `config.env.locale` is what a format filter formats with. A description got
 * it and a label did not, so the same placeholder produced two different
 * numbers depending on which of the two it was written in -- and the label
 * silently fell back to whatever locale was running the code, which is the
 * browser on the client and the server process on the server.
 */
test.describe('Label format filters', { tag: ['@e2e'] }, () => {
  const form = `{
    "env": {
      "locale": "es-ES",
      "amount": 1234.56
    },
    "sections": [
      {
        "fields": [
          {
            "label": "Total {env.amount | currency:EUR}",
            "name": "total",
            "type": "input/text",
            "description": "Also {env.amount | currency:EUR}"
          }
        ]
      }
    ]
  }`

  test('should format a label with the configured locale', async ({ page }) => {
    await inject(page, form)
    await page.goto('/reactive')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('1234,56')
    await expect(label).not.toContainText('1,234.56')
  })

  test('should keep formatting a description with the configured locale', async ({
    page,
  }) => {
    await inject(page, form)
    await page.goto('/reactive')

    const description = page.locator('p', { hasText: 'Also' })
    await expect(description).toContainText('1234,56')
    await expect(description).not.toContainText('1,234.56')
  })
})
