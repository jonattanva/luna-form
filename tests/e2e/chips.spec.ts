import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const SCHEMA = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Priority",
          "name": "priority",
          "type": "chips",
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

test.describe('Chips with custom source - multiple', { tag: ['@e2e'] }, () => {
  test('should render one button per source entry', async ({ page }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const chips = page.locator('button[type="button"]')

    await expect(chips).toHaveCount(3)
  })

  test('should select an option on click', async ({ page }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const chips = page.locator('button[type="button"]')
    const medium = chips.nth(1)

    await expect(medium).not.toHaveClass(/bg-violet-600/)

    await medium.click()

    await expect(medium).toHaveClass(/bg-violet-600/)
  })

  test('should deselect an option on second click', async ({ page }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const chips = page.locator('button[type="button"]')
    const medium = chips.nth(1)

    await medium.click()
    await expect(medium).toHaveClass(/bg-violet-600/)

    await medium.click()
    await expect(medium).not.toHaveClass(/bg-violet-600/)
  })

  test('should submit form with selected values', async ({ page }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const chips = page.locator('button[type="button"]')

    await chips.nth(0).click()
    await chips.nth(2).click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"priority"')
    await expect(page.locator('pre code')).toContainText('"low"')
    await expect(page.locator('pre code')).toContainText('"high"')
  })

  test('should load initial array values and mark correct chips as selected', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "priority": ["med"]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Priority",
                "name": "priority",
                "type": "chips",
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
    )
    await page.goto('')

    const chips = page.locator('button[type="button"]')

    await expect(chips.nth(0)).not.toHaveClass(/bg-violet-600/)
    await expect(chips.nth(1)).toHaveClass(/bg-violet-600/)
    await expect(chips.nth(2)).not.toHaveClass(/bg-violet-600/)
  })

  test('should submit form with initial array values without modification', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "priority": ["med"]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Priority",
                "name": "priority",
                "type": "chips",
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
    )
    await page.goto('')

    await expect(page.locator('button[type="button"]').nth(1)).toHaveClass(
      /bg-violet-600/
    )

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"priority"')
    await expect(page.locator('pre code')).toContainText('"med"')
  })
})

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

const SCHEMA_MAPPED = `{
  "sections": [
    {
      "fields": [
        {
          "advanced": { "options": { "label": "name", "value": "id" } },
          "label": "Status",
          "name": "status",
          "type": "chips",
          "source": [
            { "id": "active", "name": "Active" },
            { "id": "archived", "name": "Archived" }
          ]
        }
      ]
    }
  ]
}`

test.describe(
  'Chips with custom source - advanced.options mapping',
  { tag: ['@e2e'] },
  () => {
    test('should render one button per mapped source entry', async ({
      page,
    }) => {
      await inject(page, SCHEMA_MAPPED)
      await page.goto('')

      const chips = page.locator('button[type="button"]')

      await expect(chips).toHaveCount(2)
    })

    test('should submit mapped values rather than raw labels', async ({
      page,
    }) => {
      await inject(page, SCHEMA_MAPPED)
      await page.goto('')

      const chips = page.locator('button[type="button"]')
      await chips.nth(0).click()

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText('"status"')
      await expect(page.locator('pre code')).toContainText('"active"')
      await expect(page.locator('pre code')).not.toContainText('"Active"')
    })
  }
)
