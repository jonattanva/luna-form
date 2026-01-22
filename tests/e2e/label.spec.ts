import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Label component', { tag: ['@e2e'] }, () => {
  test('should render label with correct text', async ({ page }) => {
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
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toBeVisible()
    await expect(label).toContainText('Username')
  })

  test('should show Optional text when field is not required', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Nickname",
                "name": "nickname",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('Nickname')
    await expect(label).toContainText('(Optional)')
  })

  test('should not show Optional text when field is required', async ({
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
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('Email')
    await expect(label).not.toContainText('(Optional)')
  })

  test('should have font-medium class for text input', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Full Name",
                "name": "full_name",
                "type": "input/text",
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toHaveAttribute('data-normal', 'false')
    await expect(label).toHaveClass(/font-medium/)
  })

  test('should have font-normal class for checkbox', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Accept Terms",
                "name": "accept_terms",
                "type": "checkbox",
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toHaveAttribute('data-normal', 'true')
  })

  test('should have font-normal class for radio', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Gender",
                "name": "gender",
                "type": "radio",
                "required": true,
                "options": [
                  { "label": "Male", "value": "male" },
                  { "label": "Female", "value": "female" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]').first()
    await expect(label).toHaveAttribute('data-normal', 'true')
  })

  test('should have htmlFor attribute linked to field name', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Password",
                "name": "user_password",
                "type": "input/password",
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toHaveAttribute('for', 'user_password')
  })

  test('should apply readonly styles when field is readonly', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Read Only Field",
                "name": "readonly_field",
                "type": "input/text",
                "readonly": true,
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]')
    await expect(field).toHaveAttribute('data-readonly', 'true')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toBeVisible()
  })

  test('should render multiple labels correctly', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "First Name",
                "name": "first_name",
                "type": "input/text",
                "required": true
              },
              {
                "label": "Last Name",
                "name": "last_name",
                "type": "input/text"
              },
              {
                "label": "Age",
                "name": "age",
                "type": "input/number",
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const labels = page.locator('[data-slot="field-label"]')
    await expect(labels).toHaveCount(3)

    const firstNameLabel = labels.nth(0)
    const lastNameLabel = labels.nth(1)
    const ageLabel = labels.nth(2)

    await expect(firstNameLabel).toContainText('First Name')
    await expect(firstNameLabel).not.toContainText('(Optional)')

    await expect(lastNameLabel).toContainText('Last Name')
    await expect(lastNameLabel).toContainText('(Optional)')

    await expect(ageLabel).toContainText('Age')
    await expect(ageLabel).not.toContainText('(Optional)')
  })

  test('should have correct styling classes', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Styled Label",
                "name": "styled_field",
                "type": "input/text",
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toHaveClass(/text-sm/)
    await expect(label).toHaveClass(/select-none/)
  })
})
