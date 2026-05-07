import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Date calendar picker interaction', { tag: ['@e2e'] }, () => {
  test('should open calendar when clicking the calendar button', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [{
            "fields": [{
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
  })

  test('should update input to MMMM d, yyyy after calendar selection', async ({
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
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()

    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      'June 20, 2024'
    )
  })

  test('should submit yyyy-MM-dd after calendar selection (MMMM d, yyyy display)', async ({
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

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"birth_date": "2024-06-20"'
    )
  })

  test('should update input to MM/dd/yyyy after calendar selection', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "06/15/2024" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "MM/dd/yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()

    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      '06/20/2024'
    )
  })

  test('should update input to dd/MM/yyyy after calendar selection', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "15/06/2024" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "dd/MM/yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()

    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      '20/06/2024'
    )
  })
})
