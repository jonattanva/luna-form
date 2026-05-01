import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Section Steps', { tag: ['@e2e'] }, () => {
  test('should render step numbers when advanced.step is true', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "advanced": {
          "step": true
        },
        "sections": [
          {
            "advanced": {
              "separator": true
            },
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
          },
          {
            "title": "Billing Address",
            "description": "The billing address associated with your payment method",
            "fields": [
              {
                "label": "Same as shipping address",
                "name": "accept",
                "type": "checkbox",
                "required": true
              },
              {
                "label": "Comments",
                "name": "comments",
                "type": "textarea",
                "required": true,
                "placeholder": "Add any additional comments"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    // Check for the first section and its step number
    const section1 = page
      .locator('fieldset')
      .filter({ hasText: 'Payment Method' })
    await expect(
      section1
        .locator('.bg-primary.text-primary-foreground')
        .getByText('1', { exact: true })
    ).toBeVisible()
    await expect(
      section1.locator('legend').getByText('Payment Method')
    ).toBeVisible()
    await expect(
      section1.getByText('All transactions are secure and encrypted')
    ).toBeVisible()

    // Check for the second section and its step number
    const section2 = page
      .locator('fieldset')
      .filter({ hasText: 'Billing Address' })
    await expect(
      section2
        .locator('.bg-primary.text-primary-foreground')
        .getByText('2', { exact: true })
    ).toBeVisible()
    await expect(
      section2.locator('legend').getByText('Billing Address')
    ).toBeVisible()
    await expect(
      section2.getByText(
        'The billing address associated with your payment method'
      )
    ).toBeVisible()
  })

  test('should NOT render step numbers when advanced.step is false or missing', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Payment Method",
            "fields": [
              {
                "label": "Name on card",
                "name": "name",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const step1 = page.locator('legend').getByText('1', { exact: true })
    await expect(step1).toBeHidden()
    await expect(page.getByText('Payment Method')).toBeVisible()
  })
})
