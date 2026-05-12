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

test.describe('List Collapsible - Preview', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ page }) => {
    await inject(page, HEADER_FIXTURE)
    await page.goto('')
  })

  test('single-field collapsed: preview reflects initial value on first render', async ({
    page,
  }) => {
    // Inputs in a collapsed item live inside <Activity mode="hidden">; their
    // effects don't run yet, so the preview must fall back to the initial
    // value tree resolved by the parent FieldList.
    await expect(page.locator('input[name="single.0.item"]')).toBeHidden()
    await expect(page.locator('button').filter({ hasText: 'S1' })).toBeVisible()
  })

  test('multi-field tags preview shows label and tags correctly', async ({
    page,
  }) => {
    // Collapse the multi item so the preview renders inline in the header
    await page.getByRole('button', { name: 'Collapse Multi List 1' }).click()

    const card = page.locator('[data-slot="list-item-card"]')
    await expect(card.getByText('K1')).toBeVisible()
    await expect(card.getByText('V1')).toBeVisible()
  })

  test('preview reflects edits made after expanding the item', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Expand Single List 1' }).click()

    await page.locator('input[name="single.0.item"]').fill('Edited')

    await page.getByRole('button', { name: 'Collapse Single List 1' }).click()
    await expect(page.getByText('Edited')).toBeVisible()
  })

  test('single-field: label is visible while collapsed and after expanding', async ({
    page,
  }) => {
    // Initially collapsed
    await expect(page.locator('input[name="single.0.item"]')).toBeHidden()
    await expect(page.locator('button').filter({ hasText: 'S1' })).toBeVisible()

    // Expand and the header label remains
    await page.getByRole('button', { name: 'Expand Single List 1' }).click()
    await expect(page.locator('input[name="single.0.item"]')).toBeVisible()
    await expect(page.locator('button').filter({ hasText: 'S1' })).toBeVisible()
  })
})
