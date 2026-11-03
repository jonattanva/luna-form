import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A list inside a row of another list, declared with `keepValue`, keeps what
// its rows hold through a hide. Showing it again has to give the rows back on
// screen as well, not only in what the form reports.
//
// The row below is the shape that found it: one field two kinds share. "Group"
// shows the inner list; "List" hides it and asks what kind of items, and
// "Detailed" shows the same inner list again. Going from a group to a detailed
// list is one change that hides it and a later one that shows it.
const definition = (keepValue: boolean) =>
  JSON.stringify({
    sections: [
      {
        fields: [
          {
            name: 'field',
            type: 'list',
            advanced: { length: { min: 1 } },
            fields: [
              {
                name: 'type',
                type: 'chips',
                advanced: {
                  multiple: false,
                  options: { label: 'name', value: 'id' },
                },
                source: [
                  { id: 'text', name: 'Text' },
                  { id: 'group', name: 'Group' },
                  { id: 'list', name: 'List' },
                ],
                event: {
                  change: [
                    {
                      action: 'state',
                      target: 'field/kind',
                      state: { hidden: false },
                      when: ['list'],
                    },
                    {
                      action: 'state',
                      target: 'field/inner',
                      state: { hidden: false },
                      when: ['group'],
                    },
                  ],
                },
              },
              {
                name: 'kind',
                type: 'chips',
                hidden: true,
                advanced: {
                  multiple: false,
                  options: { label: 'name', value: 'id' },
                },
                source: [
                  { id: 'simple', name: 'Simple' },
                  { id: 'detailed', name: 'Detailed' },
                ],
                event: {
                  change: [
                    {
                      action: 'state',
                      target: 'field/inner',
                      state: { hidden: false },
                      when: ['detailed'],
                    },
                  ],
                },
              },
              {
                label: 'Inside',
                name: 'inner',
                type: 'list',
                hidden: true,
                advanced: {
                  action: 'Add a field',
                  keepValue,
                  length: { min: 0 },
                },
                fields: [{ label: 'Label', name: 'label', type: 'input/text' }],
              },
            ],
          },
        ],
      },
    ],
  })

const chip = (page: Page, name: string) =>
  page.locator('button').filter({ hasText: new RegExp(`^${name}$`) })

// By position, not by name: a row's name carries its stable id, which is not
// its position once a row before it has been removed.
const labels = (page: Page) =>
  page.locator('input[name^="field.0.inner."][name$=".label"]')

const addInner = (page: Page) =>
  page.getByRole('button', { name: 'Add a field' })

/** A group holding two rows, typed by hand. */
async function groupWithRows(page: Page, path: string, keepValue = true) {
  await inject(page, definition(keepValue))
  await page.goto(path)

  await chip(page, 'Group').click()
  await addInner(page).click()
  await labels(page).nth(0).fill('Name')
  await addInner(page).click()
  await labels(page).nth(1).fill('Phone')

  // What the rows hold before the hide, so a fill that never landed cannot
  // read later as a value the hide lost.
  await expect(labels(page)).toHaveCount(2)
  await expect(labels(page).nth(0)).toHaveValue('Name')
  await expect(labels(page).nth(1)).toHaveValue('Phone')
}

for (const [form, path] of [
  ['the host holds the values', '/reactive'],
  ['the form holds its own values', ''],
] as const) {
  test.describe(`A nested list, when ${form}`, { tag: ['@e2e'] }, () => {
    test('that keeps its value shows its rows again when a later change shows it', async ({
      page,
    }) => {
      await groupWithRows(page, path)

      await chip(page, 'List').click()
      await expect(labels(page)).toHaveCount(0)

      await chip(page, 'Detailed').click()
      await expect(labels(page)).toHaveCount(2)
      await expect(labels(page).nth(0)).toHaveValue('Name')
      await expect(labels(page).nth(1)).toHaveValue('Phone')
    })

    test('that keeps its value shows its rows again when the same rule shows it', async ({
      page,
    }) => {
      await groupWithRows(page, path)

      await chip(page, 'Text').click()
      await expect(labels(page)).toHaveCount(0)

      await chip(page, 'Group').click()
      await expect(labels(page)).toHaveCount(2)
      await expect(labels(page).nth(0)).toHaveValue('Name')
      await expect(labels(page).nth(1)).toHaveValue('Phone')
    })

    test('that keeps its value adds a new, empty row after the ones it showed again', async ({
      page,
    }) => {
      await groupWithRows(page, path)

      // A row removed before the hide leaves the survivor away from the
      // front, which is where a remount that renumbered the rows would show
      // the wrong value or bring the removed one back.
      await page.getByRole('button', { name: 'Remove Inside item 1' }).click()
      await expect(labels(page)).toHaveCount(1)
      await expect(labels(page).nth(0)).toHaveValue('Phone')

      await chip(page, 'Text').click()
      await chip(page, 'Group').click()
      await expect(labels(page)).toHaveCount(1)
      await expect(labels(page).nth(0)).toHaveValue('Phone')

      await addInner(page).click()
      await expect(labels(page)).toHaveCount(2)
      await expect(labels(page).nth(0)).toHaveValue('Phone')
      await expect(labels(page).nth(1)).toHaveValue('')
    })

    // The twin that keeps nothing: what a hide drops stays dropped, rows and
    // all, so the list comes back at its `min` of none.
    test('that does not keep its value comes back without its rows', async ({
      page,
    }) => {
      await groupWithRows(page, path, false)

      await chip(page, 'Text').click()
      await expect(labels(page)).toHaveCount(0)

      await chip(page, 'Group').click()
      await expect(addInner(page)).toBeVisible()
      await expect(labels(page)).toHaveCount(0)
    })
  })
}

