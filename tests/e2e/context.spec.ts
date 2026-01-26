import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Context interpolation', { tag: ['@e2e'] }, () => {
  test('should interpolate simple context value in label', async ({ page }) => {
    await inject(
      page,
      `{
        "context": {
          "name": "John"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Welcome {context.name}",
                "name": "greeting",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toBeVisible()
    await expect(label).toContainText('Welcome John')
  })

  test('should interpolate nested context values in label', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "user": {
            "firstName": "Jane",
            "lastName": "Doe"
          }
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Hello {context.user.firstName} {context.user.lastName}",
                "name": "welcome",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('Hello Jane Doe')
  })

  test('should preserve placeholder when context value is missing', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {},
        "sections": [
          {
            "fields": [
              {
                "label": "Hello {context.unknown}",
                "name": "missing_context",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('Hello {context.unknown}')
  })

  test('should interpolate multiple labels with different context values', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "company": "Acme Corp",
          "product": "Widget",
          "version": "2.0"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Company: {context.company}",
                "name": "company_field",
                "type": "input/text"
              },
              {
                "label": "Product: {context.product}",
                "name": "product_field",
                "type": "input/text"
              },
              {
                "label": "Version: {context.version}",
                "name": "version_field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const labels = page.locator('[data-slot="field-label"]')
    await expect(labels).toHaveCount(3)

    await expect(labels.nth(0)).toContainText('Company: Acme Corp')
    await expect(labels.nth(1)).toContainText('Product: Widget')
    await expect(labels.nth(2)).toContainText('Version: 2.0')
  })

  test('should interpolate context in labels across multiple sections', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "step1": "Personal Info",
          "step2": "Contact Details"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "{context.step1} - Name",
                "name": "name",
                "type": "input/text"
              }
            ]
          },
          {
            "fields": [
              {
                "label": "{context.step2} - Email",
                "name": "email",
                "type": "input/email"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const labels = page.locator('[data-slot="field-label"]')
    await expect(labels).toHaveCount(2)

    await expect(labels.nth(0)).toContainText('Personal Info - Name')
    await expect(labels.nth(1)).toContainText('Contact Details - Email')
  })

  test('should interpolate numeric context values in label', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "maxLength": 100,
          "minAge": 18
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Description (max {context.maxLength} chars)",
                "name": "description",
                "type": "textarea"
              },
              {
                "label": "Age (minimum {context.minAge} years)",
                "name": "age",
                "type": "input/number"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const labels = page.locator('[data-slot="field-label"]')
    await expect(labels.nth(0)).toContainText('Description (max 100 chars)')
    await expect(labels.nth(1)).toContainText('Age (minimum 18 years)')
  })

  test('should mix static text and interpolated context in label', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "currency": "USD",
          "minAmount": 10,
          "maxAmount": 1000
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Amount in {context.currency} (between {context.minAmount} and {context.maxAmount})",
                "name": "amount",
                "type": "input/number"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('Amount in USD (between 10 and 1000)')
  })

  test('should handle deeply nested context values', async ({ page }) => {
    await inject(
      page,
      `{
        "context": {
          "settings": {
            "form": {
              "title": "Registration"
            }
          }
        },
        "sections": [
          {
            "fields": [
              {
                "label": "{context.settings.form.title} - Username",
                "name": "username",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('Registration - Username')
  })

  test('should not modify labels without placeholders', async ({ page }) => {
    await inject(
      page,
      `{
        "context": {
          "value": "ignored"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Static Label",
                "name": "static_field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('Static Label')
  })

  test('should handle partial context matches in label', async ({ page }) => {
    await inject(
      page,
      `{
        "context": {
          "prefix": "Contact"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "{context.prefix}: {context.missing} Info",
                "name": "contact_info",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const label = page.locator('[data-slot="field-label"]')
    await expect(label).toContainText('Contact: {context.missing} Info')
  })
})
