import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Steps component', { tag: ['@e2e'] }, () => {
  test('should render step numbers when "steps" prop is used', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "steps": [
          {
            "title": "Payment Method",
            "description": "All transactions are secure and encrypted",
            "fields": [
              {
                "label": "Name on Card",
                "name": "name",
                "type": "input/text"
              }
            ]
          },
          {
            "title": "Billing Address",
            "description": "The billing address associated with your payment method",
            "fields": [
              {
                "label": "Comments",
                "name": "comments",
                "type": "textarea"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const step1 = page.locator('[data-slot="field-set"]').first().getByText('1', { exact: true })
    await expect(step1).toBeVisible()

    const step2 = page.locator('[data-slot="field-set"]').nth(1).getByText('2', { exact: true })
    await expect(step2).toBeVisible()

    const title1 = page.getByText('Payment Method')
    await expect(title1).toBeVisible()

    const title2 = page.getByText('Billing Address')
    await expect(title2).toBeVisible()
  })

  test('should not render step numbers when "sections" prop is used', async ({
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
                "label": "Name on Card",
                "name": "name",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const step1 = page.getByText('1', { exact: true })
    await expect(step1).toHaveCount(0)
  })
})
