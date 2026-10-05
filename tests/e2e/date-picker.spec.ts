import { expect, test } from '@playwright/test'
import { inject } from './support/inject'
import { captureValueChanges, lastEventFor } from './support/value-changes'

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

  // The component runs the form's blur as well as its own, so a date is checked
  // when the user leaves it, like any other field. It used to run only its own.
  test('should validate a required date when the user leaves it', async ({
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
              "validation": { "required": "This field is required" }
            }]
          }]
        }`
    )
    await page.goto('')

    const input = page.locator('input[name="birth_date"]')
    await input.fill('')
    await input.blur()

    await expect(
      page.getByText('This field is required', { exact: true })
    ).toBeVisible()
  })

  // A year is four digits: one half typed is text the field keeps as typed,
  // and the form says it is no day, rather than read the year 2 into it.
  test('should keep a year that is not four digits as typed and reject it', async ({
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
              "type": "input/date",
              "validation": { "date": "Not a day" }
            }]
          }]
        }`
    )
    await page.goto('')

    const input = page.locator('input[name="birth_date"]')
    await input.fill('15/06/2')
    await input.blur()

    await expect(input).toHaveValue('15/06/2')
    await expect(page.getByText('Not a day', { exact: true })).toBeVisible()
  })

  // The host is told the day as `yyyy-MM-dd`, the shape it can hand back: on
  // `/reactive` it does, and the field still shows the day in its format.
  test('should report the picked day to the host as yyyy-MM-dd', async ({
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
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Select date' }).click()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()

    await expect
      .poll(() => lastEventFor(events, 'birth_date'))
      .toMatchObject({ name: 'birth_date', value: '2024-06-20' })
    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      'June 20, 2024'
    )
  })
})
