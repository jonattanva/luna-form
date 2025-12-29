import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Visibility form', { tag: ['@e2e'] }, () => {
  test('Hidden field is not visible', async ({ page }) => {
    await inject(
      page,
      `{
                "sections": [
                    {
                        "fields": [
                            {
                                "label": "Hidden Field",
                                "name": "hidden",
                                "type": "input/text",
                                "hidden": true
                            },
                            {
                                "label": "Visible Field",
                                "name": "visible",
                                "type": "input/text"
                            }
                        ]
                    }
                ]
            }`
    )

    await page.goto('')

    const hiddenField = page.getByLabel('Hidden Field')
    await expect(hiddenField).toHaveCount(0)
  })

  test('Order fields', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Field A",
                            "name": "fieldA",
                            "type": "input/text",
                            "order": 2
                        },
                        {
                            "label": "Field B",
                            "name": "fieldB",
                            "type": "input/text",
                            "hidden": true,
                            "order": 2
                        },
                        {
                            "label": "Field C",
                            "name": "fieldC",
                            "type": "input/text",
                            "order": 1
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const fieldC = page.getByLabel('Field C')
    await expect(fieldC).toBeVisible()

    const fieldA = page.getByLabel('Field A')
    await expect(fieldA).toBeVisible()

    const fields = page.locator('[data-slot="field"]')

    await expect(fields.nth(0)).toContainText('Field C')
    await expect(fields.nth(1)).toContainText('Field A')
  })

  test('Title and description visibility', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "title": "Section Title",
                    "description": "This is a description.",
                    "fields": [
                        {
                            "label": "Field 1",
                            "name": "field1",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const sectionTitle = page.getByText('Section Title')
    await expect(sectionTitle).toBeVisible()

    const sectionDescription = page.getByText('This is a description.')
    await expect(sectionDescription).toBeVisible()
  })

  test('Field without label is visible', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": {
                                "data": {
                                    "testid": "noLabelField"
                                }
                            },
                            "name": "noLabelField",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const field = page.getByTestId('noLabelField')
    await expect(field).toBeVisible()
  })

  test('Field with empty label is visible', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "",
                            "name": "emptyLabelField",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const field = page.locator('input[name="emptyLabelField"]')
    await expect(field).toBeVisible()
  })

  test('Separator visibility', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "title": "Section with Separator",
                    "description": "This section has a separator.",
                    "separator": true,
                    "fields": [
                        {
                            "label": "Name",
                            "name": "name",
                            "type": "input/text"
                        }
                    ]
                },
                {
                    "fields": [
                        {
                            "label": "Field After Separator",
                            "name": "fieldAfterSeparator",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const separator = page.locator('form [data-slot="field-separator"]')
    await expect(separator).toBeVisible()
  })
})
