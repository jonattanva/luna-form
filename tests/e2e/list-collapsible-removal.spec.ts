import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

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

test.describe('List Collapsible - Removal', { tag: ['@e2e'] }, () => {
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
