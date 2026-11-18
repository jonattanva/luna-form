import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// The tools a form offers an agent, called the way an agent without WebMCP
// calls them: `callTool()` from the page, which `/reactive` puts on
// `window.__lunaTools`. Every assertion that matters is about the page as well
// as the answer: what a tool says it wrote has to be what the form shows.

type Answer = Record<string, unknown>

type Tools = Readonly<{
  call: (name: string, input: object) => Promise<Answer>
  list: () => Promise<Array<Readonly<{ name: string; inputSchema: Answer }>>>
}>

const COUNTRIES = `[
  { "label": "Colombia", "value": "co" },
  { "label": "México", "value": "mx" }
]`

const FORM = `{
  "sections": [{
    "fields": [
      {
        "label": "Name",
        "name": "name",
        "type": "input/text",
        "required": true,
        "event": {
          "change": [{ "action": "value", "value": { "nickname": "{value}" } }]
        }
      },
      { "label": "Nickname", "name": "nickname", "type": "input/text" },
      { "label": "Email", "name": "email", "type": "input/email" },
      { "label": "Country", "name": "country", "type": "select", "source": ${COUNTRIES} },
      {
        "label": "Plan",
        "name": "plan",
        "type": "radio",
        "source": [
          { "label": "Free", "value": "free" },
          { "label": "Pro", "value": "pro" }
        ],
        "event": {
          "change": [
            { "action": "state", "target": "frequency", "state": { "hidden": false }, "when": "pro" },
            { "action": "state", "target": "card", "state": { "disabled": false }, "when": "pro" }
          ]
        }
      },
      {
        "label": "Frequency",
        "name": "frequency",
        "type": "select",
        "hidden": true,
        "source": [
          { "label": "Weekly", "value": "weekly" },
          { "label": "Monthly", "value": "monthly" }
        ]
      },
      { "label": "Card", "name": "card", "type": "input/text", "disabled": true },
      { "label": "Agree", "name": "agree", "type": "checkbox" },
      { "label": "Zone", "name": "zone", "type": "select/timezone" },
      {
        "label": "Items",
        "name": "items",
        "type": "list",
        "advanced": { "length": { "max": 2 } },
        "fields": [{ "label": "SKU", "name": "sku", "type": "input/text" }]
      },
      { "label": "Password", "name": "password", "type": "input/password" }
    ]
  }]
}`

async function open(page: Page) {
  await inject(page, FORM)
  await page.goto('/reactive')
  await page.waitForFunction(() => '__lunaTools' in window)
}

function call(page: Page, name: string, input: object = {}) {
  return page.evaluate(
    ({ input, name }) =>
      (window as Window & { __lunaTools?: Tools }).__lunaTools!.call(
        name,
        input
      ),
    { input, name }
  )
}

function list(page: Page) {
  return page.evaluate(() =>
    (window as Window & { __lunaTools?: Tools }).__lunaTools!.list()
  )
}

