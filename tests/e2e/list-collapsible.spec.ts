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
  test('should toggle visibility of list items when collapsible is true', async ({
    page,
  }) => {
    await inject(page, COLLAPSIBLE_LIST)

    // Add an item to the first list
    await page.getByRole('button', { name: 'Add item' }).first().click()

    const listItem = page
      .locator('div')
      .filter({ hasText: /^Collapsible Multi List 1$/ })
      .locator('..')
    const expandButton = listItem.getByRole('button', { name: 'Collapse' })
    const content = listItem.locator('div').filter({ hasText: 'Key' }).first()

    // Initially expanded
    await expect(expandButton).toBeVisible()
    await expect(content).toBeVisible()

    // Collapse
    await expandButton.click()
    await expect(listItem.getByRole('button', { name: 'Expand' })).toBeVisible()
    await expect(content).toBeHidden()

    // Expand
    await listItem.getByRole('button', { name: 'Expand' }).click()
    await expect(content).toBeVisible()
  })

  test('should start collapsed when collapsed property is true', async ({
    page,
  }) => {
    await inject(page, COLLAPSIBLE_LIST)

    // Add an item to the second list (which is collapsed by default)
    await page.getByRole('button', { name: 'Add item' }).last().click()

    const listItem = page
      .locator('div')
      .filter({ hasText: /^Collapsed By Default List 1$/ })
      .locator('..')
    const expandButton = listItem.getByRole('button', { name: 'Expand' })
    const content = listItem.locator('div').filter({ hasText: 'Item' }).first()

    // Initially collapsed
    await expect(expandButton).toBeVisible()
    await expect(content).toBeHidden()

    // Expand
    await expandButton.click()
    await expect(
      listItem.getByRole('button', { name: 'Collapse' })
    ).toBeVisible()
    await expect(content).toBeVisible()
  })
})
