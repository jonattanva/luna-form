import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Columns form', { tag: ['@e2e'] }, () => {
  test('should show default columns', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
            {
                "fields": [
                    {
                        "type": "column",
                        "fields": [
                            {
                                "label": "Username",
                                "name": "username",
                                "type": "input/text"
                            },
                            {
                                "label": "Password",
                                "name": "password",
                                "type": "input/password"
                            }
                        ]
                    }
                ]
            }
        ]}`
    )

    await page.goto('')

    const fields = page.locator('[data-slot="field"]')
    await expect(fields).toHaveCount(2)

    const grid = fields.first().locator('..').locator('..')
    await expect(grid).toHaveClass(/md:grid-cols-2/)
  })

  test('should show advanced cols and field span', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
            {
                "fields": [
                    {
                        "advanced": { 
                            "cols": 3 
                        },
                        "type": "column",
                        "fields": [
                            {
                                "advanced": { 
                                    "cols": 2 
                                },
                                "label": "Username",
                                "name": "username",
                                "type": "input/text"
                            },
                            {
                                "advanced": { 
                                    "cols": 1
                                },
                                "label": "Password",
                                "name": "password",
                                "type": "input/password"
                            }
                        ]
                    }
                ]
            }
        ]}`
    )

    await page.goto('')

    const fields = page.locator('[data-slot="field"]')
    await expect(fields).toHaveCount(2)

    const grid = fields.first().locator('..').locator('..')
    await expect(grid).toHaveClass(/md:grid-cols-3/)

    const usernameField = page.locator(
      '[data-slot="field"]:has-text("Username")'
    )
    await expect(usernameField).toHaveClass(/col-span-2/)

    const passwordField = page.locator(
      '[data-slot="field"]:has-text("Password")'
    )
    await expect(passwordField).toHaveClass(/col-span-1/)
  })
})
