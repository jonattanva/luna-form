import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Time input format', { tag: ['@e2e'] }, () => {
  test.describe('rendering', () => {
    test('should set step to 60 when no format is specified (default HH:mm)', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveAttribute(
        'step',
        '60'
      )
    })

    test('should set step to 60 for hh:mm a format', async ({ page }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "hh:mm a" },
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveAttribute(
        'step',
        '60'
      )
    })

    test('should set step to 1 for HH:mm:ss format', async ({ page }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "HH:mm:ss" },
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveAttribute(
        'step',
        '1'
      )
    })

    test('should set step to 1 for hh:mm:ss a format', async ({ page }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "hh:mm:ss a" },
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveAttribute(
        'step',
        '1'
      )
    })
  })

  test.describe('initial value', () => {
    test('should display initial HH:mm value as native HH:mm:ss in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "start_time": "14:30" },
          "sections": [{
            "fields": [{
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveValue(
        '14:30:00'
      )
    })

    test('should display initial hh:mm a value as native HH:mm:ss in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "start_time": "02:30 PM" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "hh:mm a" },
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveValue(
        '14:30:00'
      )
    })

    test('should display initial HH:mm:ss value as native HH:mm:ss in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "start_time": "14:30:45" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "HH:mm:ss" },
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveValue(
        '14:30:45'
      )
    })

    test('should display initial hh:mm:ss a value as native HH:mm:ss in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "start_time": "02:30:45 PM" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "hh:mm:ss a" },
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveValue(
        '14:30:45'
      )
    })

    test('should display initial midnight value (00:00) as 00:00:00 in the input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "start_time": "00:00" },
          "sections": [{
            "fields": [{
              "label": "Start Time",
              "name": "start_time",
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await expect(page.locator('input[name="start_time"]')).toHaveValue(
        '00:00:00'
      )
    })
  })

  test.describe('form submission (HH:mm format)', () => {
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
  })

  test.describe('form submission (hh:mm a format)', () => {
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
  })

  test.describe('form submission (hh:mm:ss a format)', () => {
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

  test.describe('form submission (HH:mm:ss format)', () => {
    test('should submit value in HH:mm:ss format after user input', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "HH:mm:ss" },
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

    test('should submit initial HH:mm:ss value without modification', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "start_time": "09:15:30" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "HH:mm:ss" },
              "label": "Start Time",
              "name": "start_time",
              "required": true,
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"start_time": "09:15:30"'
      )
    })

    test('should update HH:mm:ss value after modification and submit', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "value": { "start_time": "09:00:00" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "HH:mm:ss" },
              "label": "Start Time",
              "name": "start_time",
              "required": true,
              "type": "input/time"
            }]
          }]
        }`
      )
      await page.goto('')

      await page.locator('input[name="start_time"]').fill('18:45:30')
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText(
        '"start_time": "18:45:30"'
      )
    })
  })
})
