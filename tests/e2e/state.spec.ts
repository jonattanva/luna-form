import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

test.describe('State event form', { tag: ['@e2e'] }, () => {
  const getField = (page: Page, label: string) => {
    return page
      .locator('[data-slot="field"]')
      .filter({ hasText: label })
      .getByRole('combobox')
      .first()
  }

  test('should show hidden field when condition matches', async ({ page }) => {
    await inject(
      page,
      `{
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
                      "target": "passport_country",
                      "state": { "hidden": false },
                      "when": "passport"
                    }
                  ]
                }
              },
              {
                "label": "Passport Country",
                "name": "passport_country",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const passportCountry = page.getByLabel('Passport Country')
    await expect(passportCountry).toHaveCount(0)

    const documentType = getField(page, 'Document Type')
    await documentType.click()

    const passport = page.getByRole('option', { name: 'Passport' })
    await passport.click()

    await expect(passportCountry).toBeVisible()
  })

  test('should hide field when condition does not match', async ({ page }) => {
    await inject(
      page,
      `{
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
                      "target": "passport_country",
                      "state": { "hidden": false },
                      "when": "passport"
                    }
                  ]
                }
              },
              {
                "label": "Passport Country",
                "name": "passport_country",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const documentType = getField(page, 'Document Type')
    await documentType.click()

    const passport = page.getByRole('option', { name: 'Passport' })
    await passport.click()

    const passportCountry = page.getByLabel('Passport Country')
    await expect(passportCountry).toBeVisible()

    await documentType.click()

    const dni = page.getByRole('option', { name: 'DNI' })
    await dni.click()

    await expect(passportCountry).toHaveCount(0)
  })

  test('should disable field when state event triggers', async ({ page }) => {
    await inject(
      page,
      `{
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

    const settings = page.getByLabel('Settings')
    await expect(settings).toBeEnabled()

    const role = getField(page, 'Role')
    await role.click()

    const viewer = page.getByRole('option', { name: 'Viewer' })
    await viewer.click()

    await expect(settings).toBeDisabled()
  })

  test('should re-enable field when condition stops matching', async ({
    page,
  }) => {
    await inject(
      page,
      `{
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

    const role = getField(page, 'Role')
    await role.click()

    const viewer = page.getByRole('option', { name: 'Viewer' })
    await viewer.click()

    const settings = page.getByLabel('Settings')
    await expect(settings).toBeDisabled()

    await role.click()

    const admin = page.getByRole('option', { name: 'Admin' })
    await admin.click()

    await expect(settings).toBeEnabled()
  })

  test('should match condition with array of values', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Document Type",
                "name": "document_type",
                "type": "select",
                "source": [
                  { "label": "DNI", "value": "dni" },
                  { "label": "Passport", "value": "passport" },
                  { "label": "Visa", "value": "visa" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "issuing_country",
                      "state": { "hidden": false },
                      "when": ["passport", "visa"]
                    }
                  ]
                }
              },
              {
                "label": "Issuing Country",
                "name": "issuing_country",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const issuingCountry = page.getByLabel('Issuing Country')
    await expect(issuingCountry).toHaveCount(0)

    const documentType = getField(page, 'Document Type')
    await documentType.click()

    const visa = page.getByRole('option', { name: 'Visa' })
    await visa.click()

    await expect(issuingCountry).toBeVisible()

    await documentType.click()

    const passport = page.getByRole('option', { name: 'Passport' })
    await passport.click()

    await expect(issuingCountry).toBeVisible()

    await documentType.click()

    const dni = page.getByRole('option', { name: 'DNI' })
    await dni.click()

    await expect(issuingCountry).toHaveCount(0)
  })

  test('should match condition with neq operator', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Role",
                "name": "role",
                "type": "select",
                "source": [
                  { "label": "Admin", "value": "admin" },
                  { "label": "Editor", "value": "editor" },
                  { "label": "Viewer", "value": "viewer" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "admin_panel",
                      "state": { "disabled": true },
                      "when": { "value": "admin", "operator": "neq" }
                    }
                  ]
                }
              },
              {
                "label": "Admin Panel",
                "name": "admin_panel",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const adminPanel = page.getByLabel('Admin Panel')
    await expect(adminPanel).toBeEnabled()

    const role = getField(page, 'Role')
    await role.click()

    const viewer = page.getByRole('option', { name: 'Viewer' })
    await viewer.click()

    await expect(adminPanel).toBeDisabled()

    await role.click()

    const admin = page.getByRole('option', { name: 'Admin' })
    await admin.click()

    await expect(adminPanel).toBeEnabled()
  })

  test('should handle multiple state events on same field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
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
                      "target": "dni_number",
                      "state": { "hidden": false },
                      "when": "dni"
                    },
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
                "label": "DNI Number",
                "name": "dni_number",
                "type": "input/text",
                "hidden": true
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

    const dniNumber = page.getByLabel('DNI Number')
    const passportNumber = page.getByLabel('Passport Number')

    await expect(dniNumber).toHaveCount(0)
    await expect(passportNumber).toHaveCount(0)

    const documentType = getField(page, 'Document Type')
    await documentType.click()

    const dni = page.getByRole('option', { name: 'DNI' })
    await dni.click()

    await expect(dniNumber).toBeVisible()
    await expect(passportNumber).toHaveCount(0)

    await documentType.click()

    const passport = page.getByRole('option', { name: 'Passport' })
    await passport.click()

    await expect(dniNumber).toHaveCount(0)
    await expect(passportNumber).toBeVisible()
  })

  test('should show field without when condition on any selection', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Category",
                "name": "category",
                "type": "select",
                "source": [
                  { "label": "Electronics", "value": "electronics" },
                  { "label": "Books", "value": "books" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "subcategory",
                      "state": { "hidden": false }
                    }
                  ]
                }
              },
              {
                "label": "Subcategory",
                "name": "subcategory",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const subcategory = page.getByLabel('Subcategory')
    await expect(subcategory).toHaveCount(0)

    const category = getField(page, 'Category')
    await category.click()

    const electronics = page.getByRole('option', { name: 'Electronics' })
    await electronics.click()

    await expect(subcategory).toBeVisible()
  })
})
