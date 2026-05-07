import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Time form submission', { tag: ['@e2e'] }, () => {
  test('should submit value in HH:mm format after user input', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [{
          "fields": [{
            "label": "Start Time",
            "name": "start_time",
            "required": true,
            "type": "input/time"
          }]
        }]
      }`
    )
    await page.goto('')

    await page.locator('input[name="start_time"]').fill('14:30')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"start_time": "14:30:00"'
    )
  })

  test('should submit value in hh:mm a format after user input', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [{
          "fields": [{
            "advanced": { "format": "hh:mm a" },
            "label": "Start Time",
            "name": "start_time",
            "required": true,
            "type": "input/time"
          }]
        }]
      }`
    )
    await page.goto('')

    await page.locator('input[name="start_time"]').fill('14:30')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"start_time": "14:30:00"'
    )
  })

  test('should submit value in hh:mm:ss a format after user input', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [{
          "fields": [{
            "advanced": { "format": "hh:mm:ss a" },
            "label": "Start Time",
            "name": "start_time",
            "required": true,
            "type": "input/time"
          }]
        }]
      }`
    )
    await page.goto('')

    await page.locator('input[name="start_time"]').fill('14:30')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"start_time": "14:30:00"'
    )
  })
})
