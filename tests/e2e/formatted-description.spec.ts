import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('FormattedDescription component', { tag: ['@e2e'] }, () => {
  test('should render plain text description', async ({ page }) => {
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
                "description": "Enter your username here."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.getByText('Enter your username here.', {
      exact: true,
    })
    await expect(description).toBeVisible()
  })

  test('should render description with markdown link', async ({ page }) => {
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
                "description": "Read our [Privacy Policy](https://example.com/privacy) for details."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const link = page.getByRole('link', { name: 'Privacy Policy' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', 'https://example.com/privacy')
  })

  test('should render link with target blank attribute', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Website",
                "name": "website",
                "type": "input/text",
                "description": "Visit [our site](https://example.com) for more info."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const link = page.getByRole('link', { name: 'our site' })
    await expect(link).toHaveAttribute('target', '_blank')
  })

  test('should render link with rel noopener noreferrer attribute', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Reference",
                "name": "reference",
                "type": "input/text",
                "description": "Check the [documentation](https://docs.example.com)."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const link = page.getByRole('link', { name: 'documentation' })
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('should render description with multiple links', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Agreement",
                "name": "agreement",
                "type": "input/text",
                "description": "By signing up you agree to our [Terms](https://example.com/terms) and [Privacy](https://example.com/privacy)."
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const termsLink = page.getByRole('link', { name: 'Terms' })
    await expect(termsLink).toBeVisible()
    await expect(termsLink).toHaveAttribute('href', 'https://example.com/terms')

    const privacyLink = page.getByRole('link', { name: 'Privacy' })
    await expect(privacyLink).toBeVisible()
    await expect(privacyLink).toHaveAttribute(
      'href',
      'https://example.com/privacy'
    )
  })

  test('should not render description when not provided', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Name",
                "name": "name",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.getByLabel('Name')
    await expect(field).toBeVisible()

    const fieldContainer = page.locator('[data-slot="field"]')
    const descriptions = fieldContainer.locator('p')
    await expect(descriptions).toHaveCount(0)
  })

  test('should not render description when empty string', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Empty Description",
                "name": "emptyDescription",
                "type": "input/text",
                "description": ""
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.getByLabel('Empty Description')
    await expect(field).toBeVisible()

    const fieldContainer = page.locator('[data-slot="field"]')
    const descriptions = fieldContainer.locator('p')
    await expect(descriptions).toHaveCount(0)
  })

  test('should render description for different input types', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Text Input",
                "name": "textInput",
                "type": "input/text",
                "description": "Text field description."
              },
              {
                "label": "Email Input",
                "name": "emailInput",
                "type": "input/email",
                "description": "Email field description."
              },
              {
                "label": "Select Input",
                "name": "selectInput",
                "type": "select",
                "description": "Select field description.",
                "source": [
                  { "label": "Option 1", "value": "1" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const textDesc = page.getByText('Text field description.', { exact: true })
    await expect(textDesc).toBeVisible()

    const emailDesc = page.getByText('Email field description.', {
      exact: true,
    })
    await expect(emailDesc).toBeVisible()

    const selectDesc = page.getByText('Select field description.', {
      exact: true,
    })
    await expect(selectDesc).toBeVisible()
  })
})
