import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Recursive Visibility', { tag: ['@e2e'] }, () => {
  test.skip('should hide section if all its fields are hidden', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Hidden Section",
            "fields": [
              {
                "label": "Hidden 1",
                "name": "h1",
                "type": "input/text",
                "hidden": true
              },
              {
                "label": "Hidden 2",
                "name": "h2",
                "type": "input/text",
                "hidden": true
              }
            ]
          },
          {
            "title": "Visible Section",
            "fields": [
              {
                "label": "Visible 1",
                "name": "v1",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    // Hidden section should not be visible
    const hiddenSection = page.getByText('Hidden Section')
    await expect(hiddenSection).toHaveCount(0)

    // Visible section should be visible
    const visibleSection = page.getByText('Visible Section')
    await expect(visibleSection).toBeVisible()

    const visibleField = page.getByLabel('Visible 1')
    await expect(visibleField).toBeVisible()
  })

  test.skip('should hide section with empty fields array', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Empty Section",
            "fields": []
          },
          {
            "title": "Visible Section",
            "fields": [
              {
                "label": "Visible 1",
                "name": "v1",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const emptySection = page.getByText('Empty Section')
    await expect(emptySection).toHaveCount(0)

    const visibleSection = page.getByText('Visible Section')
    await expect(visibleSection).toBeVisible()
  })

  test.skip('should hide section if all nested columns are hidden', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Column Section",
            "fields": [
              {
                "type": "column",
                "fields": [
                  {
                    "label": "Hidden Nested",
                    "name": "hn",
                    "type": "input/text",
                    "hidden": true
                  }
                ]
              }
            ]
          },
          {
            "title": "Visible Section",
            "fields": [
              {
                "label": "Visible 1",
                "name": "v1",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const columnSection = page.getByText('Column Section')
    await expect(columnSection).toHaveCount(0)

    const visibleSection = page.getByText('Visible Section')
    await expect(visibleSection).toBeVisible()
  })
})
