import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Checkbox form', { tag: ['@e2e'] }, () => {
  test('should render checkbox field correctly', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Subscribe to newsletter",
                            "name": "subscribe",
                            "type": "checkbox"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const checkbox = page.getByRole('checkbox', {
      name: 'Subscribe to newsletter',
    })
    await expect(checkbox).toHaveCount(1)
  })

  test('should be unchecked by default', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Receive Updates",
                            "name": "receive_updates",
                            "type": "checkbox"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const checkbox = page.getByRole('checkbox', { name: 'Receive Updates' })
    await expect(checkbox).not.toBeChecked()
  })

  test('should disable checkbox when field is readonly', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Enable Notifications",
                            "name": "enable_notifications",
                            "type": "checkbox",
                            "readonly": true
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const checkbox = page.getByRole('checkbox', {
      name: 'Enable Notifications',
    })
    await expect(checkbox).toBeDisabled()
  })
})
