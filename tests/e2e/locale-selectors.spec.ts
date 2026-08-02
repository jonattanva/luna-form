import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Locale-aware specialized selectors', { tag: ['@e2e'] }, () => {
  test('should render select/month in the language of the form', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "sections": [
          {
            "fields": [
              { "label": "Mes", "name": "month", "type": "select/month" }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(page.getByRole('option', { name: 'enero' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'diciembre' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'January' })).toHaveCount(0)
  })

  test('should render select/day in the language of the form', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "fr",
        "sections": [
          {
            "fields": [
              { "label": "Jour", "name": "day", "type": "select/day" }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(page.getByRole('option', { name: 'lundi' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'Monday' })).toHaveCount(0)
  })

  test('should render chips/day in the language of the form', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "sections": [
          {
            "fields": [
              { "label": "Días", "name": "days", "type": "chips/day" }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    // The day-of-week wrapper renders the capitalized initial of each label,
    // so a localized set of labels changes the whole row of chips.
    const days = page.locator('button[type="button"]')
    await expect(days).toHaveText(['D', 'L', 'M', 'M', 'J', 'V', 'S'])
  })

  test('should submit the numeric value, not the localized label', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "sections": [
          {
            "fields": [
              { "label": "Mes", "name": "month", "type": "select/month" }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'mayo', exact: true }).click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"month"')
    await expect(page.locator('pre code')).not.toContainText('mayo')
  })

  test('should keep the runtime locale when the form declares no language', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              { "label": "Month", "name": "month", "type": "select/month" }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(page.getByRole('option', { name: 'January' })).toBeVisible()
  })

  test('should fall back to the runtime locale for a malformed language tag', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es_MX",
        "sections": [
          {
            "fields": [
              { "label": "Month", "name": "month", "type": "select/month" }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(page.getByRole('option', { name: 'January' })).toBeVisible()
  })

  test('should localize the labels shown in a collapsed list preview', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "sections": [
          {
            "fields": [
              {
                "label": "Turnos",
                "name": "schedule",
                "type": "list",
                "advanced": {
                  "collapsed": true,
                  "preview": { "label": "title", "tags": ["days"] }
                },
                "fields": [
                  { "name": "title", "label": "Título", "type": "input/text" },
                  { "name": "days", "label": "Días", "type": "chips/day" }
                ]
              }
            ]
          }
        ],
        "value": {
          "schedule": [{ "title": "Turno mañana", "days": ["1"] }]
        }
      }`
    )

    await page.goto('')

    await expect(page.getByText('lunes', { exact: true })).toBeVisible()
    await expect(page.getByText('Monday', { exact: true })).toHaveCount(0)
  })
})
