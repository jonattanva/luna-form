import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe(
  'Date form submission - default format (MMMM d, yyyy)',
  { tag: ['@e2e'] },
  () => {
    test('should submit value in yyyy-MM-dd format after user input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "sections": [{
          "fields": [{
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

    test('should submit initial MMMM d, yyyy value in yyyy-MM-dd format', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": { "birth_date": "June 15, 2024" },
        "sections": [{
          "fields": [{
            "label": "Birth Date",
            "name": "birth_date",
            "required": true,
            "type": "input/date"
          }]
        }]
      }`
      )
      await page.goto('')

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-06-15"'
      )
    })

    test('should submit updated value in yyyy-MM-dd format after modification', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": { "birth_date": "January 1, 2024" },
        "sections": [{
          "fields": [{
            "label": "Birth Date",
            "name": "birth_date",
            "required": true,
            "type": "input/date"
          }]
        }]
      }`
      )
      await page.goto('')

      await page.locator('input[name="birth_date"]').fill('2024-09-20')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-09-20"'
      )
    })
  }
)
