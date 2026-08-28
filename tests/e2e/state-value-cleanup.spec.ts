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

// The same cleanup seen from outside. `/reactive` holds the form's values in
// its own state and feeds them back through `value`, which is the only place
// the difference shows: a clear the host is never told about is still in the
// host, and comes back the moment the target is shown again.
const revealable = (value: string) => `{
  "value": ${value},
  "sections": [
    {
      "fields": [
        {
          "label": "Data type",
          "name": "data_type",
          "type": "chips",
          "advanced": { "multiple": false },
          "source": [
            { "label": "None", "value": "none" },
            { "label": "Custom JSON", "value": "advanced" }
          ],
          "event": {
            "change": [
              {
                "action": "state",
                "target": ["advanced_body"],
                "state": { "hidden": true },
                "when": "none"
              }
            ]
          }
        },
        {
          "label": "Advanced body",
          "name": "advanced_body",
          "type": "input/text"
        }
      ]
    }
  ]
}`

const SAVED = `{ "data_type": ["advanced"], "advanced_body": "{ \\"a\\": 1 }" }`

test.describe(
  'State event value cleanup on a controlled host',
  { tag: ['@e2e'] },
  () => {
    const advancedBody = (page: Page) =>
      page.locator('input[name="advanced_body"]')

    test('does not put a hidden target back when it is shown again', async ({
      page,
    }) => {
      await inject(page, revealable(SAVED))
      await page.goto('/reactive')

      await expect(advancedBody(page)).toHaveValue('{ "a": 1 }')

      await page.getByRole('button', { name: 'None' }).click()
      await expect(advancedBody(page)).toHaveCount(0)

      await page.getByRole('button', { name: 'Custom JSON' }).click()
      await expect(advancedBody(page)).toBeVisible()
      await expect(advancedBody(page)).toHaveValue('')
    })

    test('leaves the cleared target out of what is submitted after it is shown again', async ({
      page,
    }) => {
      await inject(page, revealable(SAVED))
      await page.goto('/reactive')

      await expect(advancedBody(page)).toHaveValue('{ "a": 1 }')

      await page.getByRole('button', { name: 'None' }).click()
      await expect(advancedBody(page)).toHaveCount(0)

      await page.getByRole('button', { name: 'Custom JSON' }).click()
      await expect(advancedBody(page)).toHaveValue('')

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).not.toContainText('"a": 1')
    })

    test('keeps what is typed into the target after it is shown again', async ({
      page,
    }) => {
      await inject(page, revealable(SAVED))
      await page.goto('/reactive')

      await expect(advancedBody(page)).toHaveValue('{ "a": 1 }')

      await page.getByRole('button', { name: 'None' }).click()
      await expect(advancedBody(page)).toHaveCount(0)

      await page.getByRole('button', { name: 'Custom JSON' }).click()
      await advancedBody(page).fill('second-body')

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      const payload = page.locator('pre code')
      await expect(payload).toContainText('"advanced_body"')
      await expect(payload).toContainText('second-body')
    })
  }
)
