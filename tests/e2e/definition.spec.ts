import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Definition form', { tag: ['@e2e'] }, () => {
  test('should work correctly with definition source', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": {
                                "options": {
                                    "label": "name",
                                    "value": "id"
                                }
                            },
                            "label": "Users",
                            "name": "users",
                            "type": "select",
                            "source": {
                                "$ref": "#/definition/source"
                            }
                        }
                    ]
                }
            ],
            "definition": {
                "source": {
                    "url": "https://jsonplaceholder.typicode.com/users",
                    "method": "GET"
                }
            }
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'Leanne Graham' })
    await expect(option).toBeVisible()
  })
})
