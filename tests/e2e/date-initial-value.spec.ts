import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Date initial value', { tag: ['@e2e'] }, () => {
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
