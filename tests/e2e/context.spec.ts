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
                "description": "Contact support at {context.supportEmail}",
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

  test('should interpolate simple context value in description', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "maxChars": "100"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Username",
                "name": "username",
                "type": "input/text",
                "description": "Maximum {context.maxChars} characters allowed.",
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

    const description = page.locator('p', {
      hasText: 'Maximum 100 characters allowed.',
    })
    await expect(description).toBeVisible()
  })

  test('should interpolate nested context values in description', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "validation": {
            "minLength": "8",
            "maxLength": "20"
          }
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Password",
                "name": "password",
                "type": "input/password",
                "description": "Must be between {context.validation.minLength} and {context.validation.maxLength} characters.",
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

    const description = page.locator('p', {
      hasText: 'Must be between 8 and 20 characters.',
    })
    await expect(description).toBeVisible()
  })

  test('should interpolate multiple descriptions with different context values', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "currency": "USD",
          "minAmount": "10",
          "maxAmount": "1000"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Amount",
                "name": "amount",
                "type": "input/number",
                "description": "Enter amount in {context.currency}.",
                "advanced": {
                  "orientation": "horizontal"
                }
              },
              {
                "label": "Minimum",
                "name": "minimum",
                "type": "input/number",
                "description": "Minimum value is {context.minAmount}.",
                "advanced": {
                  "orientation": "horizontal"
                }
              },
              {
                "label": "Maximum",
                "name": "maximum",
                "type": "input/number",
                "description": "Maximum value is {context.maxAmount}.",
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

    const amountDesc = page.locator('p', { hasText: 'Enter amount in USD.' })
    const minDesc = page.locator('p', { hasText: 'Minimum value is 10.' })
    const maxDesc = page.locator('p', { hasText: 'Maximum value is 1000.' })

    await expect(amountDesc).toBeVisible()
    await expect(minDesc).toBeVisible()
    await expect(maxDesc).toBeVisible()
  })

  test('should interpolate numeric context values in description', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "limit": 500,
          "remaining": 450
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Message",
                "name": "message",
                "type": "textarea",
                "description": "You have {context.remaining} of {context.limit} characters remaining.",
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

    const description = page.locator('p', {
      hasText: 'You have 450 of 500 characters remaining.',
    })
    await expect(description).toBeVisible()
  })

  test('should mix static text and interpolated context in description', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "format": "YYYY-MM-DD",
          "example": "2024-12-31"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Date",
                "name": "date",
                "type": "input/text",
                "description": "Use format {context.format}. Example: {context.example}",
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

    const description = page.locator('p', {
      hasText: 'Use format YYYY-MM-DD. Example: 2024-12-31',
    })
    await expect(description).toBeVisible()
  })

  test('should handle deeply nested context values in description', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "settings": {
            "validation": {
              "rules": {
                "format": "alphanumeric"
              }
            }
          }
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Code",
                "name": "code",
                "type": "input/text",
                "description": "Only {context.settings.validation.rules.format} characters allowed.",
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

    const description = page.locator('p', {
      hasText: 'Only alphanumeric characters allowed.',
    })
    await expect(description).toBeVisible()
  })

  test('should not modify descriptions without placeholders', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "ignored": "value"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Static Field",
                "name": "static_field",
                "type": "input/text",
                "description": "This is a static description.",
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

    const description = page.locator('p', {
      hasText: 'This is a static description.',
    })
    await expect(description).toBeVisible()
  })

  test('should handle partial context matches in description', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "available": "yes"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Feature",
                "name": "feature",
                "type": "input/text",
                "description": "Available: {context.available}. Premium: {context.premium}",
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

    const description = page.locator('p', {
      hasText: 'Available: yes. Premium: {context.premium}',
    })
    await expect(description).toBeVisible()
  })

  test('should interpolate description for checkbox with horizontal orientation', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "termsUrl": "https://example.com/terms"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Accept Terms",
                "name": "acceptTerms",
                "type": "checkbox",
                "description": "Read our terms at {context.termsUrl}"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.locator('p', {
      hasText: 'Read our terms at https://example.com/terms',
    })
    await expect(description).toBeVisible()
  })

  test('should interpolate description for radio with horizontal orientation', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "defaultPlan": "Basic"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Subscription Plan",
                "name": "plan",
                "type": "radio",
                "description": "Default plan is {context.defaultPlan}.",
                "options": [
                  { "label": "Basic", "value": "basic" },
                  { "label": "Premium", "value": "premium" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.locator('p', {
      hasText: 'Default plan is Basic.',
    })
    await expect(description).toBeVisible()
  })

  test('should interpolate description across multiple sections', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "context": {
          "section1Hint": "Personal details",
          "section2Hint": "Contact information"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Name",
                "name": "name",
                "type": "input/text",
                "description": "Enter your {context.section1Hint}.",
                "advanced": {
                  "orientation": "horizontal"
                }
              }
            ]
          },
          {
            "fields": [
              {
                "label": "Phone",
                "name": "phone",
                "type": "input/tel",
                "description": "Provide your {context.section2Hint}.",
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

    const personalDesc = page.locator('p', {
      hasText: 'Enter your Personal details.',
    })
    const contactDesc = page.locator('p', {
      hasText: 'Provide your Contact information.',
    })

    await expect(personalDesc).toBeVisible()
    await expect(contactDesc).toBeVisible()
  })
})
