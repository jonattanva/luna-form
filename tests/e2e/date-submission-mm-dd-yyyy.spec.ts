import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe(
  'Date form submission - MM/dd/yyyy format',
  { tag: ['@e2e'] },
  () => {
    test('should submit value in yyyy-MM-dd format', async ({ page }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "MM/dd/yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "required": true,
              "type": "input/date"
            }]
          }]
        }`
      )
      await page.goto('')

      await page.locator('input[name="birth_date"]').fill('2024-06-15')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-06-15"'
      )
    })
  }
)
