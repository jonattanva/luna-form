import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const SCHEMA_SINGLE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Priority",
          "name": "priority",
          "type": "chips",
          "advanced": { "multiple": false },
          "source": [
            { "label": "Low", "value": "low" },
            { "label": "Medium", "value": "med" },
            { "label": "High", "value": "high" }
          ]
        }
      ]
    }
  ]
}`

test.describe(
  'Chips with custom source - single selection',
  { tag: ['@e2e'] },
  () => {
    test('should select an option on click', async ({ page }) => {
      await inject(page, SCHEMA_SINGLE)
      await page.goto('')

      const chips = page.locator('button[type="button"]')
      const medium = chips.nth(1)

      await expect(medium).not.toHaveClass(/bg-violet-600/)

      await medium.click()

      await expect(medium).toHaveClass(/bg-violet-600/)
    })

    test('should deselect the active option when clicked again', async ({
      page,
    }) => {
      await inject(page, SCHEMA_SINGLE)
      await page.goto('')

      const chips = page.locator('button[type="button"]')
      const medium = chips.nth(1)

      await medium.click()
      await expect(medium).toHaveClass(/bg-violet-600/)

      await medium.click()
      await expect(medium).not.toHaveClass(/bg-violet-600/)
    })

    test('should replace the selection when clicking a different option', async ({
      page,
    }) => {
      await inject(page, SCHEMA_SINGLE)
      await page.goto('')

      const chips = page.locator('button[type="button"]')
      const low = chips.nth(0)
      const high = chips.nth(2)

      await low.click()
      await expect(low).toHaveClass(/bg-violet-600/)

      await high.click()
      await expect(low).not.toHaveClass(/bg-violet-600/)
      await expect(high).toHaveClass(/bg-violet-600/)
    })

    test('should submit with at most one selected value', async ({ page }) => {
      await inject(page, SCHEMA_SINGLE)
      await page.goto('')

      const chips = page.locator('button[type="button"]')

      await chips.nth(0).click()
      await chips.nth(2).click()

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText('"priority"')
      await expect(page.locator('pre code')).toContainText('"high"')
      await expect(page.locator('pre code')).not.toContainText('"low"')
    })
  }
)
