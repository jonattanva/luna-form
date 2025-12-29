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

  test('Input field accepts valid email', async ({ page }) => {
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
    await input.fill('test@example.com')
    await input.blur()

    const message = page.getByText('This field is required', { exact: true })
    await expect(message).toHaveCount(0)
  })

  test('Input field shows error for invalid email', async ({ page }) => {
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
    await input.fill('invalid-email')
    await input.blur()

    const message = page.getByText('Invalid email address', {
      exact: true,
    })
    await expect(message).toBeVisible()
  })

  test("Optional input field doesn't show error when empty", async ({
    page,
  }) => {
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
                            "required": false,
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
    await expect(message).toHaveCount(0)
  })

  test('Input min length validation works correctly', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": {
                                "length": {
                                    "min": 3
                                }
                            },
                            "label": "Username",
                            "name": "username",
                            "type": "input/text",
                            "validation": {
                                "length": {
                                    "min": "Minimum length is 3 characters"
                                }
                            }
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const input = page.locator('input[name="username"]')

    // Test too short input
    await input.fill('ab')
    await input.blur()
    let message = page.getByText('Minimum length is 3 characters', {
      exact: true,
    })
    await expect(message).toBeVisible()

    // Test valid input
    await input.fill('validUser')
    await input.blur()
    message = page.getByText('Minimum length is 3 characters', {
      exact: true,
    })
  })
})
