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
