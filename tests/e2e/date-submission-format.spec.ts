import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

// A person types the day the way the field shows it. Typed as `yyyy-MM-dd`,
// the form would read it before looking at the format, and the format would
// not be tested at all.
const FORMATS = [
  { format: 'dd/MM/yyyy', typed: '15/06/2024' },
  { format: 'MM/dd/yyyy', typed: '06/15/2024' },
]

test.describe('Date form submission - typed format', { tag: ['@e2e'] }, () => {
  for (const { format, typed } of FORMATS) {
    test(`should submit ${typed} typed in ${format} as yyyy-MM-dd`, async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "${format}" },
              "label": "Birth Date",
              "name": "birth_date",
              "required": true,
              "type": "input/date"
            }]
          }]
        }`
      )
      await page.goto('')

      const input = page.locator('input[name="birth_date"]')
      await expect(input).toBeVisible()

      await input.fill(typed)
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-06-15"'
      )
    })
  }
})
