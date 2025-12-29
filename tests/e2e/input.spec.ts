import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Input form', { tag: ['@e2e'] }, () => {
  test('Required input field shows error message', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Email",
                            "name": "email",
                            "type": "input/email",
                            "required": true,
                            "validation": {
                                "required": "This field is required"
                            }
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const input = page.locator('input[name="email"]')
    await input.fill('')
    await input.blur()

    const message = page.getByText('This field is required', { exact: true })
    await expect(message).toBeVisible()
  })
})
