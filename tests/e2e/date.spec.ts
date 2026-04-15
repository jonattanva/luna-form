import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Date input format', { tag: ['@e2e'] }, () => {
  test.describe('initial value', () => {
    test('should display initial MMMM d, yyyy value in the input', async ({
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

      await expect(page.locator('input[name="birth_date"]')).toHaveValue(
        'June 15, 2024'
      )
    })

    test('should display initial MM/dd/yyyy value in the input', async ({
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

      await expect(page.locator('input[name="birth_date"]')).toHaveValue(
        '06/15/2024'
      )
    })

    test('should display initial dd/MM/yyyy value in the input', async ({
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

      await expect(page.locator('input[name="birth_date"]')).toHaveValue(
        '15/06/2024'
      )
    })

    test('should display first day of year (January 1, 2024) in the input', async ({
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
              "type": "input/date"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="birth_date"]')).toHaveValue(
        'January 1, 2024'
      )
    })

    test('should display last day of year (December 31, 2024) in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "December 31, 2024" },
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

      await expect(page.locator('input[name="birth_date"]')).toHaveValue(
        'December 31, 2024'
      )
    })
  })

  test.describe('form submission (default MMMM d, yyyy format)', () => {
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
  })

  test.describe('form submission (MM/dd/yyyy display format)', () => {
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
  })

  test.describe('form submission (dd/MM/yyyy display format)', () => {
    test('should submit value in yyyy-MM-dd format', async ({ page }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "dd/MM/yyyy" },
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
  })

  test.describe('form submission (explicit MMMM d, yyyy display format)', () => {
    test('should display initial MMMM d, yyyy value in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "April 15, 2026" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "MMMM d, yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="birth_date"]')).toHaveValue(
        'April 15, 2026'
      )
    })

    test('should submit value in yyyy-MM-dd format', async ({ page }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "MMMM d, yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "required": true,
              "type": "input/date"
            }]
          }]
        }`
      )
      await page.goto('')

      await page.locator('input[name="birth_date"]').fill('2026-04-15')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2026-04-15"'
      )
    })
  })

  test.describe('calendar picker interaction', () => {
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

  test.describe('typing display format directly', () => {
    test('should submit MMMM d, yyyy typed value in yyyy-MM-dd format', async ({
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

      await page.locator('input[name="birth_date"]').fill('June 15, 2024')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-06-15"'
      )
    })

    test('should submit MM/dd/yyyy typed value in yyyy-MM-dd format', async ({
      page,
    }) => {
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

      await page.locator('input[name="birth_date"]').fill('06/15/2024')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-06-15"'
      )
    })

    test('should submit dd/MM/yyyy typed value in yyyy-MM-dd format', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "dd/MM/yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "required": true,
              "type": "input/date"
            }]
          }]
        }`
      )
      await page.goto('')

      await page.locator('input[name="birth_date"]').fill('15/06/2024')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-06-15"'
      )
    })
  })

  test.describe('form submission (initial value without modification)', () => {
    test('should submit initial MM/dd/yyyy value in yyyy-MM-dd format', async ({
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

    test('should submit initial dd/MM/yyyy value in yyyy-MM-dd format', async ({
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
  })

  test.describe('form submission (yyyy-MM-dd display format)', () => {
    test('should display initial value in yyyy-MM-dd format', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "2024-06-15" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "yyyy-MM-dd" },
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="birth_date"]')).toHaveValue(
        '2024-06-15'
      )
    })

    test('should submit yyyy-MM-dd typed value in yyyy-MM-dd format', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "yyyy-MM-dd" },
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

    test('should submit initial yyyy-MM-dd value without modification', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "2024-06-15" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "yyyy-MM-dd" },
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
  })

  test.describe('required validation', () => {
    test('should show error when submitting empty required date field', async ({
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
              "type": "input/date",
              "validation": {
                "required": "Date is required"
              }
            }]
          }]
        }`
      )
      await page.goto('')

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Date is required')).toBeVisible()
    })
  })

  test.describe('edge cases', () => {
    test('should display February 29 of a leap year', async ({ page }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "February 29, 2024" },
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

      await expect(page.locator('input[name="birth_date"]')).toHaveValue(
        'February 29, 2024'
      )
    })

    test('should submit February 29 of a leap year in yyyy-MM-dd format', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "February 29, 2024" },
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
        '"birth_date": "2024-02-29"'
      )
    })
  })
})
