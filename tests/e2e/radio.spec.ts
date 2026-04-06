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

    await expect(
      page.locator('label', { hasText: 'Preferred Contact Method' })
    ).toBeVisible()
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

  test('should render descriptions for each radio option', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Permission",
                            "name": "permission",
                            "type": "radio",
                            "source": [
                                { "label": "Anyone with access", "value": "all", "description": "All project members can trigger this workflow" },
                                { "label": "Only admin", "value": "admin", "description": "Only workspace administrators can trigger this workflow" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await expect(
      page.locator('[data-slot="field-description"]', {
        hasText: 'All project members can trigger this workflow',
      })
    ).toBeVisible()
    await expect(
      page.locator('[data-slot="field-description"]', {
        hasText: 'Only workspace administrators can trigger this workflow',
      })
    ).toBeVisible()
  })

  test('should render descriptions using advanced options mapping', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": {
                                "options": {
                                    "label": "name",
                                    "value": "id",
                                    "description": "description"
                                }
                            },
                            "label": "Permission",
                            "name": "permission",
                            "type": "radio",
                            "source": [
                                {
                                    "id": 1,
                                    "name": "Anyone with access",
                                    "description": "All project members can trigger this workflow"
                                },
                                {
                                    "id": 2,
                                    "name": "Only admin",
                                    "description": "Only workspace administrators can trigger this workflow"
                                }
                            ],
                            "required": true,
                            "validation": {
                                "required": "Please select a permission level"
                            }
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await expect(page.getByLabel('Anyone with access')).toBeVisible()
    await expect(page.getByLabel('Only admin')).toBeVisible()

    await expect(
      page.locator('[data-slot="field-description"]', {
        hasText: 'All project members can trigger this workflow',
      })
    ).toBeVisible()
    await expect(
      page.locator('[data-slot="field-description"]', {
        hasText: 'Only workspace administrators can trigger this workflow',
      })
    ).toBeVisible()
  })

  test('should render description below the option label', async ({ page }) => {
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
                                { "label": "Free", "value": "free", "description": "Basic features at no cost" },
                                { "label": "Pro", "value": "pro", "description": "Advanced features for power users" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const freeLabel = page.getByLabel('Free')
    const freeDescription = page.locator('[data-slot="field-description"]', {
      hasText: 'Basic features at no cost',
    })

    await expect(freeLabel).toBeVisible()
    await expect(freeDescription).toBeVisible()

    const labelBox = await freeLabel.boundingBox()
    const descBox = await freeDescription.boundingBox()

    expect(labelBox).not.toBeNull()
    expect(descBox).not.toBeNull()
    expect(descBox!.y).toBeGreaterThan(labelBox!.y)
  })

  test('should not show description text when option has no description', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Tier",
                            "name": "tier",
                            "type": "radio",
                            "source": [
                                { "label": "Basic", "value": "basic" },
                                { "label": "Premium", "value": "premium", "description": "All premium features included" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const descriptions = page.locator('[data-slot="field-description"]', {
      hasText: /.+/,
    })
    await expect(descriptions).toHaveCount(1)
    await expect(descriptions).toContainText('All premium features included')
  })

  test('should select option with description on click', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": {
                                "options": {
                                    "label": "name",
                                    "value": "id",
                                    "description": "description"
                                }
                            },
                            "label": "Permission",
                            "name": "permission",
                            "type": "radio",
                            "source": [
                                {
                                    "id": 1,
                                    "name": "Anyone with access",
                                    "description": "All project members can trigger this workflow"
                                },
                                {
                                    "id": 2,
                                    "name": "Only admin",
                                    "description": "Only workspace administrators can trigger this workflow"
                                }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const adminRadio = page.getByLabel('Only admin')
    await adminRadio.click()
    await expect(adminRadio).toBeChecked()

    const anyoneRadio = page.getByLabel('Anyone with access')
    await expect(anyoneRadio).not.toBeChecked()
  })
})
