import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Form initial value (props.value)', { tag: ['@e2e'] }, () => {
  test('should render form with initial values in text inputs', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "sections": [
          {
            "fields": [
              {
                "advanced": {
                  "data": {
                    "testid": "name"
                  }
                },
                "label": "Name",
                "name": "name",
                "type": "input/text",
                "required": true
              },
              {
                "advanced": {
                  "data": {
                    "testid": "email"
                  }
                },
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

    const nameInput = page.getByTestId('name')
    const emailInput = page.getByTestId('email')

    await expect(nameInput).toHaveValue('John Doe')
    await expect(emailInput).toHaveValue('john@example.com')
  })

  test('should submit form with initial values without modification', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "name": "Jane Smith",
          "message": "Hello from initial value"
        },
        "sections": [
          {
            "fields": [
              {
                "advanced": {
                  "data": {
                    "testid": "name"
                  }
                },
                "label": "Name",
                "name": "name",
                "type": "input/text",
                "required": true
              },
              {
                "advanced": {
                  "data": {
                    "testid": "message"
                  }
                },
                "label": "Message",
                "name": "message",
                "type": "textarea",
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const nameInput = page.getByTestId('name')
    const messageInput = page.getByTestId('message')

    await expect(nameInput).toHaveValue('Jane Smith')
    await expect(messageInput).toHaveValue('Hello from initial value')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      name: 'Jane Smith',
      message: 'Hello from initial value',
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )
  })

  test('should allow modification of initial values and submit', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "name": "Initial Name",
          "email": "initial@example.com"
        },
        "sections": [
          {
            "fields": [
              {
                "advanced": {
                  "data": {
                    "testid": "name"
                  }
                },
                "label": "Name",
                "name": "name",
                "type": "input/text",
                "required": true
              },
              {
                "advanced": {
                  "data": {
                    "testid": "email"
                  }
                },
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

    const nameInput = page.getByTestId('name')
    const emailInput = page.getByTestId('email')

    await expect(nameInput).toHaveValue('Initial Name')
    await expect(emailInput).toHaveValue('initial@example.com')

    await nameInput.clear()
    await nameInput.fill('Modified Name')
    await emailInput.clear()
    await emailInput.fill('modified@example.com')

    await expect(nameInput).toHaveValue('Modified Name')
    await expect(emailInput).toHaveValue('modified@example.com')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      name: 'Modified Name',
      email: 'modified@example.com',
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )
  })

  test('should render form with initial value for select field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "country": "us"
        },
        "sections": [
          {
            "fields": [
              {
                "advanced": {
                  "data": {
                    "testid": "country"
                  }
                },
                "label": "Country",
                "name": "country",
                "type": "select",
                "required": true,
                "source": [
                  { "label": "United States", "value": "us" },
                  { "label": "Canada", "value": "ca" },
                  { "label": "Mexico", "value": "mx" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByRole('combobox')).toContainText('United States')
  })

  test('should render form with initial value for checkbox', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "terms": true
        },
        "sections": [
          {
            "fields": [
              {
                "advanced": {
                  "data": {
                    "testid": "terms"
                  }
                },
                "label": "Accept terms and conditions",
                "name": "terms",
                "type": "checkbox"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const checkbox = page.getByTestId('terms')
    await expect(checkbox).toBeChecked()
  })

  test('should render form with partial initial values', async ({ page }) => {
    await inject(
      page,
      `{
        "value": {
          "name": "Partial User"
        },
        "sections": [
          {
            "fields": [
              {
                "advanced": {
                  "data": {
                    "testid": "name"
                  }
                },
                "label": "Name",
                "name": "name",
                "type": "input/text",
                "required": true
              },
              {
                "advanced": {
                  "data": {
                    "testid": "email"
                  }
                },
                "label": "Email",
                "name": "email",
                "type": "input/email",
                "required": true,
                "validation": {
                  "required": "Email is required"
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const nameInput = page.getByTestId('name')
    const emailInput = page.getByTestId('email')

    await expect(nameInput).toHaveValue('Partial User')
    await expect(emailInput).toHaveValue('')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(
      page.getByText('Email is required', { exact: true })
    ).toBeVisible()
  })

  test('should render form with initial value for radio group', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "plan": "premium"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Plan",
                "name": "plan",
                "type": "radio",
                "required": true,
                "source": [
                  { "label": "Basic", "value": "basic" },
                  { "label": "Premium", "value": "premium" },
                  { "label": "Enterprise", "value": "enterprise" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const premiumRadio = page.getByRole('radio', { name: 'Premium' })
    await expect(premiumRadio).toBeChecked()

    const basicRadio = page.getByRole('radio', { name: 'Basic' })
    await expect(basicRadio).not.toBeChecked()
  })

  test('should render form with initial values for multiple field types', async ({
    page,
  }) => {
    const currentYear = new Date().getFullYear()

    await inject(
      page,
      `{
        "value": {
          "name": "Complete User",
          "email": "complete@example.com",
          "year": "${currentYear}",
          "newsletter": true
        },
        "sections": [
          {
            "fields": [
              {
                "advanced": {
                  "data": {
                    "testid": "name"
                  }
                },
                "label": "Name",
                "name": "name",
                "type": "input/text",
                "required": true
              },
              {
                "advanced": {
                  "data": {
                    "testid": "email"
                  }
                },
                "label": "Email",
                "name": "email",
                "type": "input/email",
                "required": true
              },
              {
                "label": "Year",
                "name": "year",
                "type": "select/year",
                "required": true
              },
              {
                "advanced": {
                  "data": {
                    "testid": "newsletter"
                  }
                },
                "label": "Subscribe to newsletter",
                "name": "newsletter",
                "type": "checkbox"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const nameInput = page.getByTestId('name')
    const emailInput = page.getByTestId('email')
    const newsletterCheckbox = page.getByTestId('newsletter')

    await expect(nameInput).toHaveValue('Complete User')
    await expect(emailInput).toHaveValue('complete@example.com')
    await expect(page.getByRole('combobox').first()).toContainText(
      currentYear.toString()
    )
    await expect(newsletterCheckbox).toBeChecked()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
  })
})
