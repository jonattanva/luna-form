import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A controlled host that mirrors `onValueChange` into one record -- the way
// `docs/forms/submit.md` tells a host to keep values -- ends up holding every
// list twice: the list's own array under `items`, and each leaf under its flat
// positional name, `items.0.value`. Removing a row that is not the last
// re-reports the array but none of the flat keys, so `items.0.value` goes on
// holding the removed row's value. `resolveEntry` prefers a flat key to the
// nested path, and each survivor, translated to its new position, reads the
// entry of the row that used to sit there.
//
// Rows typed in, not hydrated: a row filled from `value` never reports its
// leaves, which is why `list-remove-nonlast-hydrated` does not see this.

const ITEMS = JSON.stringify({
  sections: [
    {
      fields: [
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

/** Three rows typed in: A, B and C, at stable ids 0, 1 and 2. */
async function typeThreeRows(page: Page) {
  await inject(page, ITEMS)
  await page.goto('/reactive')
  await expect(page.locator('input[name="items.0.value"]')).toBeVisible()
  const add = page.getByRole('button', { name: 'Add item' })
  await add.click()
  await add.click()
  await page.locator('input[name="items.0.value"]').fill('A')
  await page.locator('input[name="items.1.value"]').fill('B')
  await page.locator('input[name="items.2.value"]').fill('C')
}

// What the survivors hold once everything the removal set off has run. A check
// on screen can pass in the moment before the stale entries land; what reaches
// the action cannot.
async function submit(page: Page) {
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('Form submitted successfully')).toBeVisible()
  return page.locator('pre code')
}

test.describe(
  'Removing a typed row that is not the last, on a controlled host',
  { tag: ['@e2e'] },
  () => {
    test('should keep B and C when the first row goes', async ({ page }) => {
      await typeThreeRows(page)

      await page.getByRole('button', { name: 'Remove Items item 1' }).click()

      await expect(page.locator('input[name="items.1.value"]')).toHaveValue('B')
      await expect(page.locator('input[name="items.2.value"]')).toHaveValue('C')

      const payload = await submit(page)
      await expect(payload).toContainText('"value": "B"')
      await expect(payload).toContainText('"value": "C"')
      await expect(payload).not.toContainText('"value": "A"')
    })

    test('should keep A and C when the middle row goes', async ({ page }) => {
      await typeThreeRows(page)

      await page.getByRole('button', { name: 'Remove Items item 2' }).click()

      await expect(page.locator('input[name="items.0.value"]')).toHaveValue('A')
      await expect(page.locator('input[name="items.2.value"]')).toHaveValue('C')

      const payload = await submit(page)
      await expect(payload).toContainText('"value": "A"')
      await expect(payload).toContainText('"value": "C"')
      await expect(payload).not.toContainText('"value": "B"')
    })
  }
)