// What the form sends, read off the request to the action: the page shows the
// last answer until the new one renders.
async function submitted(page: Page): Promise<unknown> {
  const request = page.waitForRequest((sent) => sent.method() === 'POST')
  await page.getByRole('button', { name: 'Submit' }).click()
  const [sent] = JSON.parse((await request).postData() ?? '[]')
  await expect(page.getByText('Form submitted successfully')).toBeVisible()
  return sent
}

/** A `type` chips whose "Group" shows `target`. */
const showsOn = (target: string) => ({
  name: 'type',
  type: 'chips',
  advanced: { multiple: false, options: { label: 'name', value: 'id' } },
  source: [
    { id: 'text', name: 'Text' },
    { id: 'group', name: 'Group' },
  ],
  event: {
    change: [
      { action: 'state', target, state: { hidden: false }, when: ['group'] },
    ],
  },
})

/** A list `showsOn` reveals, holding `fields`. */
const kept = (name: string, fields: unknown[], keepValue = true) => ({
  label: 'Inside',
  name,
  type: 'list',
  hidden: true,
  advanced: { action: `Add ${name}`, keepValue, length: { min: 0 } },
  fields,
})

const LABEL = { label: 'Label', name: 'label', type: 'input/text' }

/** Fills a new row of `list` at `nth`, after adding it. */
async function addRow(page: Page, list: string, nth: number, text: string) {
  await page.getByRole('button', { name: `Add ${list}` }).click()
  const input = page.locator(`input[name*="${list}."][name$=".label"]`).nth(nth)
  await input.fill(text)
  await expect(input).toHaveValue(text)
}

