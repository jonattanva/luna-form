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
            "preview": ["key", "value"]
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
            "preview": ["item"]
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

const TWO_REMOVABLE_ITEMS = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Multi",
          "name": "multi",
          "type": "list",
          "advanced": { "collapsible": true },
          "fields": [
            { "name": "key", "label": "Key", "type": "input/text" },
            { "name": "value", "label": "Value", "type": "input/text" }
          ]
        }
      ]
    }
  ],
  "value": {
    "multi": [
      { "key": "A", "value": "a" },
      { "key": "B", "value": "b" }
    ]
  }
}`

test.describe('List Collapsible Header @e2e', () => {
  test.describe('whole header is clickable', () => {
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
      await page.getByText('Multi List 1').click()
      await expect(keyInput).toBeHidden()

      await page.getByText('Multi List 1').click()
      await expect(keyInput).toBeVisible()
    })

    test('single-field: clicking the visible label text toggles collapse', async ({
      page,
    }) => {
      const itemInput = page.locator('input[name="single.0.item"]')
      await expect(itemInput).toBeHidden()

      await page.getByText('Single List 1').click()
      await expect(itemInput).toBeVisible()

      await page.getByText('Single List 1').click()
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

    test('hovering the header underlines the label text', async ({ page }) => {
      const label = page.getByText('Multi List 1')
      await expect(label).toHaveCSS('text-decoration-line', 'none')

      await page.getByRole('button', { name: 'Collapse Multi List 1' }).hover()
      await expect(label).toHaveCSS('text-decoration-line', 'underline')
    })
  })

  test.describe('single-field collapsible header is always rendered', () => {
    test.beforeEach(async ({ page }) => {
      await inject(page, HEADER_FIXTURE)
      await page.goto('')
    })

    test('label is visible while collapsed and after expanding', async ({
      page,
    }) => {
      // Initially collapsed
      await expect(page.locator('input[name="single.0.item"]')).toBeHidden()
      await expect(page.getByText('Single List 1')).toBeVisible()

      // Expand and the header label remains
      await page.getByRole('button', { name: 'Expand Single List 1' }).click()
      await expect(page.locator('input[name="single.0.item"]')).toBeVisible()
      await expect(page.getByText('Single List 1')).toBeVisible()
    })
  })

  test.describe('preview from initial value', () => {
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
      await expect(page.getByText('S1')).toBeVisible()
    })

    test('multi-field with two preview fields shows them with a separator', async ({
      page,
    }) => {
      // Collapse the multi item so the preview renders inline in the header
      await page.getByRole('button', { name: 'Collapse Multi List 1' }).click()

      const card = page.locator('[data-slot="list-item-card"]')
      await expect(card.getByText('K1')).toBeVisible()
      await expect(card.getByText('V1')).toBeVisible()
      await expect(card.getByText('·')).toBeVisible()
    })

    test('preview reflects edits made after expanding the item', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Expand Single List 1' }).click()

      await page.locator('input[name="single.0.item"]').fill('Edited')

      await page.getByRole('button', { name: 'Collapse Single List 1' }).click()
      await expect(page.getByText('Edited')).toBeVisible()
    })
  })

  test.describe('remove button alignment and behavior', () => {
    test.beforeEach(async ({ page }) => {
      await inject(page, TWO_REMOVABLE_ITEMS)
      await page.goto('')
    })

    test('remove button is a centered 24x24 square', async ({ page }) => {
      const removeButton = page
        .getByRole('button', { name: 'Remove Multi item 1' })
        .first()

      await expect(removeButton).toHaveCSS('width', '24px')
      await expect(removeButton).toHaveCSS('height', '24px')
      await expect(removeButton).toHaveCSS('display', 'flex')
      await expect(removeButton).toHaveCSS('align-items', 'center')
      await expect(removeButton).toHaveCSS('justify-content', 'center')
    })

    test('clicking remove deletes only the targeted item', async ({ page }) => {
      // 2 items × (key + value) = 4 inputs initially
      await expect(page.locator('input[name^="multi."]')).toHaveCount(4)

      await page.getByRole('button', { name: 'Remove Multi item 1' }).click()

      // After removing one item, only 2 inputs remain
      await expect(page.locator('input[name^="multi."]')).toHaveCount(2)
    })
  })
})
