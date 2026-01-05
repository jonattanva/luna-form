import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Style override', { tag: ['@e2e'] }, () => {
  test('should apply global style to a fieldset', async ({ page }) => {
    await inject(
      page,
      `{
        "style": {
          "compact": true,
          "orientation": "horizontal"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Test Field",
                "name": "testField",
                "type": "input/text"
              }
            ]
          }
        ]
      }`,
    )

    await page.goto('')

    const fieldSet = page.locator('[data-slot="field-set"]').first()
    const group = fieldSet.locator('[data-slot="field-group"]').first()

    await expect(group).toHaveAttribute('data-compact', 'true')
  })

  test('should override global style with section-level style', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "style": {
          "compact": false,
          "orientation": "vertical"
        },
        "sections": [
          {
            "compact": true,
            "fields": [
              {
                "label": "Test Field",
                "name": "testField",
                "type": "input/text"
              }
            ]
          }
        ]
      }`,
    )

    await page.goto('')

    const fieldSet = page.locator('[data-slot="field-set"]').first()
    const group = fieldSet.locator('[data-slot="field-group"]').first()

    await expect(group).toHaveAttribute('data-compact', 'true')
  })
})
