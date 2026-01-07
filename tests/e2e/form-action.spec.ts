import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Form action handling', { tag: ['@e2e'] }, () => {
  test('should submit successfully', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
              {
                  "title": "Profile",
                  "description": "Fill in your profile information.",
                  "separator": true
              },
              {
                  "separator": true,
                  "fields": [
                      {
                          "advanced": {
                              "data": {
                                "testid": "name"
                              },
                              "orientation": "horizontal"
                          },
                          "label": "Name",
                          "name": "name",
                          "type": "input/text",
                          "required": true,
                          "description": "Provide your full name for identification",
                          "validation": {
                              "required": "Name is required"
                          }
                      }
                  ]
              },
              {
                  "fields": [
                      {
                          "advanced": {
                              "data": {
                                "testid": "message"
                              },
                              "orientation": "horizontal"
                          },
                          "label": "Message",
                          "name": "message",
                          "type": "textarea",
                          "required": true,
                          "description": "You can write your message here. Keep it short, preferably under 100 characters.",
                          "validation": {
                              "required": "Message is required"
                          }
                      }
                  ]
              }
          ]
      }`
    )
    await page.goto('')

    const name = page.getByTestId('name')
    await expect(name).toBeVisible()
    await name.fill('John Doe')

    const message = page.getByTestId('message')
    await expect(message).toBeVisible()
    await message.fill('Hello, this is a test message.')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      name: 'John Doe',
      message: 'Hello, this is a test message.',
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )

    await expect(name).toBeEmpty()
    await expect(message).toBeEmpty()
  })

  test('should validate and show errors on submission', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
              {
                  "title": "Profile",
                  "description": "Fill in your profile information.",
                  "separator": true
              },
              {
                  "separator": true,
                  "fields": [
                      {
                          "advanced": {
                              "data": {
                                "testid": "name"
                              },
                              "orientation": "horizontal"
                          },
                          "label": "Name",
                          "name": "name",
                          "type": "input/text",
                          "required": true,
                          "description": "Provide your full name for identification",
                          "validation": {
                              "required": "Name is required"
                          }
                      }
                  ]
              },
              {
                  "fields": [
                      {
                          "advanced": {
                              "data": {
                                "testid": "message"
                              },
                              "orientation": "horizontal"
                          },
                          "label": "Message",
                          "name": "message",
                          "type": "textarea",
                          "required": true,
                          "description": "You can write your message here. Keep it short, preferably under 100 characters.",
                          "validation": {
                              "required": "Message is required"
                          }
                      }
                  ]
              }
          ]
      }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(page.getByText('Message is required')).toBeVisible()
  })

  test('should submit form with select fields', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [ 
            {
                "title": "Payment Method",
                "description": "All transactions are secure and encrypted",
                "fields": [
                    {
                        "label": "Name on card",
                        "name": "name",
                        "type": "input/text",
                        "required": true
                    },
                    {
                        "label": "Card number",
                        "name": "card_number",
                        "type": "input/text",
                        "required": true,
                        "description": "Enter your 16-digit card number",
                        "placeholder": "1234 5678 9012 3456"
                    },
                    {
                        "advanced": {
                            "cols": 3
                        },
                        "type": "column",
                        "fields": [
                            {
                                "label": "Month",
                                "name": "month",
                                "type": "select/month",
                                "required": true
                            },
                            {
                                "label": "Year",
                                "name": "year",
                                "type": "select/year",
                                "required": true
                            },
                            {
                                "label": "CVV",
                                "name": "cvv",
                                "type": "input/number",
                                "required": true
                            }
                        ]
                    }
                ]
            }
        ]
      }`
    )
    await page.goto('')

    const currentYear = new Date().getFullYear()

    const name = page.getByLabel('Name on card')
    await name.fill('Jane Smith')

    const card = page.getByLabel('Card number')
    await card.fill('1234 5678 9012 3456')

    const monthInput = page.getByRole('combobox').first()
    await monthInput.click()

    const monthOption = page.getByRole('option', {
      name: 'January',
    })
    await monthOption.click()

    const yearInput = page.getByRole('combobox').nth(1)
    await yearInput.click()

    const yearOption = page.getByRole('option', {
      name: currentYear.toString(),
    })
    await yearOption.click()

    await page.getByLabel('CVV').fill('123')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      name: 'Jane Smith',
      card_number: '1234 5678 9012 3456',
      month: '1',
      year: currentYear.toString(),
      cvv: '123',
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )

    await expect(name).toBeEmpty()
    await expect(card).toBeEmpty()
  })
})
