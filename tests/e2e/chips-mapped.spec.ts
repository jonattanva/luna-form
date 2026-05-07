import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

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
