import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const PREVIEW_OBJECT_FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "User",
          "name": "users",
          "type": "list",
          "advanced": {
            "collapsed": true,
            "preview": {
              "label": "name",
              "tags": ["role", "id"],
              "badge": "status"
            }
          },
          "fields": [
            { "name": "id", "label": "ID", "type": "input/text" },
            { "name": "name", "label": "Name", "type": "input/text" },
            { "name": "role", "label": "Role", "type": "input/text" },
            { "name": "status", "label": "Status", "type": "input/text" }
          ]
        }
      ]
    }
  ],
  "value": {
    "users": [
      {
        "id": "123",
        "name": "Jane Doe",
        "role": "Admin",
        "status": "Active"
      }
    ]
  }
}`

test.describe('List Preview Object @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await inject(page, PREVIEW_OBJECT_FIXTURE)
    await page.goto('')
  })

  test('label replacement: shows the field value as label when collapsed', async ({
    page,
  }) => {
    const header = page.getByRole('button', { name: /Expand/ })
    // Should NOT show "User 1" (default) but "Jane Doe" (preview label)
    await expect(header).toContainText('Jane Doe')
    await expect(page.getByText('User 1')).toBeHidden()
  })

  test('tags rendering: shows requested fields as tags', async ({ page }) => {
    // Parent container for previews usually has text-xs
    const previewContainer = page.locator('div.text-xs')
    await expect(previewContainer).toContainText('Admin')
    await expect(previewContainer).toContainText('123')
    await expect(previewContainer).toContainText('·') // separator
  })

  test('badge rendering: shows the badge field with primary styles', async ({
    page,
  }) => {
    // The badge should have the specific blue classes
    const badge = page.getByText('Active', { exact: true })
    await expect(badge).toBeVisible()
    await expect(badge).toHaveClass(/bg-primary/)
    await expect(badge).toHaveClass(/text-primary-foreground/)
  })

  test('expanded item: keeps preview label but hides badge and tags', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /Expand/ }).click()

    // Preview label remains visible
    await expect(page.getByRole('button', { name: /Collapse/ })).toContainText(
      'Jane Doe'
    )
    await expect(page.getByText('User 1')).toBeHidden()

    // Badge and Tags (previews) should be hidden when expanded
    await expect(page.getByText('Active')).toBeHidden()
    await expect(page.getByText('Admin')).toBeHidden()
  })
})
