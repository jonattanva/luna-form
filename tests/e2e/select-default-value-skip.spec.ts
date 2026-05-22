import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe(
  'First user change is honored when defaultValue is set',
  {
    tag: ['@e2e'],
  },
  () => {
    test('select/active with string "false" defaultValue switches to Yes on the first click', async ({
      page,
    }) => {
      await inject(
        page,
        `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active",
                            "required": true,
                            "defaultValue": "false"
                        }
                    ]
                }
            ]
        }`
      )

      await page.goto('')

      const select = page.getByRole('combobox')
      await expect(select).toContainText('No')

      await select.click()
      await page.getByRole('option', { name: 'Yes' }).click()

      await expect(select).toContainText('Yes')

      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText('"active": true')
    })

    test('select with string defaultValue switches options on the first click', async ({
      page,
    }) => {
      await inject(
        page,
        `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Priority",
                            "name": "priority",
                            "type": "select",
                            "defaultValue": "low",
                            "source": [
                                { "label": "Low", "value": "low" },
                                { "label": "Medium", "value": "med" },
                                { "label": "High", "value": "high" }
                            ]
                        }
                    ]
                }
            ]
        }`
      )

      await page.goto('')

      const select = page.getByRole('combobox')
      await expect(select).toContainText('Low')

      await select.click()
      await page.getByRole('option', { name: 'High' }).click()

      await expect(select).toContainText('High')

      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText('"priority": "high"')
    })
  }
)
