import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('InputGroup component', { tag: ['@e2e'] }, () => {
  test('should render label when field has name and label', async ({
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
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('label', { hasText: 'Username' })
    await expect(label).toBeVisible()

    const input = page.getByLabel('Username')
    await expect(input).toBeVisible()
  })

  test('should render input with label and description in vertical orientation', async ({
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
                "description": "Enter your email address"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    const label = field.locator('label')
    const input = field.locator('input')
    const description = field.locator('p', {
      hasText: 'Enter your email address',
    })

    await expect(label).toBeVisible()
    await expect(input).toBeVisible()
    await expect(description).toBeVisible()

    const labelBox = await label.boundingBox()
    const inputBox = await input.boundingBox()
    const descBox = await description.boundingBox()

    expect(labelBox).not.toBeNull()
    expect(inputBox).not.toBeNull()
    expect(descBox).not.toBeNull()

    expect(inputBox!.y).toBeGreaterThan(labelBox!.y)
    expect(descBox!.y).toBeGreaterThan(inputBox!.y)
  })

  test('should render description next to label in horizontal orientation for checkbox', async ({
    page,
  }) => {
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
                "description": "You must accept the terms to continue"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')

    const fieldContent = field.locator('[data-slot="field-content"]')
    await expect(fieldContent).toBeVisible()

    const label = fieldContent.locator('label')
    const description = fieldContent.locator('p', {
      hasText: 'You must accept the terms to continue',
    })

    await expect(label).toBeVisible()
    await expect(description).toBeVisible()
  })

  test('should render description next to label in horizontal orientation for radio', async ({
    page,
  }) => {
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
                "description": "Select your gender",
                "source": [
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

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')

    const fieldContent = field.locator('[data-slot="field-content"]')
    const description = fieldContent.locator('p', {
      hasText: 'Select your gender',
    })

    await expect(description).toBeVisible()
  })

  test('should render field-content container with correct structure', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Full Name",
                "name": "full_name",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const fieldContent = page.locator('[data-slot="field-content"]')
    await expect(fieldContent).toBeVisible()
    await expect(fieldContent).toHaveClass(/flex/)
    await expect(fieldContent).toHaveClass(/flex-col/)
  })

  test('should render multiple input groups correctly', async ({ page }) => {
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
                "description": "Your given name"
              },
              {
                "label": "Last Name",
                "name": "last_name",
                "type": "input/text",
                "description": "Your family name"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const firstNameLabel = page.locator('label', { hasText: 'First Name' })
    const lastNameLabel = page.locator('label', { hasText: 'Last Name' })
    const firstNameDesc = page.locator('p', { hasText: 'Your given name' })
    const lastNameDesc = page.locator('p', { hasText: 'Your family name' })

    await expect(firstNameLabel).toBeVisible()
    await expect(lastNameLabel).toBeVisible()
    await expect(firstNameDesc).toBeVisible()
    await expect(lastNameDesc).toBeVisible()
  })

  test('should render input without description when not provided', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Simple Field",
                "name": "simple_field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    const label = field.locator('label')
    const input = field.locator('input')
    const paragraphs = field.locator('p')

    await expect(label).toBeVisible()
    await expect(input).toBeVisible()
    await expect(paragraphs).toHaveCount(0)
  })

  test('should render description below input for horizontal text field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Horizontal Text",
                "name": "horizontal_text",
                "type": "input/text",
                "description": "This description appears in a specific location",
                "advanced": {
                  "orientation": "horizontal"
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')

    const fieldContent = field.locator('[data-slot="field-content"]')
    const description = fieldContent.locator('p', {
      hasText: 'This description appears in a specific location',
    })

    await expect(description).toBeVisible()
  })
})
