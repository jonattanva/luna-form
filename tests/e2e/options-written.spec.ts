import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// The rule that a `select`, `radio` or `chips` takes only the options its
// definition writes is part of the field's schema, which the rendered form
// validates a field with on every change. These are what a person can do
// with the form: pick what is offered, and pick from options a `source`
// event fetched, which the definition does not write and the rule leaves
// alone.

const NOT_OFFERED = 'This option is not available'
const SUBMITTED = 'Form submitted successfully'

const CITIES = `[
  { "label": "Lima", "value": "lim" },
  { "label": "Cusco", "value": "cus" }
]`

const form = (fields: string) => `{
  "value": {},
  "sections": [{ "fields": [${fields}] }]
}`

/** Submits, and returns what the form sent, read off the request. */
async function submitted(page: Page): Promise<string> {
  const request = page.waitForRequest((sent) => sent.method() === 'POST')
  await page.getByRole('button', { name: 'Submit' }).click()
  const [sent] = JSON.parse((await request).postData() ?? '[]')
  await expect(page.getByText(SUBMITTED)).toBeVisible()
  return JSON.stringify(sent)
}

async function choose(page: Page, select: number, label: string) {
  await page.getByRole('combobox').nth(select).click()
  await page.getByRole('option', { name: label }).click()
  await expect(page.getByRole('listbox')).toBeHidden()
}

test.describe('Options written in the definition @e2e', () => {
  test('takes an option a select offers', async ({ page }) => {
    await inject(
      page,
      form(
        `{ "label": "City", "name": "city", "type": "select", "source": ${CITIES} }`
      )
    )
    await page.goto('/reactive')

    await choose(page, 0, 'Cusco')

    await expect(page.getByText(NOT_OFFERED)).toHaveCount(0)
    expect(await submitted(page)).toBe('{"city":"cus"}')
  })

  test('takes an option a radio and a chips offer', async ({ page }) => {
    await inject(
      page,
      form(
        `{ "label": "City", "name": "city", "type": "radio", "source": ${CITIES} },
         { "label": "Cities", "name": "cities", "type": "chips", "source": ${CITIES} }`
      )
    )
    await page.goto('/reactive')

    await page.getByRole('radio', { name: 'Lima' }).click()
    await page.getByRole('button', { name: 'Cusco' }).click()

    await expect(page.getByText(NOT_OFFERED)).toHaveCount(0)
    expect(JSON.parse(await submitted(page))).toEqual({
      city: 'lim',
      cities: ['cus'],
    })
  })

  // `city` writes options of its own, and a `source` event replaces them with
  // the ones it fetches: an option from those is no answer the definition
  // knows, and the field takes it.
  test('takes an option a `source` event fetched', async ({ page }) => {
    await page.route('**/api/cities*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ label: 'Arequipa', value: 'arequipa' }]),
      })
    )
    await inject(
      page,
      form(
        `{ "label": "Country", "name": "country", "type": "select", "source": [{ "label": "Peru", "value": "pe" }], "event": { "change": [{ "action": "source", "target": "city", "source": { "url": "/api/cities?country={value}" } }] } },
         { "label": "City", "name": "city", "type": "select", "source": ${CITIES} }`
      )
    )
    await page.goto('/reactive')

    await choose(page, 0, 'Peru')
    await choose(page, 1, 'Arequipa')

    await expect(page.getByText(NOT_OFFERED)).toHaveCount(0)
    expect(JSON.parse(await submitted(page))).toEqual({
      country: 'pe',
      city: 'arequipa',
    })
  })

  // The same, in a row: `shipping/city` names the `city` of the row whose
  // country changed.
  test('takes an option a `source` event fetched for a row', async ({
    page,
  }) => {
    await page.route('**/api/cities*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ label: 'Arequipa', value: 'arequipa' }]),
      })
    )
    await inject(
      page,
      `{
        "value": { "shipping": [{}] },
        "sections": [{ "fields": [{
          "label": "Shipping", "name": "shipping", "type": "list",
          "fields": [
            { "label": "Country", "name": "country", "type": "select", "source": [{ "label": "Peru", "value": "pe" }], "event": { "change": [{ "action": "source", "target": "shipping/city", "source": { "url": "/api/cities?country={value}" } }] } },
            { "label": "City", "name": "city", "type": "select", "source": ${CITIES} }
          ]
        }] }]
      }`
    )
    await page.goto('/reactive')

    await choose(page, 0, 'Peru')
    await choose(page, 1, 'Arequipa')

    await expect(page.getByText(NOT_OFFERED)).toHaveCount(0)
    expect(JSON.parse(await submitted(page))).toEqual({
      shipping: [{ country: 'pe', city: 'arequipa' }],
    })
  })
})