test.describe(
  'A kept list shown again sends what it held',
  { tag: ['@e2e'] },
  () => {
    // Each one is run twice: once hidden and shown again before the submit, once
    // not. The two have to send the same.
    const run = async (
      page: Page,
      definition: unknown,
      fill: (page: Page) => Promise<void>,
      hideAndShow: (page: Page) => Promise<void>
    ) => {
      await inject(page, JSON.stringify(definition))
      await page.goto('/reactive')
      await fill(page)
      await hideAndShow(page)
      return submitted(page)
    }

    const none = async () => {}
    const textThenGroup =
      (nth = 0) =>
      async (page: Page) => {
        await chip(page, 'Text').nth(nth).click()
        await chip(page, 'Group').nth(nth).click()
      }

    test('in a row of a list', async ({ page }) => {
      const definition = {
        sections: [
          {
            fields: [
              {
                name: 'field',
                type: 'list',
                advanced: { length: { min: 1 } },
                fields: [showsOn('field/inner'), kept('inner', [LABEL])],
              },
            ],
          },
        ],
      }
      const fill = async (page: Page) => {
        await chip(page, 'Group').click()
        await addRow(page, 'inner', 0, 'Name')
        await addRow(page, 'inner', 1, 'Phone')
      }

      const sent = await run(page, definition, fill, textThenGroup())

      expect(sent).toEqual(await run(page, definition, fill, none))
      expect(sent).toEqual({
        field: [
          { type: ['group'], inner: [{ label: 'Name' }, { label: 'Phone' }] },
        ],
      })
    })

    test('with an edit made after it was shown again', async ({ page }) => {
      await inject(page, definition(true))
      await page.goto('/reactive')
      await groupWithRows(page, '/reactive')
      await chip(page, 'Text').click()
      await chip(page, 'Group').click()

      await labels(page).nth(0).fill('Email')

      expect(await submitted(page)).toEqual({
        field: [
          { type: ['group'], inner: [{ label: 'Email' }, { label: 'Phone' }] },
        ],
      })
    })

    test('three levels down', async ({ page }) => {
      const definition = {
        sections: [
          {
            fields: [
              {
                name: 'field',
                type: 'list',
                advanced: { length: { min: 1 } },
                fields: [
                  showsOn('field/inner'),
                  kept('inner', [showsOn('inner/deep'), kept('deep', [LABEL])]),
                ],
              },
            ],
          },
        ],
      }
      const fill = async (page: Page) => {
        await chip(page, 'Group').nth(0).click()
        await page.getByRole('button', { name: 'Add inner' }).click()
        await chip(page, 'Group').nth(1).click()
        await addRow(page, 'deep', 0, 'City')
        await addRow(page, 'deep', 1, 'Street')
      }

      const sent = await run(page, definition, fill, textThenGroup(0))

      expect(sent).toEqual(await run(page, definition, fill, none))
      await expect(page.locator('input[name*=".deep."]')).toHaveCount(2)
    })

    test('at the top level', async ({ page }) => {
      const definition = {
        sections: [{ fields: [showsOn('items'), kept('items', [LABEL])] }],
      }
      const fill = async (page: Page) => {
        await chip(page, 'Group').click()
        await addRow(page, 'items', 0, 'One')
        await addRow(page, 'items', 1, 'Two')
      }

      const sent = await run(page, definition, fill, async (page) => {
        await textThenGroup()(page)
        await expect(page.locator('input[name^="items."]')).toHaveCount(2)
      })

      expect(sent).toEqual(await run(page, definition, fill, none))
    })

    // `keepValue` on the outer list is inherited by the list inside its rows,
    // which declares nothing of its own.
    test('inside a list that keeps its value', async ({ page }) => {
      const definition = {
        sections: [
          {
            fields: [
              showsOn('orders'),
              kept('orders', [
                showsOn('orders/inner'),
                kept('inner', [LABEL], false),
              ]),
            ],
          },
        ],
      }
      const fill = async (page: Page) => {
        await chip(page, 'Group').nth(0).click()
        await page.getByRole('button', { name: 'Add orders' }).click()
        await chip(page, 'Group').nth(1).click()
        await addRow(page, 'inner', 0, 'Name')
      }

      const sent = await run(page, definition, fill, async (page) => {
        await textThenGroup(0)(page)
        await expect(page.locator('input[name*=".inner."]')).toHaveCount(1)
      })

      expect(sent).toEqual(await run(page, definition, fill, none))
    })

    // The host puts back a record of its own while the list is hidden: what it
    // shows once shown again is what it shows if it had stayed on screen.
    test('as it would have on screen, after the host puts back its own rows', async ({
      page,
    }) => {
      const put = async (meanwhile: (page: Page) => Promise<void>) => {
        await inject(
          page,
          JSON.stringify({
            ...JSON.parse(definition(true)),
            value: { field: [{ type: ['group'], inner: [{ label: 'A' }] }] },
          })
        )
        await page.goto('/reactive')
        await expect(labels(page).nth(0)).toHaveValue('A')
        await labels(page).nth(0).fill('B')
        await meanwhile(page)
        await page.getByRole('button', { name: 'Reset values' }).click()
        await expect(chip(page, 'Group')).toBeVisible()
        return submitted(page)
      }

      const hide = (page: Page) => chip(page, 'Text').click()

      expect(await put(hide)).toEqual(await put(async () => {}))
    })

    // A row removed takes the list inside it with it: the row added next starts
    // with nothing, on screen and in what the form sends.
    test('nothing of a removed row, in the row added after it', async ({
      page,
    }) => {
      await inject(page, definition(true))
      await page.goto('/reactive')
      await page.getByRole('button', { name: 'Add item' }).click()
      await chip(page, 'Group').nth(1).click()
      await page.getByRole('button', { name: 'Add a field' }).click()
      await page.locator('input[name^="field.1.inner."]').fill('Ghost')

      await page
        .getByRole('button', { name: /item 2$/ })
        .first()
        .click()
      await page.getByRole('button', { name: 'Add item' }).click()
      await chip(page, 'Group').nth(1).click()

      await expect(page.locator('input[name*=".inner."]')).toHaveCount(0)
      expect(JSON.stringify(await submitted(page))).not.toContain('Ghost')
    })
  }
)
