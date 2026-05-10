import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const LIST_RELATIVE_EVENT = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Global Field",
          "name": "global_field",
          "type": "input/text"
        },
        {
          "label": "Users",
          "name": "users",
          "type": "list",
          "advanced": {
            "action": "Add user"
          },
          "fields": [
            {
              "label": "Label",
              "name": "label",
              "type": "input/text",
              "event": {
                "change": [
                  {
                    "action": "value",
                    "value": {
                      "users/name": "{value}",
                      "global_field": "updated from list"
                    }
                  }
                ]
              }
            },
            {
              "label": "Name",
              "name": "name",
              "type": "input/text"
            }
          ]
        }
      ]
    }
  ]
}`

test.describe('List Relative Target Event', { tag: ['@e2e'] }, () => {
  test('should update sibling field inside the same list item using relative syntax', async ({
    page,
  }) => {
    await inject(page, LIST_RELATIVE_EVENT)
    await page.goto('')

    // Add first item
    await page.getByRole('button', { name: 'Add user' }).click()
    
    // Fill label of first item
    const label0 = page.locator('input[name="users.0.label"]')
    const name0 = page.locator('input[name="users.0.name"]')
    const globalField = page.locator('input[name="global_field"]')

    await label0.fill('John Doe')
    
    // Verify sibling 'name' in the same row is updated
    await expect(name0).toHaveValue('John Doe')
    
    // Verify global field is also updated (normal absolute syntax)
    await expect(globalField).toHaveValue('updated from list')

    // Add second item to verify it doesn't cross-contaminate
    await page.getByRole('button', { name: 'Add user' }).click()
    const label1 = page.locator('input[name="users.1.label"]')
    const name1 = page.locator('input[name="users.1.name"]')

    await label1.fill('Jane Smith')
    
    // Verify second item's name is updated correctly
    await expect(name1).toHaveValue('Jane Smith')
    
    // Verify first item's name remains unchanged by the second item's event
    await expect(name0).toHaveValue('John Doe')
  })

  test('should support targeting different list row using explicit absolute path (without slash)', async ({
    page,
  }) => {
    // This case tests that missing slash still works as absolute path (legacy/global behavior)
    await inject(page, LIST_RELATIVE_EVENT)
    await page.goto('')

    await page.getByRole('button', { name: 'Add user' }).click()
    const label0 = page.locator('input[name="users.0.label"]')
    const globalField = page.locator('input[name="global_field"]')

    await label0.fill('Test')
    await expect(globalField).toHaveValue('updated from list')
  })
})
