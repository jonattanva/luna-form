import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Select form', { tag: ['@e2e'] }, () => {
  test('should work correctly with select month input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Month",
                            "name": "month",
                            "type": "select/month"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'May' })
    await option.click()

    const form = page.locator('form')
    await expect(form).toContainText('May')
  })

  test('should work correctly with select year input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Year",
                            "name": "year",
                            "type": "select/year"
                        }
                    ]
                }
            ]
        }`
    )

    const currentYear = new Date().getFullYear()
    const targetYear = currentYear + 2

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: targetYear.toString() })
    await option.click()

    const form = page.locator('form')
    await expect(form).toContainText(targetYear.toString())
  })

  test('should render select array source correctly', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Fruit",
                            "name": "fruit",
                            "type": "select",
                            "source": [
                                { "value": "apple", "label": "Apple" },
                                { "value": "banana", "label": "Banana" },
                                { "value": "cherry", "label": "Cherry" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const appleOption = page.getByRole('option', { name: 'Apple' })
    const bananaOption = page.getByRole('option', { name: 'Banana' })
    const cherryOption = page.getByRole('option', { name: 'Cherry' })

    await expect(appleOption).toBeVisible()
    await expect(bananaOption).toBeVisible()
    await expect(cherryOption).toBeVisible()
  })

  test('should work correctly with select day input type', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Day",
                            "name": "day",
                            "type": "select/day"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'Wednesday' })
    await option.click()

    const form = page.locator('form')
    await expect(form).toContainText('Wednesday')
  })

  test('should render all 7 week days for select day input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Day",
                            "name": "day",
                            "type": "select/day"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    for (const day of days) {
      await expect(page.getByRole('option', { name: day })).toBeVisible()
    }
  })

  test('should render both options for select active input type', async ({
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
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    await expect(page.getByRole('option', { name: 'Yes' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'No' })).toBeVisible()
  })

  test('should work correctly with select active input type', async ({
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
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'No' })
    await option.click()

    const form = page.locator('form')
    await expect(form).toContainText('No')
  })

  test('should submit the correct value for select active input type', async ({
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
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    await page.getByRole('option', { name: 'Yes' }).click()

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"active": true')
  })

  test('should not show "Invalid input" when selecting "No" in a required select/active field', async ({
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
                            "required": true
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    // Seleccionamos "No" (que se traduce a false)
    await page.getByRole('option', { name: 'No' }).click()

    // Verificamos que NO aparezca el mensaje de error "Invalid input"
    await expect(page.getByText('Invalid input')).toBeHidden()

    // Intentamos hacer submit para asegurar que pasa la validación
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"active": false')
  })

  test('should display correct option when initial value is boolean true', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "value": { "active": true },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toContainText('Yes')
  })

  test('should display correct option when initial value is boolean false', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "value": { "active": false },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toContainText('No')
  })

  test('should display correct option when initial value is string "true"', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "value": { "active": "true" },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toContainText('Yes')
  })

  test('should display correct option when initial value is string "false"', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "value": { "active": "false" },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toContainText('No')
  })

  test('should render select fetch source correctly', async ({ page }) => {
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
                                    "value": "id"
                                }
                            },
                            "label": "Select User",
                            "name": "user",
                            "type": "select",
                            "source": {
                                "url": "https://jsonplaceholder.typicode.com/users",
                                "method": "GET"
                            }
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'Leanne Graham' })
    await expect(option).toBeVisible()
  })
})
