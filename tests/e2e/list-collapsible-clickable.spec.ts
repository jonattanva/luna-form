import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const HEADER_FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Multi List",
          "name": "multi",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "preview": { "label": "key", "tags": ["value"] }
          },
          "fields": [
            { "name": "key", "label": "Key", "type": "input/text" },
            { "name": "value", "label": "Value", "type": "input/text" }
          ]
        },
        {
          "label": "Single List",
          "name": "single",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "collapsed": true,
            "preview": { "label": "item" }
          },
          "fields": [
            { "name": "item", "label": "Item", "type": "input/text" }
          ]
        }
      ]
    }
  ],
  "value": {
    "multi": [{ "key": "K1", "value": "V1" }],
    "single": [{ "item": "S1" }]
  }
}`

test.describe('List Collapsible - Clickable Header', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ page }) => {
    await inject(page, HEADER_FIXTURE)
    await page.goto('')
  })

  test('multi-field: clicking the visible label text toggles collapse', async ({
    page,
  }) => {
    const keyInput = page.locator('input[name="multi.0.key"]')
    await expect(keyInput).toBeVisible()

    // Click the label text inside the header (not the chevron). The click
    // bubbles up to the wrapping toggle button.
    await page.locator('button').filter({ hasText: 'K1' }).click()
    await expect(keyInput).toBeHidden()

    await page.locator('button').filter({ hasText: 'K1' }).click()
    await expect(keyInput).toBeVisible()
  })

  test('single-field: clicking the visible label text toggles collapse', async ({
    page,
  }) => {
    const itemInput = page.locator('input[name="single.0.item"]')
    await expect(itemInput).toBeHidden()

    await page.locator('button').filter({ hasText: 'S1' }).click()
    await expect(itemInput).toBeVisible()

    await page.locator('button').filter({ hasText: 'S1' }).click()
    await expect(itemInput).toBeHidden()
  })

  test('toggle button exposes aria-expanded that reflects state', async ({
    page,
  }) => {
    const expanded = page.getByRole('button', {
      name: 'Collapse Multi List 1',
    })
    await expect(expanded).toHaveAttribute('aria-expanded', 'true')

    await expanded.click()
    await expect(
      page.getByRole('button', { name: 'Expand Multi List 1' })
    ).toHaveAttribute('aria-expanded', 'false')
  })

  test('aria-label includes the list label and 1-based index', async ({
    page,
  }) => {
    // Multi list is expanded by default → "Collapse" prefix
    await expect(
      page.getByRole('button', { name: 'Collapse Multi List 1' })
    ).toBeVisible()
    // Single list is collapsed by default → "Expand" prefix
    await expect(
      page.getByRole('button', { name: 'Expand Single List 1' })
    ).toBeVisible()
  })
})
