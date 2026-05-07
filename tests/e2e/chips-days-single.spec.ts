import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const SCHEMA_SINGLE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Days",
          "name": "days",
          "type": "chips/day",
          "advanced": { "multiple": false }
        }
      ]
    }
  ]
}`

test.describe('Chips days form - single selection', { tag: ['@e2e'] }, () => {
  test('should select a day on click', async ({ page }) => {
    await inject(page, SCHEMA_SINGLE)
    await page.goto('')

    const dayButtons = page.locator('button[type="button"]')
    const monday = dayButtons.nth(1)

    await expect(monday).not.toHaveClass(/bg-violet-600/)

    await monday.click()

    await expect(monday).toHaveClass(/bg-violet-600/)
  })

  test('should deselect the active day when clicked again', async ({
    page,
  }) => {
    await inject(page, SCHEMA_SINGLE)
    await page.goto('')

    const dayButtons = page.locator('button[type="button"]')
    const monday = dayButtons.nth(1)

    await monday.click()
    await expect(monday).toHaveClass(/bg-violet-600/)

    await monday.click()
    await expect(monday).not.toHaveClass(/bg-violet-600/)
  })

  test('should replace the selection when clicking a different day', async ({
    page,
  }) => {
    await inject(page, SCHEMA_SINGLE)
    await page.goto('')

    const dayButtons = page.locator('button[type="button"]')
    const monday = dayButtons.nth(1)
    const friday = dayButtons.nth(5)

    await monday.click()
    await expect(monday).toHaveClass(/bg-violet-600/)

    await friday.click()
    await expect(monday).not.toHaveClass(/bg-violet-600/)
    await expect(friday).toHaveClass(/bg-violet-600/)
  })

  test('should submit with at most one selected day', async ({ page }) => {
    await inject(page, SCHEMA_SINGLE)
    await page.goto('')

    const dayButtons = page.locator('button[type="button"]')

    await dayButtons.nth(1).click()
    await dayButtons.nth(5).click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"days"')
    await expect(page.locator('pre code')).toContainText('"5"')
    await expect(page.locator('pre code')).not.toContainText('"1"')
  })
})
