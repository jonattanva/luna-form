import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A value a `select`, `radio` or `chips` holds that its written options do not
// offer: from the host, or from a `value` event. The control cannot show it,
// and the browser does not submit it: a native select behind the control
// submits its first option instead, an option nobody picked, and a radio
// submits nothing. The submit checks the value the field holds, so the field
// says the value is not one of its options and nothing is sent, whether the
// field is required or not, until an option is picked.

const NOT_OFFERED = 'This option is not available'
const FAILED = 'There were validation errors submitting the form.'

const CITIES = `[
  { "label": "Lima", "value": "lim" },
  { "label": "Cusco", "value": "cus" }
]`

const form = (fields: string, value: string) => `{
  "value": ${value},
  "sections": [{ "fields": [${fields}] }]
}`

const choice = (type: string, required = false) => `{
  "label": "City",
  "name": "city",
  "type": "${type}",
  "required": ${required},
  "source": ${CITIES}
}`

/** A chips whose one option writes `value` into the form when picked. */
const writer = (value: string) => `{
  "label": "Kind",
  "name": "kind",
  "type": "chips",
  "advanced": { "multiple": false },
  "source": [{ "label": "Saved", "value": "saved" }],
  "event": { "change": [{ "action": "value", "value": ${value} }] }
}`

/** Counts what the form sends to its action from here on. */
function countSubmits(page: Page) {
  const sent: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST') {
      sent.push(request.postData() ?? '')
    }
  })
  return sent
}

/** Submits, and returns what the form sent, read off the request. */
async function submitted(page: Page): Promise<string> {
  const request = page.waitForRequest((sent) => sent.method() === 'POST')
  const answered = page.waitForResponse(
    (response) => response.request().method() === 'POST'
  )
  await page.getByRole('button', { name: 'Submit' }).click()
  const [sent] = JSON.parse((await request).postData() ?? '[]')
  await answered
  return JSON.stringify(sent)
}

/**
 * Submits a form the field holds back, and returns what reached the action:
 * nothing, once the form says the value is not one of the field's options.
 */
async function submitHeldBack(page: Page): Promise<string[]> {
  const sent = countSubmits(page)
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page.getByText(FAILED)).toBeVisible()
  await expect(page.getByText(NOT_OFFERED)).toBeVisible()
  return sent
}

/** That the control shows no option picked. */
async function expectNothingPicked(page: Page, type: string) {
  if (type === 'radio') {
    await expect(page.getByRole('radio', { name: 'Lima' })).not.toBeChecked()
    return
  }
  await expect(page.getByRole('combobox')).toHaveText('')
}

async function pick(page: Page, type: string, label: string) {
  if (type === 'radio') {
    await page.getByRole('radio', { name: label }).click()
    return
  }
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: label }).click()
  await expect(page.getByRole('listbox')).toBeHidden()
}

test.describe('A value its written options do not offer @e2e', () => {
  for (const type of ['select', 'radio']) {
    for (const required of [false, true]) {
      test(`holds back a ${type} value it does not offer (required: ${required})`, async ({
        page,
      }) => {
        await inject(page, form(choice(type, required), `{ "city": "xyz" }`))
        await page.goto('/reactive')

        expect(await submitHeldBack(page)).toEqual([])
      })
    }

    test(`sends the ${type} option picked in its place`, async ({ page }) => {
      await inject(page, form(choice(type), `{ "city": "xyz" }`))
      await page.goto('/reactive')
      expect(await submitHeldBack(page)).toEqual([])

      await pick(page, type, 'Cusco')

      expect(await submitted(page)).toBe('{"city":"cus"}')
      await expect(page.getByText(NOT_OFFERED)).toHaveCount(0)
    })
  }

  test('holds back a chips selection with a value it does not offer', async ({
    page,
  }) => {
    await inject(
      page,
      form(
        `{ "label": "Cities", "name": "cities", "type": "chips", "source": ${CITIES} }`,
        `{ "cities": ["lim", "xyz"] }`
      )
    )
    await page.goto('/reactive')

    expect(await submitHeldBack(page)).toEqual([])
  })

  test('holds back a value a list row does not offer', async ({ page }) => {
    await inject(
      page,
      form(
        `{ "label": "Orders", "name": "orders", "type": "list", "fields": [${choice('select')}] }`,
        `{ "orders": [{ "city": "xyz" }] }`
      )
    )
    await page.goto('/reactive')

    expect(await submitHeldBack(page)).toEqual([])
  })

  test('holds back a value a `value` event writes', async ({ page }) => {
    await inject(
      page,
      form(`${writer('{ "city": "xyz" }')}, ${choice('select')}`, '{}')
    )
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Saved' }).click()

    expect(await submitHeldBack(page)).toEqual([])
  })

  test('holds back a value a `value` event assigns to a row', async ({
    page,
  }) => {
    await inject(
      page,
      form(
        `${writer('{ "orders": [{ "city": "xyz" }] }')}, { "label": "Orders", "name": "orders", "type": "list", "fields": [${choice('select')}] }`,
        '{}'
      )
    )
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Saved' }).click()

    expect(await submitHeldBack(page)).toEqual([])
  })

  // A `source` event installs this field's options at run time, so the
  // options written for it are not the ones it offers: its value is sent.
  test('sends the value of a field a `source` event aims at', async ({
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
      form(
        `{ "label": "Country", "name": "country", "type": "select", "source": [{ "label": "Peru", "value": "pe" }], "event": { "change": [{ "action": "source", "target": "city", "source": { "url": "/api/cities?country={value}" } }] } },
         ${choice('select')}`,
        `{ "country": "pe", "city": "arequipa" }`
      )
    )
    await page.goto('/reactive')
    await expect(page.getByRole('combobox').nth(1)).toHaveText('Arequipa')

    expect(JSON.parse(await submitted(page))).toEqual({
      country: 'pe',
      city: 'arequipa',
    })
  })

  // A field that holds nothing, or what it offers, sends what it always sent:
  // nothing picked, then Lima, then nothing again once the success emptied
  // the form. A select sends `""` for nothing picked, a radio nothing at all.
  for (const [type, nothing] of [
    ['select', '{"city":""}'],
    ['radio', '{}'],
  ]) {
    test(`sends a ${type} it can show as it always did, submit after submit`, async ({
      page,
    }) => {
      await inject(page, form(choice(type), '{}'))
      await page.goto('/reactive')

      const sent = [await submitted(page)]
      await pick(page, type, 'Lima')
      sent.push(await submitted(page))
      // A success empties the form before the next submit.
      await expectNothingPicked(page, type)
      sent.push(await submitted(page))

      expect(sent).toEqual([nothing, '{"city":"lim"}', nothing])
    })
  }
})
