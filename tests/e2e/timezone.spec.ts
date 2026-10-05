import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

// The zone suggested and the instant the zones are labelled for are the host's
// to give, in `context`: the browser below runs in Tokyo, and none of it shows.
const SCHEMA = `{
  "context": { "now": "2026-01-15T12:00:00Z", "zone": "America/Bogota" },
  "sections": [
    {
      "fields": [
        {
          "label": "Timezone",
          "name": "timezone",
          "type": "select/timezone",
          "advanced": { "suggested": { "$ref": "#/context/zone" } }
        }
      ]
    }
  ]
}`

const BARE = `{
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
  test.use({ timezoneId: 'Asia/Tokyo' })

  test('should render the timezone combobox field', async ({ page }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const combobox = page.getByRole('combobox', { name: /Timezone/ })
    await expect(combobox).toBeVisible()
  })

  test('should open the dropdown and display region group labels', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    await page.getByRole('combobox', { name: /Timezone/ }).click()

    const americas = page.locator('[data-slot="combobox-label"]', {
      hasText: 'Americas',
    })
    const europe = page.locator('[data-slot="combobox-label"]', {
      hasText: 'Europe',
    })

    await expect(americas.first()).toBeVisible()
    await expect(europe.first()).toBeVisible()
  })

  test('should suggest the zone the host passes, not the browser one', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    await page.getByRole('combobox', { name: /Timezone/ }).click()

    await expect(
      page.locator('[data-slot="combobox-label"]').first()
    ).toHaveText('Suggested')
    await expect(page.getByRole('option').first()).toHaveText(
      'Bogota - Colombia (UTC-05:00)'
    )
  })

  test('should label each zone for the instant the host passes', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const combobox = page.getByRole('combobox', { name: /Timezone/ })
    await combobox.click()
    await combobox.fill('Madrid')

    // January: Madrid is an hour ahead of UTC, whatever month it is now.
    await expect(
      page.getByRole('option', {
        name: 'Madrid - Central European (UTC+01:00)',
        exact: true,
      })
    ).toBeVisible()
  })

  test('should suggest nothing and label zones by city without the host', async ({
    page,
  }) => {
    await inject(page, BARE)
    await page.goto('')

    const combobox = page.getByRole('combobox', { name: /Timezone/ })
    await combobox.click()

    await expect(
      page.locator('[data-slot="combobox-label"]', { hasText: 'Suggested' })
    ).toHaveCount(0)

    await combobox.fill('Madrid')
    await expect(
      page.getByRole('option', { name: 'Madrid', exact: true })
    ).toBeVisible()
  })

  test('should select a timezone and reflect it in the form', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const combobox = page.getByRole('combobox', { name: /Timezone/ })
    await combobox.click()
    await page.getByRole('option', { name: /New York/ }).click()

    await expect(combobox).toHaveValue(/New York/)
  })

  test('should select Africa/Abidjan and reflect it in the form', async ({
    page,
  }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const combobox = page.getByRole('combobox', { name: /Timezone/ })
    await combobox.click()
    await page.getByRole('option', { name: /Abidjan/ }).click()

    await expect(combobox).toHaveValue(/Abidjan/)
  })

  test('should filter options when typing', async ({ page }) => {
    await inject(page, SCHEMA)
    await page.goto('')

    const combobox = page.getByRole('combobox', { name: /Timezone/ })
    await combobox.click()
    await combobox.fill('Tokyo')

    await expect(page.getByRole('option', { name: /Tokyo/ })).toBeVisible()
  })
})
