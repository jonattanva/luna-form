import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const COLLAPSIBLE_LIST = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Collapsible Multi List",
          "name": "multi_list",
          "type": "list",
          "advanced": {
            "collapsible": true
          },
          "fields": [
            {
              "name": "key",
              "label": "Key",
              "type": "input/text"
            },
            {
              "name": "value",
              "label": "Value",
              "type": "input/text"
            }
          ]
        },
        {
          "label": "Collapsed By Default List",
          "name": "collapsed_list",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "collapsed": true
          },
          "fields": [
            {
              "name": "item",
              "label": "Item",
              "type": "input/text"
            }
          ]
        }
      ]
    }
  ]
}`

test.describe('List Collapsible @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await inject(page, COLLAPSIBLE_LIST)
    await page.goto('')
  })

  test('should toggle visibility of list items when collapsible is true', async ({
    page,
  }) => {
    const card = page
      .locator('[data-slot="list-item-card"]')
      .filter({ hasText: 'Collapsible Multi List 1' })
    const keyInput = page.locator('input[name="multi_list.0.key"]')

    // Initially expanded: Collapse button visible, content visible
    await expect(card.getByRole('button', { name: 'Collapse' })).toBeVisible()
    await expect(keyInput).toBeVisible()

    // Collapse hides content and toggles the chevron
    await card.getByRole('button', { name: 'Collapse' }).click()
    await expect(card.getByRole('button', { name: 'Expand' })).toBeVisible()
    await expect(keyInput).toBeHidden()

    // Expand restores content
    await card.getByRole('button', { name: 'Expand' }).click()
    await expect(keyInput).toBeVisible()
  })

  test('should start collapsed when collapsed property is true', async ({
    page,
  }) => {
    const itemInput = page.locator('input[name="collapsed_list.0.item"]')

    // Single-field list: only one Expand button exists initially because
    // the multi-field list above is expanded by default (Collapse button).
    const expandButton = page.getByRole('button', { name: 'Expand' })

    // Initially collapsed: input hidden, Expand visible
    await expect(itemInput).toBeHidden()
    await expect(expandButton).toBeVisible()

    // Expand reveals the input
    await expandButton.click()
    await expect(itemInput).toBeVisible()
  })

  test('should preserve item values when collapsing and expanding', async ({
    page,
  }) => {
    // Fill values on the default first item of the collapsible list
    const keyInput = page.locator('input[name="multi_list.0.key"]')
    const valueInput = page.locator('input[name="multi_list.0.value"]')
    await keyInput.fill('foo')
    await valueInput.fill('bar')

    const listItem = page
      .locator('div')
      .filter({ hasText: /^Collapsible Multi List 1$/ })
      .locator('..')

    // Collapse
    await listItem.getByRole('button', { name: 'Collapse' }).click()
    await expect(keyInput).toBeHidden()
    await expect(valueInput).toBeHidden()

    // Expand
    await listItem.getByRole('button', { name: 'Expand' }).click()

    // Values persist after toggle
    await expect(page.locator('input[name="multi_list.0.key"]')).toHaveValue(
      'foo'
    )
    await expect(page.locator('input[name="multi_list.0.value"]')).toHaveValue(
      'bar'
    )

    // Values also reach the form output on submit
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('pre code')).toContainText('"foo"')
    await expect(page.locator('pre code')).toContainText('"bar"')
  })

  test('should ignore collapsed when collapsible is false (fields stay reachable)', async ({
    page,
  }) => {
    // Without this guard, collapsed: true + collapsible: false would render
    // the item closed with no toggle button to reopen it, leaving the fields
    // permanently inaccessible.
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Stuck List",
                "name": "stuck_list",
                "type": "list",
                "advanced": {
                  "collapsible": false,
                  "collapsed": true
                },
                "fields": [
                  {
                    "name": "value",
                    "label": "Value",
                    "type": "input/text"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    // Field is reachable from the start (no chevron exists, but content
    // is rendered visible because collapsed is ignored).
    const valueInput = page.locator('input[name="stuck_list.0.value"]')
    await expect(valueInput).toBeVisible()

    // No toggle buttons exist for this list (collapsible was false).
    await expect(page.getByRole('button', { name: 'Expand' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Collapse' })).toHaveCount(0)
  })
})
