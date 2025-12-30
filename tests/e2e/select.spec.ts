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

  test('should work correctly with required validation', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Month",
                            "name": "month",
                            "type": "select/month",
                            "required": true,
                            "validation": {
                                "required": "Month is required"
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

    await page.keyboard.press('Escape')
    await select.blur()

    const message = page.getByText('Month is required', { exact: true })
    await expect(message).toBeVisible()
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