test.describe('Agent tools', { tag: ['@e2e'] }, () => {
  test('should offer the form as four tools, with what an agent may write', async ({
    page,
  }) => {
    await open(page)
    const tools = await list(page)

    expect(tools.map((tool) => tool.name)).toEqual([
      'preview_fill',
      'preview_read',
      'preview_options',
      'preview_submit',
    ])
    expect(Object.keys(tools[0].inputSchema.properties as object)).toEqual([
      'name',
      'nickname',
      'email',
      'country',
      'plan',
      'frequency',
      'card',
      'agree',
      'zone',
      'items',
    ])
  })

  test('should write each field through its own change, and the page shows it', async ({
    page,
  }) => {
    await open(page)
    const result = await call(page, 'preview_fill', {
      agree: true,
      country: 'México',
      name: 'Ada',
    })

    expect(result).toMatchObject({
      applied: ['name', 'country', 'agree'],
      errors: {},
      ok: true,
      skipped: [],
    })
    // The value event of `name` filled `nickname`, and the answer says so.
    expect(result.values).toEqual({
      agree: true,
      country: 'mx',
      name: 'Ada',
      nickname: 'Ada',
    })

    await expect(page.locator('input[name="name"]')).toHaveValue('Ada')
    await expect(page.locator('input[name="nickname"]')).toHaveValue('Ada')
    await expect(
      page
        .locator('[data-slot="field"]')
        .filter({ hasText: 'Country' })
        .getByRole('combobox')
    ).toContainText('México')
    await expect(page.getByRole('checkbox', { name: 'Agree' })).toBeChecked()
  })

  test('should write in the same call a field another value shows or unlocks', async ({
    page,
  }) => {
    await open(page)
    await expect(page.locator('input[name="card"]')).toBeDisabled()

    const result = await call(page, 'preview_fill', {
      card: '4242',
      frequency: 'monthly',
      plan: 'pro',
    })

    expect(result).toMatchObject({
      applied: ['plan', 'frequency', 'card'],
      ok: true,
      revealed: ['frequency'],
      skipped: [],
    })
    await expect(page.locator('input[name="card"]')).toHaveValue('4242')
    await expect(
      page
        .locator('[data-slot="field"]')
        .filter({ hasText: 'Frequency' })
        .getByRole('combobox')
    ).toContainText('Monthly')
  })

  test('should skip what it cannot write, and say why', async ({ page }) => {
    await open(page)
    const result = await call(page, 'preview_fill', {
      card: '4242',
      country: 'Chile',
      frequency: 'weekly',
      password: 'hunter2',
    })

    expect(result.ok).toBe(false)
    expect(result.applied).toEqual([])
    expect(result.skipped).toEqual([
      { code: 'unknown', message: 'No field so named.', name: 'password' },
      {
        code: 'invalid_option',
        message: 'No option "Chile". Options: co (Colombia), mx (México).',
        name: 'country',
      },
      {
        code: 'hidden',
        message: 'The field is not on the form: some other value shows it.',
        name: 'frequency',
      },
      {
        code: 'locked',
        message: 'The field is disabled or read-only.',
        name: 'card',
      },
    ])
    await expect(page.locator('input[name="card"]')).toHaveValue('')
  })

  test('should hand a list its rows, and say which it did not keep', async ({
    page,
  }) => {
    await open(page)
    const result = await call(page, 'preview_fill', {
      items: [{ sku: 'A1' }, { sku: 'B2' }, { sku: 'C3' }],
    })

    expect(result.values).toEqual({ items: [{ sku: 'A1' }, { sku: 'B2' }] })
    expect(result.adjusted).toEqual([
      {
        code: 'rows_adjusted',
        message: 'The list holds 2 rows: 3 were sent.',
        name: 'items',
      },
    ])
    await expect(page.locator('input[name$=".sku"]')).toHaveCount(2)
    await expect(page.locator('input[name$=".sku"]').nth(1)).toHaveValue('B2')
  })

  test("should write one row's field by its route, and leave the others alone", async ({
    page,
  }) => {
    await open(page)
    await call(page, 'preview_fill', { items: [{ sku: 'A1' }, { sku: 'B2' }] })
    const result = await call(page, 'preview_fill', { 'items.1.sku': 'b2-new' })

    expect(result).toMatchObject({
      applied: ['items.1.sku'],
      ok: true,
      values: { 'items.1.sku': 'b2-new' },
    })
    await expect(page.locator('input[name$=".sku"]').nth(0)).toHaveValue('A1')
    await expect(page.locator('input[name$=".sku"]').nth(1)).toHaveValue(
      'b2-new'
    )
    expect(
      await call(page, 'preview_fill', { 'items.4.sku': 'x' })
    ).toMatchObject({
      ok: false,
      skipped: [
        {
          code: 'unknown',
          message: 'No row of the list is at that position.',
          name: 'items.4.sku',
        },
      ],
    })
  })

  test('should write a field of a row in a list that is itself in a row', async ({
    page,
  }) => {
    await inject(
      page,
      JSON.stringify({
        sections: [
          {
            fields: [
              {
                fields: [
                  { label: 'Title', name: 'title', type: 'input/text' },
                  {
                    fields: [
                      { label: 'Code', name: 'code', type: 'input/text' },
                    ],
                    label: 'Parts',
                    name: 'parts',
                    type: 'list',
                  },
                ],
                label: 'Groups',
                name: 'groups',
                type: 'list',
              },
            ],
          },
        ],
      })
    )
    await page.goto('/reactive')
    await page.waitForFunction(() => '__lunaTools' in window)

    await call(page, 'preview_fill', {
      groups: [
        { parts: [{ code: 'a' }], title: 'A' },
        { parts: [{ code: 'b' }, { code: 'c' }], title: 'B' },
      ],
    })
    const result = await call(page, 'preview_fill', {
      'groups.1.parts.1.code': 'c2',
    })

    expect(result).toMatchObject({
      applied: ['groups.1.parts.1.code'],
      ok: true,
      skipped: [],
    })
    expect((await call(page, 'preview_read')).values).toEqual({
      groups: [
        { parts: [{ code: 'a' }], title: 'A' },
        { parts: [{ code: 'b' }, { code: 'c2' }], title: 'B' },
      ],
    })
  })

  test('should write a custom type in the shape it declares', async ({
    page,
  }) => {
    await inject(
      page,
      JSON.stringify({
        sections: [
          { fields: [{ label: 'Rating', name: 'rating', type: 'rating' }] },
        ],
      })
    )
    await page.goto('/reactive')
    await page.waitForFunction(() => '__lunaTools' in window)

    const [fill] = await list(page)
    expect(
      (fill.inputSchema.properties as Record<string, object>).rating
    ).toEqual({ maximum: 5, minimum: 1, title: 'Rating', type: 'integer' })

    expect(await call(page, 'preview_fill', { rating: 4 })).toMatchObject({
      ok: true,
      values: { rating: 4 },
    })
    await expect(page.locator('input[name="rating"]')).toHaveValue('4')
    expect(await call(page, 'preview_fill', { rating: 'four' })).toMatchObject({
      ok: false,
      skipped: [
        {
          code: 'invalid_type',
          message: 'Expected a whole number.',
          name: 'rating',
        },
      ],
    })
  })

  test('should validate what it wrote once, and show the errors on the page', async ({
    page,
  }) => {
    await open(page)
    const result = await call(page, 'preview_fill', { email: 'ada@example' })

    expect(result.ok).toBe(false)
    expect(Object.keys(result.errors as object)).toEqual(['email'])
    await expect(page.locator('[id="email-error"]')).toBeVisible()
  })

  test('should read what the form holds, hidden and locked fields apart', async ({
    page,
  }) => {
    await open(page)
    // A person's typing runs its value event once the typing stops.
    await page.locator('input[name="name"]').fill('Grace')
    await expect(page.locator('input[name="nickname"]')).toHaveValue('Grace')

    expect(
      await call(page, 'preview_read', {
        fields: ['name', 'nickname', 'card', 'frequency', 'password'],
      })
    ).toEqual({
      errors: {},
      hidden: ['frequency'],
      locked: ['card'],
      submit: { status: 'idle' },
      values: { card: null, name: 'Grace', nickname: 'Grace' },
    })
  })

  test('should find time zones by name', async ({ page }) => {
    await open(page)
    const result = await call(page, 'preview_options', {
      field: 'zone',
      text: 'bogota',
    })

    expect(result.items).toEqual([
      expect.objectContaining({ value: 'America/Bogota' }),
    ])
  })

  test('should submit as the button does, and return what the action answered', async ({
    page,
  }) => {
    await open(page)
    await call(page, 'preview_fill', { name: 'Ada' })
    const result = await call(page, 'preview_submit')

    expect(result).toMatchObject({
      data: { form: { name: 'Ada', nickname: 'Ada' } },
      ok: true,
    })
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
  })

  test('should return the errors of a submission the form refused', async ({
    page,
  }) => {
    await open(page)
    const result = await call(page, 'preview_submit')

    expect(result.ok).toBe(false)
    expect(Object.keys(result.errors as object)).toContain('name')
    await expect(page.locator('[id="name-error"]')).toBeVisible()
  })
})
