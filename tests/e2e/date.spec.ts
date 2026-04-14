import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Date input format', { tag: ['@e2e'] }, () => {
  test.describe('initial value', () => {
    test('should display initial yyyy-MM-dd value as native yyyy-MM-dd in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "2024-06-15" },
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
        '2024-06-15'
      )
    })

    test('should display initial MM/dd/yyyy value as native yyyy-MM-dd in the input', async ({
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
        '2024-06-15'
      )
    })

    test('should display initial dd/MM/yyyy value as native yyyy-MM-dd in the input', async ({
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
        '2024-06-15'
      )
    })

    test('should display first day of year (2024-01-01) as 2024-01-01 in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "2024-01-01" },
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
        '2024-01-01'
      )
    })

    test('should display last day of year (2024-12-31) as 2024-12-31 in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "2024-12-31" },
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
        '2024-12-31'
      )
    })
  })

  test.describe('form submission (yyyy-MM-dd format)', () => {
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

    test('should submit initial yyyy-MM-dd value without modification', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "2024-06-15" },
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

    test('should update yyyy-MM-dd value after modification and submit', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "birth_date": "2024-01-01" },
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
    test('should submit value in native yyyy-MM-dd format regardless of display format', async ({
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

      await page.locator('input[name="birth_date"]').fill('2024-06-15')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-06-15"'
      )
    })
  })

  test.describe('form submission (dd/MM/yyyy display format)', () => {
    test('should submit value in native yyyy-MM-dd format regardless of display format', async ({
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

      await page.locator('input[name="birth_date"]').fill('2024-06-15')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"birth_date": "2024-06-15"'
      )
    })
  })
})
