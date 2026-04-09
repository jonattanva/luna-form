import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const SCHEMA = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Timezone",
          "name": "timezone",
          "type": "select/timezone"
        }
      ]
    }
  ]
}`

test.describe('Timezone select', { tag: ['@e2e'] }, () => {
  test('should render the timezone combobox field', async ({ page }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const combobox = page.getByRole('combobox')
    await expect(combobox).toBeVisible()
  })

  test('should open the dropdown and display region group labels', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    await page.getByRole('combobox').click()

    const americas = page.locator('[data-slot="combobox-label"]', {
      hasText: 'Americas',
    })
    const europe = page.locator('[data-slot="combobox-label"]', {
      hasText: 'Europe',
    })

    await expect(americas.first()).toBeVisible()
    await expect(europe.first()).toBeVisible()
  })

  test('should display timezone items with UTC offset and city name', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(
      page.getByRole('option', { name: /\(UTC/ }).first()
    ).toBeVisible()
  })

  test('should select a timezone and reflect it in the form', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /New York/ }).click()

    await expect(page.locator('form')).toContainText(/New York/)
  })

  test('should select Africa/Abidjan and reflect it in the form', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /Abidjan/ }).click()

    await expect(page.locator('form')).toContainText(/Abidjan/)
  })

  test('should filter options when typing', async ({ page }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    await page.getByRole('combobox').click()
    await page.getByRole('combobox').fill('Tokyo')

    await expect(page.getByRole('option', { name: /Tokyo/ })).toBeVisible()
  })
})
