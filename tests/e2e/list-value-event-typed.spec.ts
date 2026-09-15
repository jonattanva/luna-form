import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A `value` event that assigns rows to a list is documented to discard the
// values of the rows that went away. On a controlled host that mirrors
// `onValueChange` into one record, it does not: typing reported each leaf under
// its positional name, `items.1.value`, and the assignment reports the list's
// array and nothing else. The flat names past the new length stay behind, and
// `resolveEntry` tries a flat name before the path into the array, so a row
// that later lands on one of those positions reads back the value of the row
// the assignment discarded.
//
// Same mechanism as `list-remove-nonlast-typed`, through the other way a list
// rewrites what its positions hold.

const X = { value: 'X' }
const Y = { value: 'Y' }

const FORM = JSON.stringify({
  sections: [
    {
      fields: [
        {
          label: 'Preset',
          name: 'preset',
          type: 'select',
          advanced: { transient: true },
          source: [
            { label: 'One', value: 'one', preset_rows: [X] },
            { label: 'Two', value: 'two', preset_rows: [X, Y] },
          ],
          event: {
            change: [{ action: 'value', value: { items: '{preset_rows}' } }],
          },
        },
        {
          label: 'Items',
          name: 'items',
          type: 'list',
          fields: [{ label: 'Value', name: 'value', type: 'input/text' }],
        },
      ],
    },
  ],
})

async function pick(page: Page, preset: string) {
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: preset }).click()
}

/** Three rows typed in, A, B and C, then the preset that leaves one: X. */
async function typeThreeThenAssignOne(page: Page) {
  await inject(page, FORM)
  await page.goto('/reactive')
  await expect(page.locator('input[name="items.0.value"]')).toBeVisible()
  const add = page.getByRole('button', { name: 'Add item' })
  await add.click()
  await add.click()
  await page.locator('input[name="items.0.value"]').fill('A')
  await page.locator('input[name="items.1.value"]').fill('B')
  await page.locator('input[name="items.2.value"]').fill('C')

  await pick(page, 'One')
  await expect(page.locator('input[name^="items."]')).toHaveCount(1)
  await expect(page.locator('input[name="items.0.value"]')).toHaveValue('X')
}

// What reaches the action, once everything the rows set off has run. A check
// on screen can pass in the moment before the stale entry lands; what reaches
// the action cannot.
async function submit(page: Page) {
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('Form submitted successfully')).toBeVisible()
  return page.locator('pre code')
}

test.describe(
  'Assigning fewer rows than were typed, on a controlled host',
  { tag: ['@e2e'] },
  () => {
    test('should leave a row added afterwards empty', async ({ page }) => {
      await typeThreeThenAssignOne(page)

      await page.getByRole('button', { name: 'Add item' }).click()
      const rows = page.locator('input[name^="items."]')
      await expect(rows).toHaveCount(2)
      await expect(rows.nth(1)).toHaveValue('')

      const payload = await submit(page)
      await expect(payload).toContainText('"value": "X"')
      await expect(payload).not.toContainText('"value": "B"')
    })

    test('should show the rows a later assignment gives', async ({ page }) => {
      await typeThreeThenAssignOne(page)

      await pick(page, 'Two')
      const rows = page.locator('input[name^="items."]')
      await expect(rows).toHaveCount(2)
      await expect(rows.nth(1)).toHaveValue('Y')

      const payload = await submit(page)
      await expect(payload).toContainText('"value": "Y"')
      await expect(payload).not.toContainText('"value": "B"')
    })
  }
)
