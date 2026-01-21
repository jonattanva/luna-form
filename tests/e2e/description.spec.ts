import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Description component', { tag: ['@e2e'] }, () => {
  test('should render description inside a paragraph element', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Username",
                "name": "username",
                "type": "input/text",
                "description": "Choose a unique username."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.locator('p', {
      hasText: 'Choose a unique username.',
    })
    await expect(description).toBeVisible()
    await expect(description).toHaveCount(1)
  })

  test('should apply correct text styling classes', async ({ page }) => {
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
                "description": "We will never share your email."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.locator('p', {
      hasText: 'We will never share your email.',
    })
    await expect(description).toHaveClass(/text-sm/)
    await expect(description).toHaveClass(/text-slate-600/)
  })

  test('should render description below the input field', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Password",
                "name": "password",
                "type": "input/text",
                "description": "Minimum 8 characters required."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    const input = field.locator('input')
    const description = field.locator('p', {
      hasText: 'Minimum 8 characters required.',
    })

    await expect(input).toBeVisible()
    await expect(description).toBeVisible()

    const inputBox = await input.boundingBox()
    const descBox = await description.boundingBox()

    expect(inputBox).not.toBeNull()
    expect(descBox).not.toBeNull()
    expect(descBox!.y).toBeGreaterThan(inputBox!.y)
  })

  test('should render description with special characters', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Notes",
                "name": "notes",
                "type": "input/text",
                "description": "Use symbols like @, #, $ and & freely."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.getByText('Use symbols like @, #, $ and & freely.')
    await expect(description).toBeVisible()
  })

  test('should render long description text', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Bio",
                "name": "bio",
                "type": "input/text",
                "description": "Please provide a detailed description of yourself including your background, experience, skills, and any other relevant information that might help us understand your profile better."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.locator('p', {
      hasText: 'Please provide a detailed description',
    })
    await expect(description).toBeVisible()
    await expect(description).toContainText('understand your profile better')
  })

  test('should render multiple descriptions for multiple fields', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "First Name",
                "name": "firstName",
                "type": "input/text",
                "description": "Your given name."
              },
              {
                "label": "Last Name",
                "name": "lastName",
                "type": "input/text",
                "description": "Your family name."
              },
              {
                "label": "Nickname",
                "name": "nickname",
                "type": "input/text",
                "description": "Optional display name."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const firstDesc = page.getByText('Your given name.')
    const lastDesc = page.getByText('Your family name.')
    const nickDesc = page.getByText('Optional display name.')

    await expect(firstDesc).toBeVisible()
    await expect(lastDesc).toBeVisible()
    await expect(nickDesc).toBeVisible()
  })

  test('should render description with numbers', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Phone",
                "name": "phone",
                "type": "input/text",
                "description": "Format: +1 (555) 123-4567"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.getByText('Format: +1 (555) 123-4567')
    await expect(description).toBeVisible()
  })

  test('should preserve whitespace in description', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Code",
                "name": "code",
                "type": "input/text",
                "description": "Enter the code exactly as shown."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.getByText('Enter the code exactly as shown.')
    await expect(description).toBeVisible()
  })
})
