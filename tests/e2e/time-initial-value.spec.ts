import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Time initial value', { tag: ['@e2e'] }, () => {
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
