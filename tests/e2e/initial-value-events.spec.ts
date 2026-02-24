import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Initial value events', { tag: ['@e2e'] }, () => {
  const getSelect = (page: Page, label: string) => {
    return page
      .locator('[data-slot="field"]')
      .filter({ hasText: label })
      .getByRole('combobox')
      .first()
  }

  test('should trigger state event from select initial value and show hidden field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "document_type": "passport"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Document Type",
                "name": "document_type",
                "type": "select",
                "source": [
                  { "label": "Passport", "value": "passport" },
                  { "label": "DNI", "value": "dni" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "passport_number",
                      "state": { "hidden": false },
                      "when": "passport"
                    }
                  ]
                }
              },
              {
                "label": "Passport Number",
                "name": "passport_number",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.locator('input[name="passport_number"]')).toBeVisible()
  })

  test('should keep hidden field when initial select value does not match condition', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "document_type": "dni"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Document Type",
                "name": "document_type",
                "type": "select",
                "source": [
                  { "label": "Passport", "value": "passport" },
                  { "label": "DNI", "value": "dni" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "passport_number",
                      "state": { "hidden": false },
                      "when": "passport"
                    }
                  ]
                }
              },
              {
                "label": "Passport Number",
                "name": "passport_number",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.locator('input[name="passport_number"]')).toBeHidden()
  })

  test('should trigger state event from checkbox initial value and show hidden field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "required": true
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Mandatory field",
                "name": "required",
                "type": "checkbox/switch",
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "validation_message",
                      "state": { "hidden": false },
                      "when": true
                    }
                  ]
                }
              },
              {
                "label": "Required error",
                "name": "validation_message",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.locator('input[name="validation_message"]')).toBeVisible()
  })

  test('should trigger state event with multiple targets from initial select value', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "type": "input/text"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Type",
                "name": "type",
                "type": "select",
                "source": [
                  { "label": "Text", "value": "input/text" },
                  { "label": "Number", "value": "input/number" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": ["min_length", "max_length"],
                      "state": { "hidden": false },
                      "when": ["input/text", "input/number"]
                    }
                  ]
                }
              },
              {
                "label": "Min length",
                "name": "min_length",
                "type": "input/text",
                "hidden": true
              },
              {
                "label": "Max length",
                "name": "max_length",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.locator('input[name="min_length"]')).toBeVisible()
    await expect(page.locator('input[name="max_length"]')).toBeVisible()
  })

  test('should revert state when user changes select after initial value events', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "document_type": "passport"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Document Type",
                "name": "document_type",
                "type": "select",
                "source": [
                  { "label": "Passport", "value": "passport" },
                  { "label": "DNI", "value": "dni" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "passport_number",
                      "state": { "hidden": false },
                      "when": "passport"
                    }
                  ]
                }
              },
              {
                "label": "Passport Number",
                "name": "passport_number",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const passportNumber = page.locator('input[name="passport_number"]')
    await expect(passportNumber).toBeVisible()

    const documentType = getSelect(page, 'Document Type')
    await documentType.click()
    await page.getByRole('option', { name: 'DNI' }).click()

    await page.mouse.click(10, 10)
    await expect(page.getByRole('listbox')).toBeHidden()

    await expect(passportNumber).toBeHidden()

    await documentType.click()
    await page.getByRole('option', { name: 'Passport' }).click()

    await page.mouse.click(10, 10)
    await expect(page.getByRole('listbox')).toBeHidden()

    await expect(passportNumber).toBeVisible()
  })
})
