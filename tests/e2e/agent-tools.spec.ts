import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// The tools a form offers an agent, called the way an agent without WebMCP
// calls them: `callTool()` from the page, which `/reactive` puts on
// `window.__lunaTools`. Every assertion that matters is about the page as well
// as the answer: what a tool says it wrote has to be what the form shows.

type Answer = Record<string, unknown>

type Tools = Readonly<{
  call: (name: string, input: object) => Promise<Answer>
  list: () => Promise<
    Array<
      Readonly<{
        description: string
        inputSchema: Answer
        name: string
        outputSchema: Answer
      }>
    >
  >
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

async function openWith(page: Page, form: object) {
  await inject(page, JSON.stringify(form))
  await page.goto('/reactive')
  await page.waitForFunction(() => '__lunaTools' in window)
}

function open(page: Page) {
  return openWith(page, JSON.parse(FORM))
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

// Every change the form hands `onValueChange`, which `/reactive` logs, in the
// order it was logged: each value is read back on its own, and one can come
// back before the one logged ahead of it.
function captureChanges(page: Page): () => Promise<Answer[]> {
  const changes: Array<Promise<Answer>> = []
  page.on('console', (message) => {
    const input = message.args()[1]
    if (message.text().startsWith('Form values changed:') && input) {
      changes.push(input.jsonValue())
    }
  })
  return () => Promise.all(changes)
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

  // A change event writes the store at once, and React draws what it shows or
  // unlocks in a transition, later on a slow page. Chromium alone lets a test
  // slow the page down.
  test(
    'should write what another value reveals on a slow page',
    { tag: ['@chromium'] },
    async ({ page }) => {
      await openWith(page, {
        sections: [
          {
            fields: [
              {
                event: {
                  change: [
                    {
                      action: 'state',
                      state: { hidden: false },
                      target: 'frequency',
                      when: 'pro',
                    },
                    {
                      action: 'state',
                      state: { disabled: false },
                      target: 'card',
                      when: 'pro',
                    },
                  ],
                },
                label: 'Plan',
                name: 'plan',
                source: [
                  { label: 'Free', value: 'free' },
                  { label: 'Pro', value: 'pro' },
                ],
                type: 'select',
              },
              {
                hidden: true,
                label: 'Frequency',
                name: 'frequency',
                source: [
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Monthly', value: 'monthly' },
                ],
                type: 'select',
              },
              {
                disabled: true,
                label: 'Card',
                name: 'card',
                type: 'input/text',
              },
              ...Array.from({ length: 150 }, (_, index) => ({
                label: `Extra ${index}`,
                name: `extra${index}`,
                type: 'input/text',
              })),
            ],
          },
        ],
      })

      const cdp = await page.context().newCDPSession(page)
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 20 })

      const result = await call(page, 'preview_fill', {
        card: '4242',
        frequency: 'monthly',
        plan: 'pro',
      })

      expect(result).toMatchObject({
        applied: ['plan', 'frequency', 'card'],
        ok: true,
        skipped: [],
      })
    }
  )

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

  test('should not write over what a person changed since the agent read the form', async ({
    page,
  }) => {
    await open(page)
    await call(page, 'preview_read')

    await page.locator('input[name="email"]').fill('person@example.com')
    await page.locator('input[name$=".sku"]').first().fill('P1')

    const result = await call(page, 'preview_fill', {
      email: 'agent@example.com',
      items: [{ sku: 'A1' }],
      name: 'Ada',
    })
    expect(result).toMatchObject({
      applied: ['name'],
      ok: false,
      values: {
        email: 'person@example.com',
        items: [{ sku: 'P1' }],
        name: 'Ada',
        nickname: 'Ada',
      },
    })
    expect(result.skipped).toEqual([
      expect.objectContaining({ code: 'changed', name: 'email' }),
      expect.objectContaining({ code: 'changed', name: 'items' }),
    ])
    await expect(page.locator('input[name="email"]')).toHaveValue(
      'person@example.com'
    )

    // What its own fill set off is the agent's, and what it was told of is
    // its to write over.
    expect(
      await call(page, 'preview_fill', {
        email: 'agent@example.com',
        nickname: 'Al',
      })
    ).toMatchObject({ applied: ['nickname', 'email'], ok: true, skipped: [] })
    await expect(page.locator('input[name="email"]')).toHaveValue(
      'agent@example.com'
    )
  })

  test('should not write a row by its position once a person moved the rows', async ({
    page,
  }) => {
    await open(page)
    await call(page, 'preview_fill', { items: [{ sku: 'A1' }, { sku: 'B2' }] })
    await page.getByRole('button', { name: 'Remove Items item 1' }).click()
    await expect(page.locator('input[name$=".sku"]')).toHaveCount(1)

    expect(
      await call(page, 'preview_fill', { 'items.0.sku': 'X' })
    ).toMatchObject({ skipped: [{ code: 'changed', name: 'items.0.sku' }] })
    await expect(page.locator('input[name$=".sku"]')).toHaveValue('B2')

    // Told what the row there holds, the agent may write it.
    expect(
      await call(page, 'preview_fill', { 'items.0.sku': 'X' })
    ).toMatchObject({ applied: ['items.0.sku'], ok: true })
    await expect(page.locator('input[name$=".sku"]')).toHaveValue('X')
  })

  test('should tell what a field holds when it already held the value sent', async ({
    page,
  }) => {
    await open(page)
    await call(page, 'preview_fill', {
      country: 'mx',
      items: [{ sku: 'A1' }],
    })

    expect(
      await call(page, 'preview_fill', {
        country: 'México',
        'items.0.sku': 'A1',
      })
    ).toMatchObject({
      applied: ['country', 'items.0.sku'],
      ok: true,
      values: { country: 'mx', 'items.0.sku': 'A1' },
    })
  })

  test("should take what a person's submission leaves as no one's change", async ({
    page,
  }) => {
    await open(page)
    await call(page, 'preview_read')
    await page.locator('input[name="name"]').fill('Ada')
    await page.getByRole('button', { name: 'Submit' }).click()
    // The form tells of its success once it has started over. Read with no
    // field, so nothing is told to the agent but that.
    await expect
      .poll(
        async () => (await call(page, 'preview_read', { fields: [] })).submit
      )
      .toMatchObject({ status: 'success' })

    expect(await call(page, 'preview_fill', { name: 'Bo' })).toMatchObject({
      applied: ['name'],
      ok: true,
    })
  })

  test('should show the person the agent at work, and what it filled', async ({
    page,
  }) => {
    await open(page)
    const fieldOf = (name: string) =>
      page
        .locator(`[name="${name}"]`)
        .first()
        .locator('xpath=ancestor::*[@data-slot="field"][1]')

    // On the form while the call runs, and off once it answered.
    const states = await page.evaluate(async () => {
      const form = document.querySelector('form')!
      const seen: boolean[] = []
      // Each change by itself: one that was not there is put on.
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          seen.push(record.oldValue === null)
        }
      })
      observer.observe(form, {
        attributeFilter: ['data-agent-active'],
        attributeOldValue: true,
      })
      await (window as Window & { __lunaTools?: Tools }).__lunaTools!.call(
        'preview_fill',
        { email: 'ada@example.com', name: 'Ada' }
      )
      seen.push(...observer.takeRecords().map((r) => r.oldValue === null))
      observer.disconnect()
      return seen
    })
    expect(states).toEqual([true, false])
    await expect(page.locator('form')).not.toHaveAttribute('data-agent-active')

    // What it wrote, and what that set off.
    for (const name of ['name', 'nickname', 'email']) {
      await expect(fieldOf(name)).toHaveAttribute('data-agent-filled')
    }
    await expect(fieldOf('country')).not.toHaveAttribute('data-agent-filled')
    await expect(page.locator('[aria-live="polite"]')).toHaveText(
      'An agent filled 3 fields'
    )

    // The person's change takes the mark off that field alone.
    await page.locator('input[name="name"]').fill('Bea')
    await expect(fieldOf('name')).not.toHaveAttribute('data-agent-filled')
    await expect(fieldOf('nickname')).toHaveAttribute('data-agent-filled')

    // A list's rows are marked, and a row the person adds takes it off them.
    await call(page, 'preview_fill', { items: [{ sku: 'A1' }] })
    const sku = page
      .locator('input[name$=".sku"]')
      .first()
      .locator('xpath=ancestor::*[@data-slot="field"][1]')
    await expect(sku).toHaveAttribute('data-agent-filled')
    await page.getByRole('button', { name: 'Add item' }).click()
    await expect(sku).not.toHaveAttribute('data-agent-filled')
  })

  test('should tell the host who made each change', async ({ page }) => {
    const changes = captureChanges(page)
    await open(page)
    const last = async (name: string) =>
      (await changes()).filter((change) => change.name === name).at(-1)
    const sourceOf = async (name: string) => (await last(name))?.source

    await call(page, 'preview_fill', {
      frequency: 'weekly',
      items: [{ sku: 'A1' }],
      name: 'Ada',
      plan: 'pro',
    })
    await expect.poll(() => sourceOf('name')).toBe('agent')
    await expect.poll(() => sourceOf('nickname')).toBe('event')
    await expect.poll(() => sourceOf('frequency')).toBe('agent')
    await expect.poll(() => sourceOf('items')).toBe('agent')
    await expect.poll(() => sourceOf('items.0.sku')).toBe('agent')

    // Hiding `frequency` clears it, and the clear is the event's, not the
    // agent's that set it off.
    await call(page, 'preview_fill', { plan: 'free' })
    await expect.poll(() => sourceOf('frequency')).toBe('event')
    expect((await last('frequency'))?.value).toBeUndefined()
    expect(await sourceOf('plan')).toBe('agent')

    await page.locator('input[name="email"]').fill('ada@example.com')
    await expect.poll(() => sourceOf('email')).toBe('user')

    await page.getByRole('button', { name: 'Add item' }).click()
    await expect
      .poll(() => last('items'))
      .toMatchObject({ source: 'user', value: [{ sku: 'A1' }, {}] })
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

  test('should name the controls of a row in a nested list by its position', async ({
    page,
  }) => {
    await openWith(page, {
      sections: [
        {
          fields: [
            {
              fields: [
                { label: 'Title', name: 'title', type: 'input/text' },
                {
                  fields: [{ label: 'Key', name: 'key', type: 'input/text' }],
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
      value: {
        groups: [
          { parts: [{ key: 'a' }], title: 'A' },
          { parts: [{ key: 'b' }], title: 'B' },
        ],
      },
    })

    // The name each control carries, in the order the page shows them.
    const names = () =>
      page
        .locator('input[name^="groups."]')
        .evaluateAll((inputs) =>
          inputs.map((input) => input.getAttribute('name'))
        )

    await call(page, 'preview_read')
    await call(page, 'preview_fill', {
      groups: [
        { parts: [{ key: 'a' }], title: 'A' },
        { parts: [{ key: 'b' }], title: 'B' },
        { parts: [{ key: 'c' }, { key: 'd' }], title: 'C' },
      ],
    })
    await expect(page.locator('input[value="d"]')).toBeVisible()
    expect(await names()).toEqual([
      'groups.0.title',
      'groups.0.parts.0.key',
      'groups.1.title',
      'groups.1.parts.0.key',
      'groups.2.title',
      'groups.2.parts.0.key',
      'groups.2.parts.1.key',
    ])

    // Twice: the rows an assignment reuses, and the ones it hands out anew.
    await call(page, 'preview_fill', {
      groups: [
        { parts: [{ key: 'e' }, { key: 'f' }], title: 'E' },
        { parts: [{ key: 'g' }], title: 'G' },
      ],
    })
    await expect(page.locator('input[value="g"]')).toBeVisible()
    expect(await names()).toEqual([
      'groups.0.title',
      'groups.0.parts.0.key',
      'groups.0.parts.1.key',
      'groups.1.title',
      'groups.1.parts.0.key',
    ])

    // A person removes the first row, then the agent sends the rows again.
    await page.getByRole('button', { name: 'Remove Groups item 1' }).click()
    await expect(page.locator('input[value="E"]')).toHaveCount(0)
    expect(await names()).toEqual(['groups.0.title', 'groups.0.parts.0.key'])

    await call(page, 'preview_read')
    await call(page, 'preview_fill', {
      groups: [
        { parts: [{ key: 'g' }], title: 'G' },
        { parts: [{ key: 'h' }, { key: 'i' }], title: 'H' },
      ],
    })
    await expect(page.locator('input[value="i"]')).toBeVisible()
    expect(await names()).toEqual([
      'groups.0.title',
      'groups.0.parts.0.key',
      'groups.1.title',
      'groups.1.parts.0.key',
      'groups.1.parts.1.key',
    ])

    // The submit reads the controls by those names, and sends every row.
    const submitted = await call(page, 'preview_submit')
    expect((submitted.data as Answer).form).toEqual({
      groups: [
        { parts: [{ key: 'g' }], title: 'G' },
        { parts: [{ key: 'h' }, { key: 'i' }], title: 'H' },
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

  test('should leave out a custom type its registration keeps from agents', async ({
    page,
  }) => {
    await openWith(page, {
      sections: [
        {
          fields: [
            { label: 'Token', name: 'token', type: 'secret' },
            { label: 'Note', name: 'note', type: 'input/text' },
            {
              fields: [{ label: 'Key', name: 'key', type: 'secret' }],
              label: 'Keys',
              name: 'keys',
              type: 'list',
            },
          ],
        },
      ],
    })

    const [fill] = await list(page)
    expect(Object.keys(fill.inputSchema.properties as object)).toEqual([
      'note',
      'keys',
    ])
    expect(JSON.stringify(fill)).not.toMatch(/token|"key"|secret/i)

    await page.locator('input[name="token"]').fill('t')
    await page.locator('input[name="keys.0.key"]').fill('k')
    expect(
      (await call(page, 'preview_read', { fields: ['token', 'note'] })).values
    ).toEqual({ note: null })
    expect(JSON.stringify(await call(page, 'preview_read'))).not.toMatch(
      /token|"key"|"t"|"k"/
    )

    expect(
      await call(page, 'preview_fill', { 'keys.0.key': 'x', token: 'x' })
    ).toMatchObject({
      ok: false,
      skipped: [
        { code: 'unknown', name: 'keys.0.key' },
        { code: 'unknown', name: 'token' },
      ],
    })
    await expect(page.locator('input[name="token"]')).toHaveValue('t')
    await expect(page.locator('input[name="keys.0.key"]')).toHaveValue('k')
    await expect(page.locator('[data-agent-filled]')).toHaveCount(0)
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

  // A name such as `required` can read as a yes or no while the field holds a
  // message: what `advanced.agent` describes reaches the agent, and the
  // person reads the label and the description drawn for them only.
  test('should tell the agent the description of advanced.agent, and draw it nowhere', async ({
    page,
  }) => {
    await openWith(page, {
      sections: [
        {
          fields: [
            {
              advanced: {
                agent: { description: 'The message shown when it is empty' },
              },
              description: 'Leave it blank for the default',
              label: 'If it is left empty',
              name: 'required',
              type: 'input/text',
            },
          ],
        },
      ],
    })
    const fill = (await list(page)).find(({ name }) => name === 'preview_fill')
    const properties = fill?.inputSchema.properties as Record<
      string,
      Readonly<{ description?: string; title?: string }>
    >

    expect(properties.required).toEqual({
      description:
        'Leave it blank for the default. The message shown when it is empty',
      title: 'If it is left empty',
      type: 'string',
    })
    const form = page.locator('form')
    await expect(
      form.getByRole('textbox', { name: 'If it is left empty' })
    ).toBeVisible()
    await expect(form.getByText('Leave it blank for the default')).toBeVisible()
    await expect(form).not.toContainText('The message shown when it is empty')
    await expect(form.locator('[agent]')).toHaveCount(0)
  })

  // The schema is built from the definition, not from what the form holds:
  // a note on a field an event shows says the rule, true while it is shown
  // as much as while it is hidden.
  test('should say what shows a field as a rule, true once it is shown', async ({
    page,
  }) => {
    await open(page)
    const describe = async () => {
      const fill = (await list(page)).find(
        ({ name }) => name === 'preview_fill'
      )
      const properties = fill?.inputSchema.properties as Record<
        string,
        Readonly<{ description?: string }>
      >
      return [properties.frequency.description, properties.card.description]
    }
    const before = await describe()

    expect(await call(page, 'preview_fill', { plan: 'pro' })).toMatchObject({
      ok: true,
    })
    await expect(
      page.getByRole('combobox', { name: 'Frequency' })
    ).toBeVisible()
    expect(
      await call(page, 'preview_read', { fields: ['frequency', 'card'] })
    ).toMatchObject({ hidden: [], locked: [] })

    expect(await describe()).toEqual(before)
    expect(before).toEqual([
      'Options: weekly (Weekly), monthly (Monthly). Shown while plan equals "pro": send it in the same call.',
      'Unlocked while plan equals "pro": send it in the same call.',
    ])
  })

  test("should read a row's hidden fields as hidden, under their route", async ({
    page,
  }) => {
    await openWith(page, {
      sections: [
        {
          fields: [
            {
              fields: [
                {
                  event: {
                    change: [
                      {
                        action: 'state',
                        state: { hidden: false },
                        target: 'body/mode',
                        when: 'group',
                      },
                      {
                        action: 'state',
                        state: { hidden: true },
                        target: 'body/value',
                        when: 'group',
                      },
                    ],
                  },
                  label: 'Kind',
                  name: 'kind',
                  source: [
                    { label: 'Text', value: 'text' },
                    { label: 'Group', value: 'group' },
                  ],
                  type: 'select',
                },
                { label: 'Value', name: 'value', type: 'input/text' },
                {
                  hidden: true,
                  label: 'Mode',
                  name: 'mode',
                  source: [
                    { label: 'Any', value: 'any' },
                    { label: 'All', value: 'all' },
                  ],
                  type: 'select',
                },
              ],
              label: 'Body',
              name: 'body',
              type: 'list',
            },
          ],
        },
      ],
    })

    await call(page, 'preview_fill', {
      body: [
        { kind: 'text', value: 'a' },
        { kind: 'group', mode: 'all' },
      ],
    })

    // As a field hidden at the top: named in hidden, left out of values, as
    // the submit leaves it out.
    const read = await call(page, 'preview_read')
    expect(read).toMatchObject({
      hidden: ['body.0.mode', 'body.1.value'],
      values: {
        body: [
          { kind: 'text', value: 'a' },
          { kind: 'group', mode: 'all' },
        ],
      },
    })
    const submitted = await call(page, 'preview_submit')
    expect((submitted.data as Answer).form).toEqual(read.values)
  })

  test('should tell the host of every call, with what it was answered', async ({
    page,
  }) => {
    await open(page)
    await page.evaluate(() => {
      const log: Answer[] = []
      Object.assign(window, { __log: log })
      window.__lunaOnCall = (call) => {
        log.push(call)
      }
    })

    const answer = await call(page, 'preview_fill', { name: 'Ada' })
    await call(page, 'preview_read', { fields: ['name'] })

    const log = await page.evaluate(
      () => (window as Window & { __log?: Answer[] }).__log
    )
    expect(log).toEqual([
      {
        duration: expect.any(Number),
        input: { name: 'Ada' },
        output: answer,
        tool: 'fill',
      },
      expect.objectContaining({
        input: { fields: ['name'] },
        output: expect.objectContaining({ values: { name: 'Ada' } }),
        tool: 'read',
      }),
    ])
  })

  test('should wait for the options a field fetches, and say which field brings them', async ({
    page,
  }) => {
    // Slow enough that the tool is asked before they arrive.
    await page.route('**/api/regions', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1_500))
      await route.fulfill({
        body: JSON.stringify([
          { label: 'Andes', value: 'andes' },
          { label: 'Caribe', value: 'caribe' },
        ]),
        contentType: 'application/json',
      })
    })
    await page.route('**/api/cities*', (route) =>
      route.fulfill({
        body: JSON.stringify([{ label: 'Bogotá', value: 'bog' }]),
        contentType: 'application/json',
      })
    )
    await openWith(page, {
      sections: [
        {
          fields: [
            {
              label: 'Region',
              name: 'region',
              source: { url: '/api/regions' },
              type: 'select',
            },
            {
              event: {
                change: [
                  {
                    action: 'source',
                    source: { url: '/api/cities?kind={value}' },
                    target: 'city',
                  },
                ],
              },
              label: 'Kind',
              name: 'kind',
              source: [{ label: 'Capital', value: 'capital' }],
              type: 'select',
            },
            { label: 'City', name: 'city', type: 'select' },
          ],
        },
      ],
    })

    expect(await call(page, 'preview_options', { field: 'region' })).toEqual({
      items: [
        { label: 'Andes', value: 'andes' },
        { label: 'Caribe', value: 'caribe' },
      ],
    })

    expect(await call(page, 'preview_options', { field: 'city' })).toEqual({
      items: [],
      message: 'Its options come from kind: fill it first, then ask again.',
    })
    await call(page, 'preview_fill', { kind: 'capital' })
    expect(await call(page, 'preview_options', { field: 'city' })).toEqual({
      items: [{ label: 'Bogotá', value: 'bog' }],
    })
  })

  test('should take an option fetched by its label, as its description says', async ({
    page,
  }) => {
    await page.route('**/api/regions', (route) =>
      route.fulfill({
        body: JSON.stringify([
          { label: 'Andes', value: 'r-01' },
          { label: 'Caribe', value: 'r-02' },
        ]),
        contentType: 'application/json',
      })
    )
    await openWith(page, {
      sections: [
        {
          fields: [
            {
              label: 'Region',
              name: 'region',
              source: { url: '/api/regions' },
              type: 'select',
            },
          ],
        },
      ],
    })

    const fill = (await list(page)).find((tool) => tool.name === 'preview_fill')
    expect(fill?.inputSchema).toMatchObject({
      properties: {
        region: {
          description:
            'Its options are not listed here: find them with the options tool of this form. Pass an option by its value or its label.',
        },
      },
    })

    expect(await call(page, 'preview_options', { field: 'region' })).toEqual({
      items: [
        { label: 'Andes', value: 'r-01' },
        { label: 'Caribe', value: 'r-02' },
      ],
    })
    expect(
      await call(page, 'preview_fill', { region: 'caribe' })
    ).toMatchObject({
      applied: ['region'],
      ok: true,
      values: { region: 'r-02' },
    })
    await expect(page.getByRole('combobox', { name: 'Region' })).toHaveText(
      'Caribe'
    )
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

const PLANS = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
]

test.describe(
  'Agent tools, what the form does with them',
  { tag: ['@e2e'] },
  () => {
    // What fill says it wrote has to be what the action receives: in an early
    // version a select sent the label of its option instead of its value.
    test('should send the action what fill reported, field type by field type', async ({
      page,
    }) => {
      await openWith(page, {
        sections: [
          {
            fields: [
              { label: 'Name', name: 'name', type: 'input/text' },
              { label: 'Email', name: 'email', type: 'input/email' },
              { label: 'Age', name: 'age', type: 'input/number' },
              { label: 'Birthday', name: 'birthday', type: 'input/date' },
              { label: 'Start', name: 'start', type: 'input/time' },
              {
                label: 'Country',
                name: 'country',
                source: JSON.parse(COUNTRIES),
                type: 'select',
              },
              { label: 'Plan', name: 'plan', source: PLANS, type: 'radio' },
              { label: 'Agree', name: 'agree', type: 'checkbox' },
              {
                label: 'Tags',
                name: 'tags',
                source: JSON.parse(COUNTRIES),
                type: 'chips',
              },
              {
                fields: [{ label: 'SKU', name: 'sku', type: 'input/text' }],
                label: 'Items',
                name: 'items',
                type: 'list',
              },
            ],
          },
        ],
      })

      const filled = await call(page, 'preview_fill', {
        age: 42,
        agree: true,
        birthday: '1906-12-09',
        country: 'mx',
        email: 'ada@example.com',
        items: [{ sku: 'A1' }, { sku: 'B2' }],
        name: 'Ada',
        plan: 'pro',
        start: '09:30',
        tags: ['co', 'mx'],
      })
      expect(filled.ok).toBe(true)

      const submitted = await call(page, 'preview_submit')
      expect(submitted.ok).toBe(true)
      // A time is submitted with its seconds, as a time input sends it when a
      // person picks one.
      expect((submitted.data as Answer).form).toEqual({
        ...(filled.values as Answer),
        start: '09:30:00',
      })
    })

    test('should report what a value event filled in, through the transform of its target', async ({
      page,
    }) => {
      await openWith(page, {
        sections: [
          {
            fields: [
              {
                event: {
                  change: [{ action: 'value', value: { nickname: '{value}' } }],
                },
                label: 'Name',
                name: 'name',
                type: 'input/text',
              },
              {
                advanced: { transform: ['uppercase'] },
                label: 'Nickname',
                name: 'nickname',
                type: 'input/text',
              },
            ],
          },
        ],
      })

      expect(
        (await call(page, 'preview_fill', { name: 'ada' })).values
      ).toEqual({ name: 'ada', nickname: 'ADA' })
      await expect(page.locator('input[name="nickname"]')).toHaveValue('ADA')
    })

    test('should wait for allow, and pass on the reason it refuses with', async ({
      page,
    }) => {
      await open(page)
      await page.evaluate(() => {
        ;(
          window as Window & {
            __lunaAllow?: (call: {
              tool: string
            }) => boolean | string | Promise<boolean>
          }
        ).__lunaAllow = (call) =>
          call.tool === 'submit'
            ? 'Ask the person first.'
            : new Promise((resolve) => setTimeout(() => resolve(true), 200))
      })

      expect(await call(page, 'preview_fill', { name: 'Ada' })).toMatchObject({
        applied: ['name'],
        ok: true,
      })
      expect(await call(page, 'preview_submit')).toEqual({
        code: 'refused',
        message: 'Ask the person first.',
        ok: false,
      })
      await expect(page.getByText('Form submitted successfully')).toHaveCount(0)
    })

    test('should tell the agent the form is gone when it leaves the page while allow is asked', async ({
      page,
    }) => {
      await open(page)
      await page.evaluate(() => {
        const page = window as Window & {
          __lunaAllow?: () => Promise<boolean>
          __lunaFilled?: Answer
          __lunaTools?: Tools
        }
        page.__lunaAllow = () => new Promise<boolean>(() => {})
        void page
          .__lunaTools!.call('preview_fill', { name: 'Ada' })
          .then((answer) => {
            page.__lunaFilled = answer
          })
      })

      // Another page of the app, without a reload: the form unmounts and the
      // call still waiting is answered.
      await page.evaluate(() =>
        (
          window as Window & {
            next: { router: { push: (href: string) => void } }
          }
        ).next.router.push('/')
      )
      await expect(page).not.toHaveURL(/\/reactive$/)

      await expect
        .poll(() =>
          page.evaluate(
            () => (window as Window & { __lunaFilled?: Answer }).__lunaFilled
          )
        )
        .toEqual({
          code: 'refused',
          message:
            'The form is no longer on the page, so the call changed nothing. Ask your user before you try again.',
          ok: false,
        })
    })

    test('should say a submission waits for a person until when, and answer within 15 seconds while it does', async ({
      page,
    }) => {
      await open(page)
      expect((await list(page)).at(-1)?.description).toContain(
        'A person may need to approve it first.'
      )

      // A person who has not answered yet. The page's clock is the test's from
      // here: no real wait of 15 seconds.
      await page.clock.install()
      await page.evaluate(() => {
        const page = window as Window & {
          __lunaAllow?: (
            call: object,
            options: { deadline: number }
          ) => Promise<boolean>
          __lunaAsked?: number
          __lunaDeadline?: number
          __lunaSubmitted?: Answer
          __lunaTools?: Tools
        }
        page.__lunaAllow = (_call, { deadline }) => {
          page.__lunaDeadline = deadline
          return new Promise<boolean>(() => {})
        }
        page.__lunaAsked = Date.now()
        void page.__lunaTools!.call('preview_submit', {}).then((answer) => {
          page.__lunaSubmitted = answer
        })
      })

      // The host is told when the wait ends, five minutes after it asked, and
      // the agent reads the same time.
      const { submit } = await call(page, 'preview_read')
      const { asked, deadline, read } = await page.evaluate(() => {
        const page = window as Window & {
          __lunaAsked?: number
          __lunaDeadline?: number
        }
        return {
          asked: page.__lunaAsked ?? 0,
          deadline: page.__lunaDeadline ?? 0,
          read: Date.now(),
        }
      })
      expect(deadline).toBeGreaterThanOrEqual(asked + 5 * 60_000)
      expect(deadline).toBeLessThanOrEqual(read + 5 * 60_000)
      expect(submit).toEqual({
        deadline: new Date(deadline).toISOString(),
        status: 'awaiting_approval',
      })
      await page.clock.runFor(15_000)
      expect(
        await page.evaluate(
          () =>
            (window as Window & { __lunaSubmitted?: Answer }).__lunaSubmitted
        )
      ).toEqual({
        message:
          'The submission waits for a person to approve it: call preview_read for its outcome.',
        pending: true,
      })
      await expect(page.getByText('Form submitted successfully')).toHaveCount(0)
    })

    test('should offer the options tool only when a field needs it, and return 50 at most', async ({
      page,
    }) => {
      await open(page)
      const result = await call(page, 'preview_options', {
        field: 'zone',
        text: 'america',
      })
      expect(result.items).toHaveLength(50)
      expect(result.more).toBeGreaterThan(0)

      await openWith(page, {
        sections: [
          { fields: [{ label: 'Name', name: 'name', type: 'input/text' }] },
        ],
      })
      expect((await list(page)).map((tool) => tool.name)).toEqual([
        'preview_fill',
        'preview_read',
        'preview_submit',
      ])
    })

    test('should offer no submit when the form is offered without it', async ({
      page,
    }) => {
      await openWith(page, {
        agent: { submit: false },
        sections: [
          { fields: [{ label: 'Name', name: 'name', type: 'input/text' }] },
        ],
      })
      expect((await list(page)).map((tool) => tool.name)).toEqual([
        'preview_fill',
        'preview_read',
      ])
    })

    // Several forms on one page: an agent tells their tools apart by title.
    test("should title the tools after the form's name, or the host's title", async ({
      page,
    }) => {
      const titles = async () => (await list(page)).map((tool) => tool.title)
      await openWith(page, NAME_ONLY)
      expect(await titles()).toEqual([
        'Fill: preview',
        'Read: preview',
        'Submit: preview',
      ])

      await swap(page, { ...NAME_ONLY, agent: { title: 'Question 2' } })
      await expect
        .poll(titles)
        .toEqual(['Fill: Question 2', 'Read: Question 2', 'Submit: Question 2'])
    })

    // A host whose one form edits whichever item is open: an agent that read
    // one item and fills after the person opened another is writing to the
    // wrong one. The host hands the form the item's values, or draws it anew.
    for (const remount of [false, true]) {
      test(`should not fill the item opened since the agent read another${remount ? ', the form drawn anew' : ''}`, async ({
        page,
      }) => {
        const A = { name: 'Alpha' }
        await openWith(page, {
          agent: { target: 'A' },
          host: { items: { A, B: { name: 'Beta' } }, remount },
          sections: [
            { fields: [{ label: 'Name', name: 'name', type: 'input/text' }] },
          ],
          value: A,
        })
        const name = page.getByRole('textbox', { name: 'Name' })
        expect(await call(page, 'preview_read')).toMatchObject({
          target: 'A',
          values: { name: 'Alpha' },
        })

        await page.getByRole('button', { name: 'Open B' }).click()
        await expect(name).toHaveValue('Beta')

        // Neither written nor sent: both were meant for A.
        for (const [tool, input] of [
          ['preview_fill', { name: 'Alpha, renamed' }],
          ['preview_submit', {}],
        ] as const) {
          expect(await call(page, tool, input)).toEqual({
            code: 'target_changed',
            message: expect.stringContaining('preview_read'),
            ok: false,
            target: 'B',
          })
        }
        await expect(name).toHaveValue('Beta')
        expect((await call(page, 'preview_read')).submit).toEqual({
          status: 'idle',
        })

        // Read, the agent knows it edits B.
        expect(await call(page, 'preview_read')).toMatchObject({
          target: 'B',
          values: { name: 'Beta' },
        })
        expect(
          await call(page, 'preview_fill', { name: 'Beta, renamed' })
        ).toMatchObject({ ok: true, target: 'B' })
        await expect(name).toHaveValue('Beta, renamed')
      })
    }

    // An agent told of a submission looks for a way to send it.
    test('should speak of no submission, nor read one, when the form is offered without submit', async ({
      page,
    }) => {
      await openWith(page, {
        agent: { description: 'Signs a person up.', submit: false },
        sections: [
          {
            fields: [
              {
                label: 'Name',
                name: 'name',
                required: true,
                type: 'input/text',
              },
            ],
          },
        ],
      })
      const tools = await list(page)
      for (const tool of tools) {
        expect(tool.description).not.toMatch(/submi/i)
      }
      expect(tools[0].description).toContain('Required fields: name.')
      expect(tools[1].outputSchema.properties).not.toHaveProperty('submit')
      expect(await call(page, 'preview_read')).toEqual({
        errors: {},
        hidden: [],
        locked: [],
        values: { name: null },
      })
    })

    test('should answer pending while a submission a person started is running', async ({
      page,
    }) => {
      await open(page)
      await page.locator('input[name="name"]').fill('Ada')
      await page.getByRole('button', { name: 'Submit' }).click()

      expect(await call(page, 'preview_submit')).toEqual({
        message:
          'The submission is still running: call preview_read for its outcome.',
        pending: true,
      })
      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      expect((await call(page, 'preview_read')).submit).toMatchObject({
        status: 'success',
      })
    })

    test('should answer the outcome of a submission that checks nothing', async ({
      page,
    }) => {
      await openWith(page, {
        host: { validateOnSubmit: false },
        sections: [
          {
            fields: [
              {
                label: 'Name',
                name: 'name',
                required: true,
                type: 'input/text',
              },
              {
                label: 'VAT',
                name: 'vat',
                type: 'input/text',
                validation: {
                  requiredWhen: { field: 'name', operator: 'eq', value: 'Co' },
                },
              },
            ],
          },
        ],
      })

      // A rule only a submit checks is not mentioned.
      const [fill] = await list(page)
      expect(
        (fill.inputSchema.properties as Record<string, object>).vat
      ).toEqual({ title: 'VAT', type: 'string' })

      // Nothing stops it, and it ends: a second one is sent rather than
      // answered pending.
      for (let round = 0; round < 2; round++) {
        expect(await call(page, 'preview_submit')).toMatchObject({ ok: true })
        expect((await call(page, 'preview_read')).submit).toMatchObject({
          status: 'success',
        })
      }
    })

    for (const { error, fail } of [
      { error: { title: 'The host did not accept the form.' }, fail: 'answer' },
      {
        error: {
          details: ['The host could not be reached.'],
          title: 'An unexpected error occurred submitting the form.',
        },
        fail: 'throw',
      },
    ]) {
      test(`should answer the failure of a submission that checks nothing (${fail})`, async ({
        page,
      }) => {
        await openWith(page, {
          host: { fail, validateOnSubmit: false },
          sections: [
            {
              fields: [{ label: 'Name', name: 'name', type: 'input/text' }],
            },
          ],
        })

        expect(await call(page, 'preview_fill', { name: 'Ada' })).toMatchObject(
          { ok: true }
        )
        // It ends as a failure, not pending, and a second one is sent too.
        for (let round = 0; round < 2; round++) {
          expect(await call(page, 'preview_submit')).toEqual({
            error,
            errors: {},
            ok: false,
          })
          expect((await call(page, 'preview_read')).submit).toMatchObject({
            error,
            status: 'error',
          })
        }
        await expect(page.locator('input[name="name"]')).toHaveValue('Ada')
      })
    }

    test('should answer calls one at a time, and busy past ten waiting', async ({
      page,
    }) => {
      await open(page)
      await list(page)
      const answers = await page.evaluate(() => {
        const tools = (window as Window & { __lunaTools?: Tools }).__lunaTools!
        return Promise.all(
          Array.from({ length: 11 }, (_, index) =>
            tools.call('preview_fill', {
              name: `Call ${index}`,
              plan: index % 2 === 0 ? 'pro' : 'free',
            })
          )
        )
      })

      expect(answers.filter((answer) => answer.code === 'busy')).toHaveLength(1)
      // Every call comes in before the first is answered: ten wait, one does not.
      expect(answers[10]).toMatchObject({ code: 'busy' })
      await expect(page.locator('input[name="name"]')).toHaveValue('Call 9')
    })

    test('should read and write the form a submit started over, a list included', async ({
      page,
    }) => {
      await openWith(page, {
        sections: [
          {
            fields: [
              { label: 'Name', name: 'name', type: 'input/text' },
              {
                fields: [{ label: 'SKU', name: 'sku', type: 'input/text' }],
                label: 'Items',
                name: 'items',
                type: 'list',
              },
            ],
          },
        ],
      })
      await page.locator('input[name="name"]').fill('Ada')

      // In one go, as an agent does: the submit answers once the form has
      // started over, from what the host keeps of what was reported.
      const [submitted, read] = await page.evaluate(async () => {
        const tools = (window as Window & { __lunaTools?: Tools }).__lunaTools!
        return [
          await tools.call('preview_submit', {}),
          await tools.call('preview_read', {}),
        ]
      })
      expect(submitted.ok).toBe(true)
      expect(read.values).toMatchObject({ name: 'Ada' })
      const filled = await call(page, 'preview_fill', {
        items: [{ sku: 'A1' }, { sku: 'B2' }],
      })
      expect(filled).toMatchObject({
        ok: true,
        values: { items: [{ sku: 'A1' }, { sku: 'B2' }] },
      })
      await expect(page.locator('input[name$=".sku"]')).toHaveCount(2)
    })

    test('should write a value again after a submission reset the form', async ({
      page,
    }) => {
      await open(page)
      await call(page, 'preview_fill', { name: 'Ada' })
      expect((await call(page, 'preview_submit')).ok).toBe(true)

      expect(await call(page, 'preview_fill', { name: 'Ada' })).toMatchObject({
        applied: ['name'],
        ok: true,
      })
      await expect(page.locator('input[name="name"]')).toHaveValue('Ada')
    })

    // A person can neither add nor remove a row of a fixed list, and neither
    // can an agent: not of one inside a row of another list sent whole.
    test('should keep the rows of a fixed list nested in a list sent whole', async ({
      page,
    }) => {
      await openWith(page, {
        sections: [
          {
            fields: [
              {
                fields: [
                  { label: 'Title', name: 'title', type: 'input/text' },
                  {
                    advanced: { fixed: true, length: { min: 1 } },
                    fields: [
                      { label: 'Check', name: 'check', type: 'input/text' },
                    ],
                    name: 'checks',
                    type: 'list',
                  },
                ],
                name: 'groups',
                type: 'list',
              },
            ],
          },
        ],
        value: {
          groups: [{ checks: [{ check: 'x' }, { check: 'y' }], title: 'A' }],
        },
      })
      const second = page.locator('input[name="groups.0.checks.1.check"]')
      await expect(second).toHaveValue('y')

      // One row less in a row the list holds, and one more in a row the call
      // adds, which opens with one.
      for (const groups of [
        [{ checks: [{ check: 'z' }], title: 'B' }],
        [
          { checks: [{ check: 'x' }, { check: 'y' }], title: 'A' },
          { checks: [{ check: 'p' }, { check: 'q' }], title: 'C' },
        ],
      ]) {
        const answer = await call(page, 'preview_fill', { groups })
        expect(answer.ok).toBe(false)
        expect(answer.skipped).toEqual([
          expect.objectContaining({ code: 'rows_fixed', name: 'groups' }),
        ])
      }
      await expect(second).toHaveValue('y')
      await expect(page.locator('input[name="groups.0.title"]')).toHaveValue(
        'A'
      )

      // The rows it holds, corrected, and a new row with the one it opens
      // with.
      expect(
        await call(page, 'preview_fill', {
          groups: [
            { checks: [{ check: 'x1' }, { check: 'y1' }], title: 'B' },
            { checks: [{ check: 'p' }], title: 'C' },
          ],
        })
      ).toMatchObject({ applied: ['groups'], ok: true })
      await expect(second).toHaveValue('y1')
      await expect(
        page.locator('input[name="groups.1.checks.0.check"]')
      ).toHaveValue('p')
    })

    // A row keeps its name when a person removes the one before it, so the
    // rows a fixed list in it holds are found by position, not by that name.
    test('should count the rows of a nested fixed list by position after a person removes a row', async ({
      page,
    }) => {
      await openWith(page, {
        sections: [
          {
            fields: [
              {
                fields: [
                  { label: 'Title', name: 'title', type: 'input/text' },
                  {
                    advanced: { fixed: true, length: { min: 1 } },
                    fields: [
                      { label: 'Check', name: 'check', type: 'input/text' },
                    ],
                    name: 'checks',
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
        value: {
          groups: [
            { checks: [{ check: 'a' }], title: 'A' },
            { checks: [{ check: 'x' }, { check: 'y' }], title: 'B' },
          ],
        },
      })
      await page.getByRole('button', { name: 'Remove Groups item 1' }).click()
      await expect(page.locator('input[value="A"]')).toHaveCount(0)
      // What a person changed is not written over until the agent reads it.
      await call(page, 'preview_read')

      const one = await call(page, 'preview_fill', {
        groups: [{ checks: [{ check: 'z' }], title: 'B' }],
      })
      expect(one.skipped).toEqual([
        expect.objectContaining({ code: 'rows_fixed', name: 'groups' }),
      ])

      expect(
        await call(page, 'preview_fill', {
          groups: [{ checks: [{ check: 'x1' }, { check: 'y1' }], title: 'B' }],
        })
      ).toMatchObject({
        ok: true,
        values: {
          groups: [{ checks: [{ check: 'x1' }, { check: 'y1' }], title: 'B' }],
        },
      })
    })

    // The rows a fixed list is corrected in come from somewhere else: here, a
    // value the same call writes first.
    test('should write a fixed list whose rows a value the same call writes brings', async ({
      page,
    }) => {
      await openWith(page, {
        sections: [
          {
            fields: [
              {
                event: {
                  change: [
                    {
                      action: 'value',
                      value: {
                        items: [{ sku: 'a' }, { sku: 'b' }, { sku: 'c' }],
                      },
                    },
                  ],
                },
                label: 'Order',
                name: 'order',
                type: 'input/text',
              },
              {
                advanced: { fixed: true, length: { min: 0 } },
                fields: [{ label: 'SKU', name: 'sku', type: 'input/text' }],
                name: 'items',
                type: 'list',
              },
            ],
          },
        ],
      })

      expect(
        await call(page, 'preview_fill', {
          items: [{ sku: 'A' }, { sku: 'B' }, { sku: 'C' }],
          order: 'o-1',
        })
      ).toMatchObject({ ok: true, skipped: [] })
      for (const [index, sku] of ['A', 'B', 'C'].entries()) {
        await expect(
          page.locator(`input[name="items.${index}.sku"]`)
        ).toHaveValue(sku)
      }
    })
  }
)

type ModelContextTools = Readonly<{
  executeTool: (tool: object, input: object) => Promise<string | Answer>
  getTools: () => Promise<
    Array<
      Readonly<{
        annotations: Answer
        inputSchema: string | Answer
        name: string
      }>
    >
  >
}>

// What WebMCP hands back, a schema or an answer: text in some versions, an
// object in others.
function schemaOf(schema: string | Answer): Answer {
  return typeof schema === 'string' ? JSON.parse(schema) : schema
}

type WebMCPWindow = Window & { __toolChanges?: number }

// Counts what WebMCP tells the page about its tools changing.
function countToolChanges() {
  const counted = window as WebMCPWindow
  counted.__toolChanges = 0
  const modelContext = (document as Document & { modelContext?: EventTarget })
    .modelContext
  modelContext?.addEventListener('toolchange', () => {
    counted.__toolChanges = (counted.__toolChanges ?? 0) + 1
  })
}

function webmcpTools(page: Page) {
  return page.evaluate(async () => {
    const modelContext = (
      document as Document & { modelContext: ModelContextTools }
    ).modelContext
    return (await modelContext.getTools()).map((tool) => ({
      annotations: tool.annotations,
      inputSchema: tool.inputSchema,
      name: tool.name,
    }))
  })
}

// Replaces the definition without a reload, the way the editor does when its
// JSON changes. Written with indentation, so the same definition is new text
// all the same, as it is when someone edits it.
async function swap(page: Page, form: object) {
  await page.evaluate(
    (code) => {
      window.localStorage.setItem('luna-editor:code', code)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'luna-editor:code',
          newValue: code,
          storageArea: window.localStorage,
        })
      )
    },
    JSON.stringify(JSON.stringify(form, null, 2))
  )
}

const NAME_ONLY = {
  sections: [{ fields: [{ label: 'Name', name: 'name', type: 'input/text' }] }],
}

test.describe(
  'Agent tools through WebMCP',
  { tag: ['@e2e', '@webmcp'] },
  () => {
    // The project turns WebMCP on; a browser without it is a broken setup,
    // not a form that offers nothing.
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
      expect(
        await page.evaluate(() => 'modelContext' in document),
        'This browser has no document.modelContext: run the chromium-webmcp project'
      ).toBe(true)
    })

    test('should register the tools on mount, marked as what they do, and run them', async ({
      page,
    }) => {
      await openWith(page, NAME_ONLY)
      await expect
        .poll(async () => (await webmcpTools(page)).map((tool) => tool.name))
        .toEqual(['preview_fill', 'preview_read', 'preview_submit'])

      // What the form marks each tool with; the browser may add its defaults.
      const tools = await webmcpTools(page)
      expect(tools.map((tool) => tool.annotations)).toEqual([
        expect.objectContaining({ untrustedContentHint: true }),
        expect.objectContaining({
          readOnlyHint: true,
          untrustedContentHint: true,
        }),
        expect.objectContaining({
          consequentialHint: true,
          untrustedContentHint: true,
        }),
      ])
      expect(schemaOf(tools[0].inputSchema).properties).toHaveProperty('name')

      const result = await page.evaluate(async () => {
        const modelContext = (
          document as Document & { modelContext: ModelContextTools }
        ).modelContext
        const [fill] = await modelContext.getTools()
        return modelContext.executeTool(fill, { name: 'Ada' })
      })
      // The answer comes back as text, as the specification has it.
      expect(schemaOf(result)).toMatchObject({ applied: ['name'], ok: true })
      await expect(page.locator('input[name="name"]')).toHaveValue('Ada')
    })

    test('should register again only when the tools come out different', async ({
      page,
    }) => {
      await page.addInitScript(countToolChanges)
      await openWith(page, NAME_ONLY)
      await expect.poll(async () => (await webmcpTools(page)).length).toBe(3)
      // The count is worth something only if registering is counted.
      expect(
        await page.evaluate(() => (window as WebMCPWindow).__toolChanges)
      ).toBeGreaterThan(0)

      // The same definition, a new object: nothing to register again.
      await page.evaluate(() => {
        ;(window as WebMCPWindow).__toolChanges = 0
      })
      await swap(page, NAME_ONLY)
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 800))
      )
      expect(
        await page.evaluate(() => (window as WebMCPWindow).__toolChanges)
      ).toBe(0)

      // Another field: the fill tool takes it, half a second later.
      await swap(page, {
        sections: [
          {
            fields: [
              { label: 'Name', name: 'name', type: 'input/text' },
              { label: 'City', name: 'city', type: 'input/text' },
            ],
          },
        ],
      })
      await expect
        .poll(async () => {
          const [fill] = await webmcpTools(page)
          return fill
            ? Object.keys(schemaOf(fill.inputSchema).properties as Answer)
            : []
        })
        .toEqual(['name', 'city'])
    })

    // Which item the form edits is read on every call.
    test('should register nothing again when the host opens another item', async ({
      page,
    }) => {
      await page.addInitScript(countToolChanges)
      await openWith(page, {
        ...NAME_ONLY,
        agent: { target: 'A' },
        host: { items: { A: { name: 'Alpha' }, B: { name: 'Beta' } } },
        value: { name: 'Alpha' },
      })
      await expect.poll(async () => (await webmcpTools(page)).length).toBe(3)
      await page.evaluate(() => {
        ;(window as WebMCPWindow).__toolChanges = 0
      })

      await page.getByRole('button', { name: 'Open B' }).click()
      await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(
        'Beta'
      )
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 800))
      )
      expect(
        await page.evaluate(() => (window as WebMCPWindow).__toolChanges)
      ).toBe(0)
      expect(await call(page, 'preview_read')).toMatchObject({ target: 'B' })
    })

    test('should keep the tools registered when a submit starts the form over', async ({
      page,
    }) => {
      await page.addInitScript(countToolChanges)
      await openWith(page, NAME_ONLY)
      await expect.poll(async () => (await webmcpTools(page)).length).toBe(3)
      await page.evaluate(() => {
        ;(window as WebMCPWindow).__toolChanges = 0
      })

      expect((await call(page, 'preview_submit')).ok).toBe(true)
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 800))
      )

      expect(
        await page.evaluate(() => (window as WebMCPWindow).__toolChanges)
      ).toBe(0)
      expect((await call(page, 'preview_fill', { name: 'Grace' })).ok).toBe(
        true
      )
    })

    test('should take the tools down under the name the form leaves', async ({
      page,
    }) => {
      await openWith(page, NAME_ONLY)
      await expect.poll(async () => (await webmcpTools(page)).length).toBe(3)

      await swap(page, { ...NAME_ONLY, agent: { name: 'renamed' } })
      await expect
        .poll(async () => (await webmcpTools(page)).map((tool) => tool.name))
        .toEqual(['renamed_fill', 'renamed_read', 'renamed_submit'])
    })

    test('should register nothing under a name some consumer would refuse', async ({
      page,
    }) => {
      await openWith(page, { ...NAME_ONLY, agent: { name: 'not a name' } })
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 800))
      )
      expect(await webmcpTools(page)).toEqual([])
    })

    test('should register nothing for a form without agent', async ({
      page,
    }) => {
      await inject(page, JSON.stringify({ ...NAME_ONLY, agent: false }))
      await page.goto('/reactive')
      await page.locator('input[name="name"]').waitFor()
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 800))
      )
      expect(await webmcpTools(page)).toEqual([])
    })
  }
)
