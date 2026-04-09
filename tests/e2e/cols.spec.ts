import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Columns form', { tag: ['@e2e'] }, () => {
  test('should show default columns', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
            {
                "fields": [
                    {
                        "type": "column",
                        "fields": [
                            {
                                "label": "Username",
                                "name": "username",
                                "type": "input/text"
                            },
                            {
                                "label": "Password",
                                "name": "password",
                                "type": "input/password"
                            }
                        ]
                    }
                ]
            }
        ]}`
    )

    await page.goto('')

    const fields = page.locator('[data-slot="field"]')
    await expect(fields).toHaveCount(2)

    const grid = fields.first().locator('..').locator('..')
    await expect(grid).toHaveClass(/md:grid-cols-2/)
  })

  test('should render description below the column fields when provided', async ({
    page,
  }) => {
    const description =
      'Este flujo se activará cada 15 minutos empezando el 31 de marzo a las 08:00 AM.'

    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "type": "column",
                "description": "${description}",
                "fields": [
                  {
                    "label": "Username",
                    "name": "username",
                    "type": "input/text"
                  },
                  {
                    "label": "Password",
                    "name": "password",
                    "type": "input/password"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByText(description)).toBeVisible()
  })

  test('should not render a description element when no description is provided', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "type": "column",
                "fields": [
                  {
                    "label": "Username",
                    "name": "username",
                    "type": "input/text"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.locator('p')).toHaveCount(0)
  })

  test('should render description after the column grid, not before', async ({
    page,
  }) => {
    const description = 'This description appears after the fields.'

    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "type": "column",
                "description": "${description}",
                "fields": [
                  {
                    "label": "First Name",
                    "name": "first_name",
                    "type": "input/text"
                  },
                  {
                    "label": "Last Name",
                    "name": "last_name",
                    "type": "input/text"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const grid = page
      .locator('[data-slot="field"]')
      .first()
      .locator('..')
      .locator('..')
    const descriptionEl = page.getByText(description)

    await expect(grid).toBeVisible()
    await expect(descriptionEl).toBeVisible()

    const gridBox = await grid.boundingBox()
    const descBox = await descriptionEl.boundingBox()

    expect(gridBox).not.toBeNull()
    expect(descBox).not.toBeNull()
    expect(descBox!.y).toBeGreaterThan(gridBox!.y + gridBox!.height - 1)
  })

  test('should render column fields and description together with cols and timezone fields', async ({
    page,
  }) => {
    const description =
      'Este flujo se activará cada 15 minutos empezando el 31 de marzo a las 08:00 AM. No tiene fecha de finalización.'

    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "advanced": { "cols": 2 },
                "type": "column",
                "description": "${description}",
                "fields": [
                  {
                    "label": "Timezone",
                    "name": "timezone",
                    "type": "select/timezone",
                    "placeholder": "Select an option"
                  },
                  {
                    "advanced": { "format": "HH:mm" },
                    "label": "Time",
                    "name": "time",
                    "type": "input/time"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByRole('combobox', { name: /Timezone/ })).toBeVisible()
    await expect(page.locator('input[name="time"]')).toBeVisible()
    await expect(page.getByText(description)).toBeVisible()
  })

  test('should show advanced cols and field span', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
            {
                "fields": [
                    {
                        "advanced": { 
                            "cols": 3 
                        },
                        "type": "column",
                        "fields": [
                            {
                                "advanced": { 
                                    "cols": 2 
                                },
                                "label": "Username",
                                "name": "username",
                                "type": "input/text"
                            },
                            {
                                "advanced": { 
                                    "cols": 1
                                },
                                "label": "Password",
                                "name": "password",
                                "type": "input/password"
                            }
                        ]
                    }
                ]
            }
        ]}`
    )

    await page.goto('')

    const fields = page.locator('[data-slot="field"]')
    await expect(fields).toHaveCount(2)

    const grid = fields.first().locator('..').locator('..')
    await expect(grid).toHaveClass(/md:grid-cols-3/)

    const usernameField = page
      .locator('[data-slot="field"]:has-text("Username")')
      .locator('..')
    await expect(usernameField).toHaveClass(/col-span-2/)

    const passwordField = page
      .locator('[data-slot="field"]:has-text("Password")')
      .locator('..')
    await expect(passwordField).toHaveClass(/col-span-1/)
  })
})
