import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Radio form', { tag: ['@e2e'] }, () => {
  test('should render radio options correctly', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Preferred Contact Method",
                            "name": "contact_method",
                            "type": "radio",
                            "source": [
                                { "label": "Email", "value": "email" },
                                { "label": "Phone", "value": "phone" },
                                { "label": "SMS", "value": "sms" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await expect(page.getByText('Preferred Contact Method')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Phone')).toBeVisible()
    await expect(page.getByLabel('SMS')).toBeVisible()
  })

  test('should allow selecting an option', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Plan",
                            "name": "plan",
                            "type": "radio",
                            "source": [
                                { "label": "Free", "value": "free" },
                                { "label": "Pro", "value": "pro" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const proRadio = page.getByLabel('Pro')
    await proRadio.click()
    await expect(proRadio).toBeChecked()

    const freeRadio = page.getByLabel('Free')
    await expect(freeRadio).not.toBeChecked()

    await freeRadio.click()
    await expect(freeRadio).toBeChecked()
    await expect(proRadio).not.toBeChecked()
  })

  test('should disable radio options when field is readonly', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Gender",
                            "name": "gender",
                            "type": "radio",
                            "readonly": true,
                            "source": [
                                { "label": "Male", "value": "m" },
                                { "label": "Female", "value": "f" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await expect(
      page.getByRole('radio', { name: 'Male', exact: true })
    ).toBeDisabled()
    await expect(page.getByRole('radio', { name: 'Female' })).toBeDisabled()
  })

  test('should have a default value if specified', async ({ page }) => {
    await inject(
      page,
      `{
            "value": {
                "color": "blue"
            },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Color",
                            "name": "color",
                            "type": "radio",
                            "source": [
                                { "label": "Red", "value": "red" },
                                { "label": "Blue", "value": "blue" },
                                { "label": "Green", "value": "green" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await expect(page.getByRole('radio', { name: 'Blue' })).toBeChecked()
    await expect(page.getByRole('radio', { name: 'Red' })).not.toBeChecked()
    await expect(page.getByRole('radio', { name: 'Green' })).not.toBeChecked()
  })
})
