import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Field defaultValue', { tag: ['@e2e'] }, () => {
  test('should render text input with schema defaultValue when props.value is absent', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "advanced": { "data": { "testid": "username" } },
                "defaultValue": "guest",
                "label": "Username",
                "name": "username",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByTestId('username')).toHaveValue('guest')
  })

  test('should submit form with defaultValue when user does not interact', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "advanced": { "data": { "testid": "country" } },
                "defaultValue": "Colombia",
                "label": "Country",
                "name": "country",
                "type": "input/text",
                "required": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByTestId('country')).toHaveValue('Colombia')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"country"')
    await expect(page.locator('pre code')).toContainText('"Colombia"')
  })

  test('should let props.value override defaultValue', async ({ page }) => {
    await inject(
      page,
      `{
        "value": { "nickname": "Pedro" },
        "sections": [
          {
            "fields": [
              {
                "advanced": { "data": { "testid": "nickname" } },
                "defaultValue": "Juan",
                "label": "Nickname",
                "name": "nickname",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByTestId('nickname')).toHaveValue('Pedro')
  })

  test('should preselect select option from defaultValue', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "defaultValue": "dni",
                "label": "Document Type",
                "name": "document_type",
                "type": "select",
                "source": [
                  { "label": "Passport", "value": "passport" },
                  { "label": "DNI", "value": "dni" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"document_type"')
    await expect(page.locator('pre code')).toContainText('"dni"')
  })

  test('should pre-check checkbox from defaultValue', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "defaultValue": true,
                "label": "Subscribe",
                "name": "subscribe",
                "type": "checkbox"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(
      page.getByRole('checkbox', { name: 'Subscribe' })
    ).toBeChecked()
  })

  test('should render date input with formatted defaultValue', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "advanced": { "format": "MM/dd/yyyy" },
                "defaultValue": "01/15/2025",
                "label": "Start Date",
                "name": "start_date",
                "type": "input/date"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.locator('input[name="start_date"]')).toHaveValue(
      '01/15/2025'
    )
  })

  test('should trigger event.change from defaultValue and show conditional field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "defaultValue": "passport",
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
})
