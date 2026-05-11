import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('StateEvent description action', { tag: ['@e2e'] }, () => {
  test('should update field description from a StateEvent and interpolate the current value', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Price",
                "name": "price",
                "type": "input/text",
                "description": "Enter a price",
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "price",
                      "state": {
                        "description": "Total to pay: {value | currency:USD}"
                      },
                      "when": {
                        "operator": "neq",
                        "value": ""
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const input = page.getByLabel('Price')
    const initialDescription = page.locator('p', { hasText: 'Enter a price' })
    await expect(initialDescription).toBeVisible()

    await input.fill('1234.56')

    const updatedDescription = page.locator('p', {
      hasText: 'Total to pay: $1,234.56',
    })
    await expect(updatedDescription).toBeVisible()
  })

  test('should preserve placeholder when filter is unknown', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Price",
                "name": "price",
                "type": "input/text",
                "description": "Amount: {value | nonexistent}"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByLabel('Price').fill('100')
    const description = page.locator('p', {
      hasText: 'Amount: {value | nonexistent}',
    })
    await expect(description).toBeVisible()
  })

  test('should not collide when a field is named "description"', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Description",
                "name": "description",
                "type": "input/text",
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "description",
                      "state": {
                        "description": "Length: {value} characters"
                      },
                      "when": {
                        "operator": "neq",
                        "value": ""
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByLabel('Description').fill('hello')

    const updated = page.locator('p', { hasText: 'Length: hello characters' })
    await expect(updated).toBeVisible()
  })
})
