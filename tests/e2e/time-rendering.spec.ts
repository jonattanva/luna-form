import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Time input rendering', { tag: ['@e2e'] }, () => {
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
