import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const DUPLICATE_PREVIEW_FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "List with duplicate preview labels",
          "name": "list",
          "type": "list",
          "advanced": {
            "collapsed": true,
            "preview": { "label": "name" }
          },
          "fields": [
            { "name": "name", "label": "Name", "type": "input/text" }
          ]
        }
      ]
    }
  ],
  "value": {
    "list": [
      { "name": "Same Name" },
      { "name": "Same Name" }
    ]
  }
}`

test.describe('List - Duplicate Preview Keys', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ page }) => {
    await inject(page, DUPLICATE_PREVIEW_FIXTURE)
    await page.goto('')
  })

  test('should render items correctly even when preview labels are identical', async ({
    page,
  }) => {
    // Both items have the same name "Same Name" which is used as preview label
    // In collapsed mode, the preview is visible in the row header
    // Use the role-based selector to be more robust
    const previews = page.getByText('Same Name')
    await expect(previews).toHaveCount(2)

    // Check if both are visible
    await expect(previews.first()).toBeVisible()
    await expect(previews.nth(1)).toBeVisible()
  })
})
