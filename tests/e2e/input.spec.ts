import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Input form', { tag: ['@e2e'] }, () => {
  test('should show error message for required input field', async ({
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

  test('should accept valid email in input field', async ({ page }) => {
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

  test('should show error for invalid email in input field', async ({
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

  test('should not show error for empty optional input field', async ({
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

  test('should work correctly with input min length validation', async ({
    page,
  }) => {
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

  test('should show error for invalid textarea input', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Description",
                            "name": "description",
                            "type": "textarea",
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

    const textarea = page.locator('textarea[name="description"]')
    await textarea.fill('')
    await textarea.blur()

    const message = page.getByText('This field is required', { exact: true })
    await expect(message).toBeVisible()
  })
})
