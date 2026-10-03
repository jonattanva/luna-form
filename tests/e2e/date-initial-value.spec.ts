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

  // What the form submits is `yyyy-MM-dd`, so a host that keeps it and passes
  // it back has to see the same day, in the field's own format. It used to see
  // an empty field.
  test('should display a yyyy-MM-dd value from the host in the field format', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "2024-06-15" },
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

  // A host can still hold a day the way it used to be shown. The field holds
  // it as `yyyy-MM-dd` like any other day, so what reads the value -- here a
  // description -- sees the shape it sees once the user has typed.
  test('should hold a host value in the display format as yyyy-MM-dd', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "June 15, 2024" },
          "sections": [{
            "fields": [{
              "description": "Held as {value}",
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await expect(page.getByText('Held as 2024-06-15')).toBeVisible()
    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      'June 15, 2024'
    )
  })
})
