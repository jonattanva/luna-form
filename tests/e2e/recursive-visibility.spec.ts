import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

const getField = (page: Page, label: string) => {
  return page
    .locator('[data-slot="field"]')
    .filter({ hasText: label })
    .getByRole('combobox')
    .first()
}

test.describe('Recursive Visibility', { tag: ['@e2e'] }, () => {
  test('should hide section if all its fields are hidden', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Hidden Section",
            "fields": [
              {
                "label": "Hidden 1",
                "name": "h1",
                "type": "input/text",
                "hidden": true
              },
              {
                "label": "Hidden 2",
                "name": "h2",
                "type": "input/text",
                "hidden": true
              }
            ]
          },
          {
            "title": "Visible Section",
            "fields": [
              {
                "label": "Visible 1",
                "name": "v1",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    // Hidden section should not be visible
    const hiddenSection = page.getByText('Hidden Section', { exact: true })
    await expect(hiddenSection).toHaveCount(0)

    // Visible section should be visible
    const visibleSection = page.getByText('Visible Section', { exact: true })
    await expect(visibleSection).toBeVisible()

    const visibleField = page.getByLabel('Visible 1')
    await expect(visibleField).toBeVisible()
  })

  test('should hide section with empty fields array', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Empty Section",
            "fields": []
          },
          {
            "title": "Visible Section",
            "fields": [
              {
                "label": "Visible 1",
                "name": "v1",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const emptySection = page.getByText('Empty Section', { exact: true })
    await expect(emptySection).toHaveCount(0)

    const visibleSection = page.getByText('Visible Section', { exact: true })
    await expect(visibleSection).toBeVisible()
  })

  test('should hide section if all nested columns are hidden', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Column Section",
            "fields": [
              {
                "type": "column",
                "fields": [
                  {
                    "label": "Hidden Nested",
                    "name": "hn",
                    "type": "input/text",
                    "hidden": true
                  }
                ]
              }
            ]
          },
          {
            "title": "Visible Section",
            "fields": [
              {
                "label": "Visible 1",
                "name": "v1",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const columnSection = page.getByText('Column Section', { exact: true })
    await expect(columnSection).toHaveCount(0)

    const visibleSection = page.getByText('Visible Section', { exact: true })
    await expect(visibleSection).toBeVisible()
  })

  test('should show section when hidden fields become visible via state event', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Trigger Section",
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
              }
            ]
          },
          {
            "title": "Dynamic Section",
            "fields": [
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

    // Dynamic section should be hidden initially (all fields hidden)
    const dynamicSection = page.getByText('Dynamic Section', { exact: true })
    await expect(dynamicSection).toHaveCount(0)

    // Select Passport to trigger state event
    const documentType = getField(page, 'Document Type')
    await documentType.click()

    const passport = page.getByRole('option', { name: 'Passport' })
    await passport.click()

    // Dynamic section should now be visible
    await expect(dynamicSection).toBeVisible()

    const passportNumber = page.getByLabel('Passport Number')
    await expect(passportNumber).toBeVisible()
  })

  test('should hide section when all fields become hidden via state event', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Trigger Section",
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
                      "target": "admin_field",
                      "state": { "hidden": true },
                      "when": "viewer"
                    }
                  ]
                }
              }
            ]
          },
          {
            "title": "Admin Section",
            "fields": [
              {
                "label": "Admin Field",
                "name": "admin_field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    // Admin section should be visible initially
    const adminSection = page.getByText('Admin Section', { exact: true })
    await expect(adminSection).toBeVisible()

    const adminField = page.getByLabel('Admin Field')
    await expect(adminField).toBeVisible()

    // Select Viewer to trigger state event hiding the field
    const role = getField(page, 'Role')
    await role.click()

    const viewer = page.getByRole('option', { name: 'Viewer' })
    await viewer.click()

    // Admin section should now be hidden
    await expect(adminSection).toHaveCount(0)
    await expect(adminField).toHaveCount(0)
  })

  test('should clear value from store when section is hidden via state event', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Trigger Section",
            "fields": [
              {
                "label": "Show Personal",
                "name": "show_personal",
                "type": "select",
                "source": [
                  { "label": "Yes", "value": "yes" },
                  { "label": "No", "value": "no" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "personal_name",
                      "state": { "hidden": true },
                      "when": "no"
                    }
                  ]
                }
              }
            ]
          },
          {
            "advanced": { "collapsible": true },
            "title": "Personal Info",
            "fields": [
              {
                "label": "Personal Name",
                "name": "personal_name",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    // Open the collapsible section so the field can receive a value
    const personalFieldset = page.locator('[data-advanced="true"]')
    await personalFieldset
      .getByRole('button', { name: 'Personal Info' })
      .click()

    // Fill the personal name with "Pepe"
    const personalName = page.getByLabel('Personal Name')
    await personalName.fill('Pepe')
    await expect(personalName).toHaveValue('Pepe')

    // Trigger the state event that hides the personal_name field
    const trigger = page
      .locator('[data-slot="field"]')
      .filter({ hasText: 'Show Personal' })
      .getByRole('combobox')
      .first()
    await trigger.click()
    await page.getByRole('option', { name: 'No' }).click()

    // The field disappears (and so does the now-empty section)
    await expect(personalName).toHaveCount(0)

    // Submit the form: the value of "Pepe" must NOT remain in the store output
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('pre code')).not.toContainText('Pepe')
    await expect(page.locator('pre code')).not.toContainText('personal_name')
  })
})
