import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

test.describe('State event value cleanup', { tag: ['@e2e'] }, () => {
  const getField = (page: Page, label: string) => {
    return page
      .locator('[data-slot="field"]')
      .filter({ hasText: label })
      .getByRole('combobox')
      .first()
  }

  test('clears the value of a target field when it falls back to schema hidden default', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "document_type": "passport",
          "passport_number": "ABC123"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Document Type",
                "name": "document_type",
                "type": "select",
                "source": [
                  { "label": "DNI", "value": "dni" },
                  { "label": "Passport", "value": "passport" }
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
    await expect(passportNumber).toHaveValue('ABC123')

    const documentType = getField(page, 'Document Type')
    await documentType.click()

    const dni = page.getByRole('option', { name: 'DNI' })
    await dni.click()

    await expect(page.getByLabel('Passport Number')).toHaveCount(0)

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    const payload = page.locator('pre code')
    await expect(payload).toContainText('"document_type"')
    await expect(payload).toContainText('"dni"')
    await expect(payload).not.toContainText('passport_number')
    await expect(payload).not.toContainText('ABC123')
  })

  test('keeps the value of a target field when state goes back to a non-hidden schema default', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "role": "viewer",
          "settings": "preset-A"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Role",
                "name": "role",
                "type": "select",
                "source": [
                  { "label": "Admin", "value": "admin" },
                  { "label": "Viewer", "value": "viewer" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "settings",
                      "state": { "disabled": true },
                      "when": "viewer"
                    }
                  ]
                }
              },
              {
                "label": "Settings",
                "name": "settings",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const settings = page.locator('input[name="settings"]')
    await expect(settings).toHaveValue('preset-A')
    await expect(settings).toBeDisabled()

    const role = getField(page, 'Role')
    await role.click()

    const admin = page.getByRole('option', { name: 'Admin' })
    await admin.click()

    await expect(settings).toBeEnabled()
    await expect(settings).toHaveValue('preset-A')
  })
})
