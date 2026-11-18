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
      await inject(page, JSON.stringify(NAME_ONLY))
      await page.goto('/')
      await page.locator('input[name="name"]').waitFor()
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 800))
      )
      expect(await webmcpTools(page)).toEqual([])
    })
  }
)
