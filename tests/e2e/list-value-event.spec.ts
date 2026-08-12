import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'
import { captureValueChanges, lastEventFor } from './support/value-changes'

// A `value` event whose target is a list, which used to write a key nobody
// reads: a list keeps its values at `rows.<stableId>.<leaf>` and its row count
// inside the component, so `valueAtom['rows']` was a dead end.
//
// The rows travel on the option itself. `getEntity` hands the whole option to
// the change events, so `{preset_rows}` resolves to the array it carries --
// which is also the interpolation that used to come back as the literal
// `"{preset_rows}"`.
//
// The picker is `transient` so the only thing the consumer is told about is
// the list. That is the shape this whole exercise exists for: a control that
// writes somewhere else and keeps nothing.
const ROW_ALPHA = { key: 'alpha', amount: '1' }
const ROW_BETA = { key: 'beta', amount: '2' }
const ROW_GAMMA = { key: 'gamma', amount: '3' }

// `tag_values` rides along on the same event as the rows so that one preset
// writes to a list and to a chips field at once. That pairing is the point:
// an empty array is rows for one of them and a cleared selection for the
// other, and only the target tells them apart.
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
            { label: 'None', value: 'none', preset_rows: [], tag_values: [] },
            {
              label: 'One',
              value: 'one',
              preset_rows: [ROW_ALPHA],
              tag_values: ['red'],
            },
            {
              label: 'Two',
              value: 'two',
              preset_rows: [ROW_ALPHA, ROW_BETA],
              tag_values: ['red', 'blue'],
            },
            {
              label: 'Three',
              value: 'three',
              preset_rows: [ROW_ALPHA, ROW_BETA, ROW_GAMMA],
              tag_values: ['red', 'blue'],
            },
          ],
          event: {
            change: [
              {
                action: 'value',
                value: { rows: '{preset_rows}', tags: '{tag_values}' },
              },
            ],
          },
        },
        {
          label: 'Rows',
          name: 'rows',
          type: 'list',
          advanced: { action: 'Add row', length: { min: 0, max: 2 } },
          fields: [
            { label: 'Key', name: 'key', type: 'input/text' },
            { label: 'Amount', name: 'amount', type: 'input/text' },
          ],
        },
        {
          label: 'Tags',
          name: 'tags',
          type: 'chips',
          source: [
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue' },
          ],
        },
      ],
    },
  ],
})

// A list that insists on two rows, for the half of the clamp the form above
// cannot reach: `min: 0` never pads.
const FORM_MIN_TWO = JSON.stringify({
  sections: [
    {
      fields: [
        {
          label: 'Preset',
          name: 'preset',
          type: 'select',
          advanced: { transient: true },
          source: [{ label: 'One', value: 'one', preset_rows: [ROW_ALPHA] }],
          event: {
            change: [{ action: 'value', value: { rows: '{preset_rows}' } }],
          },
        },
        {
          label: 'Rows',
          name: 'rows',
          type: 'list',
          advanced: { action: 'Add row', length: { min: 2, max: 4 } },
          fields: [
            { label: 'Key', name: 'key', type: 'input/text' },
            { label: 'Amount', name: 'amount', type: 'input/text' },
          ],
        },
      ],
    },
  ],
})

// The same list, plus a way to take it off the screen. A hidden field renders
// as `null`, so hiding really unmounts it and its cleanup runs.
const FORM_HIDEABLE = JSON.stringify({
  sections: [
    {
      fields: [
        {
          label: 'Visibility',
          name: 'visibility',
          type: 'select',
          advanced: { transient: true },
          source: [
            { label: 'Show', value: 'show' },
            { label: 'Hide', value: 'hide' },
          ],
          event: {
            change: [
              {
                action: 'state',
                target: ['rows'],
                state: { hidden: true },
                when: 'hide',
              },
            ],
          },
        },
        {
          label: 'Preset',
          name: 'preset',
          type: 'select',
          advanced: { transient: true },
          source: [
            { label: 'One', value: 'one', preset_rows: [ROW_ALPHA] },
            { label: 'Two', value: 'two', preset_rows: [ROW_ALPHA, ROW_BETA] },
          ],
          event: {
            change: [{ action: 'value', value: { rows: '{preset_rows}' } }],
          },
        },
        {
          label: 'Rows',
          name: 'rows',
          type: 'list',
          advanced: { action: 'Add row', length: { min: 0, max: 2 } },
          fields: [
            { label: 'Key', name: 'key', type: 'input/text' },
            { label: 'Amount', name: 'amount', type: 'input/text' },
          ],
        },
      ],
    },
  ],
})

// A list inside a list, targeted from a field in the same row.
//
// A nested list is named by its dotted path once rendered -- `group.0.items`,
// not `items` -- so nothing can address it by the name in the definition.
// `group/items` is the relative syntax that already exists for reaching a
// sibling in the same row, and `resolveTarget` turns it into that path.
const FORM_NESTED = JSON.stringify({
  sections: [
    {
      fields: [
        {
          label: 'Group',
          name: 'group',
          type: 'list',
          advanced: { action: 'Add group', length: { min: 1, max: 1 } },
          fields: [
            {
              label: 'Preset',
              name: 'preset',
              type: 'select',
              advanced: { transient: true },
              source: [
                {
                  label: 'Two',
                  value: 'two',
                  preset_rows: [ROW_ALPHA, ROW_BETA],
                },
                { label: 'One', value: 'one', preset_rows: [ROW_ALPHA] },
              ],
              event: {
                change: [
                  {
                    action: 'value',
                    value: { 'group/items': '{preset_rows}' },
                  },
                ],
              },
            },
            {
              label: 'Items',
              name: 'items',
              type: 'list',
              advanced: { action: 'Add item', length: { min: 0 } },
              fields: [
                { label: 'Key', name: 'key', type: 'input/text' },
                { label: 'Amount', name: 'amount', type: 'input/text' },
              ],
            },
          ],
        },
      ],
    },
  ],
})

// On `/` rather than `/reactive` on purpose. That harness merges every change
// into its value by name, so an edit to a row leaves a flat `rows.1.amount`
// key sitting beside the `rows` array it also keeps, and hands both back. What
// renders is then the harness's bookkeeping and not the library's, which is
// the wrong thing to be asserting about here. `/` logs the changes without
// feeding them back, so what is on screen came from the list alone.
//
// Located by the leaf's name rather than the whole path: a stable id is not
// the row's position and does not have to stay put across an assignment, so
// `rows.1.key` is not a promise the library makes.
function keys(page: Page) {
  return page.locator('input[name$=".key"]')
}

function amounts(page: Page) {
  return page.locator('input[name$=".amount"]')
}

async function choose(page: Page, option: string, label = 'Preset') {
  await page
    .locator('[data-slot="field"]')
    .filter({ hasText: label })
    .getByRole('combobox')
    .first()
    .click()
  await page.getByRole('option', { name: option, exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('listbox')).toBeHidden()
}

test.describe('List filled by a value event', { tag: ['@e2e'] }, () => {
  test('should fill the list and tell the consumer about it', async ({
    page,
  }) => {
    await inject(page, FORM)
    const events = captureValueChanges(page)
    await page.goto('')

    await choose(page, 'Two')

    await expect(keys(page)).toHaveCount(2)
    await expect(keys(page).nth(0)).toHaveValue('alpha')
    await expect(keys(page).nth(1)).toHaveValue('beta')
    await expect(amounts(page).nth(0)).toHaveValue('1')
    await expect(amounts(page).nth(1)).toHaveValue('2')

    // One report for the list as a whole, carrying every row -- not one per
    // leaf, and not the orphan key the old path wrote.
    await expect
      .poll(() => lastEventFor(events, 'rows'))
      .toMatchObject({ name: 'rows', value: [ROW_ALPHA, ROW_BETA] })
  })

  test('should shrink when the assignment is shorter', async ({ page }) => {
    await inject(page, FORM)
    await page.goto('')

    await choose(page, 'Two')
    await expect(keys(page)).toHaveCount(2)

    await choose(page, 'One')
    await expect(keys(page)).toHaveCount(1)
    await expect(keys(page).nth(0)).toHaveValue('alpha')
  })

  test('should not bring back the values of rows that were dropped', async ({
    page,
  }) => {
    await inject(page, FORM)
    const events = captureValueChanges(page)
    await page.goto('')

    await choose(page, 'Two')
    await amounts(page).nth(1).fill('99')
    await expect(amounts(page).nth(1)).toHaveValue('99')

    await choose(page, 'One')
    await expect(keys(page)).toHaveCount(1)

    // The stable id the dropped row had can be handed out again. If its values
    // were left behind in the flat store, `99` would surface inside a row that
    // never had it.
    await choose(page, 'Two')
    await expect(amounts(page).nth(1)).toHaveValue('2')

    // And the same statement made where it cannot be confused with what the
    // inputs happen to be showing.
    await expect
      .poll(() => lastEventFor(events, 'rows'))
      .toMatchObject({ name: 'rows', value: [ROW_ALPHA, ROW_BETA] })
  })

  test('should empty the list when the assignment has no rows', async ({
    page,
  }) => {
    await inject(page, FORM)
    await page.goto('')

    await choose(page, 'Two')
    await expect(keys(page)).toHaveCount(2)

    await choose(page, 'None')
    await expect(keys(page)).toHaveCount(0)
  })

  test('should not grow past the declared maximum', async ({ page }) => {
    await inject(page, FORM)
    await page.goto('')

    await choose(page, 'Three')

    // The same ceiling `addItem` respects, applied to an assignment.
    await expect(keys(page)).toHaveCount(2)
  })

  test('should do nothing when the assignment matches what is there', async ({
    page,
  }) => {
    await inject(page, FORM)
    const events = captureValueChanges(page)
    await page.goto('')

    const reports = () => events.filter((event) => event.name === 'rows').length

    await choose(page, 'Two')
    await expect(keys(page)).toHaveCount(2)
    await expect.poll(reports).toBe(1)

    // The same preset again. Nothing about the list changes, so nothing
    // should reach the consumer -- downstream that is a whole document saved
    // again for no reason.
    await choose(page, 'Two')

    // Proven by what comes after rather than by waiting: a real change lands,
    // and it is the second report, not the third.
    await choose(page, 'One')
    await expect(keys(page)).toHaveCount(1)
    await expect.poll(reports).toBe(2)
  })

  test('should still reach a chips field the same event clears', async ({
    page,
  }) => {
    await inject(page, FORM)
    const events = captureValueChanges(page)
    await page.goto('')

    const red = page.getByRole('button', { name: 'Red' })
    const blue = page.getByRole('button', { name: 'Blue' })

    await choose(page, 'Two')
    await expect(red).toHaveClass(/bg-violet-600/)
    await expect(blue).toHaveClass(/bg-violet-600/)

    // The reason a list is recognised by being registered rather than by the
    // shape of what is sent to it. `[]` is a list with no rows and a chips
    // field with nothing selected, and only the target says which -- read the
    // shape instead and this write disappears into the list channel, leaving
    // a chips field that can never be cleared.
    await choose(page, 'None')

    await expect(red).not.toHaveClass(/bg-violet-600/)
    await expect(blue).not.toHaveClass(/bg-violet-600/)
    await expect.poll(() => lastEventFor(events, 'tags')?.value).toEqual([])
  })

  test('should pad up to the declared minimum', async ({ page }) => {
    await inject(page, FORM_MIN_TWO)
    await page.goto('')

    await choose(page, 'One')

    // One row assigned to a list that insists on two: the assignment lands and
    // the remainder stays, empty. Same thing a short `value` prop does at
    // mount, which is where the rule comes from.
    await expect(keys(page)).toHaveCount(2)
    await expect(keys(page).nth(0)).toHaveValue('alpha')
    await expect(keys(page).nth(1)).toHaveValue('')
  })

  test('should still add and remove rows after an assignment', async ({
    page,
  }) => {
    await inject(page, FORM)
    await page.goto('')

    await choose(page, 'One')
    await expect(keys(page)).toHaveCount(1)

    await page.getByRole('button', { name: 'Add row' }).click()
    await expect(keys(page)).toHaveCount(2)

    // The added row has to be its own. Assigning hands out stable ids of its
    // own, so a collision with one of those would open the new row already
    // carrying somebody else's values.
    await expect(keys(page).nth(1)).toHaveValue('')

    await page.getByRole('button', { name: 'Remove Rows item 2' }).click()

    await expect(keys(page)).toHaveCount(1)
    await expect(keys(page).nth(0)).toHaveValue('alpha')
  })

  test('should stop taking rows once it has left the screen', async ({
    page,
  }) => {
    await inject(page, FORM_HIDEABLE)
    await page.goto('')

    await choose(page, 'Two')
    await expect(keys(page)).toHaveCount(2)

    await choose(page, 'Hide', 'Visibility')
    await expect(keys(page)).toHaveCount(0)

    // Sent while there is no list to receive it.
    await choose(page, 'One')

    await choose(page, 'Show', 'Visibility')

    // Back, and empty. A registration left behind by the unmount would have
    // parked that delivery instead of letting it fall through, and mounting
    // again would have applied it -- a list filling itself with something
    // chosen while it was nowhere to be seen.
    await expect(keys(page)).toHaveCount(0)
  })

  test('should fill a nested list from a field in the same row', async ({
    page,
  }) => {
    await inject(page, FORM_NESTED)
    await page.goto('')

    await choose(page, 'Two')

    await expect(keys(page)).toHaveCount(2)
    await expect(keys(page).nth(0)).toHaveValue('alpha')
    await expect(keys(page).nth(1)).toHaveValue('beta')
    await expect(amounts(page).nth(1)).toHaveValue('2')

    // Reached by its rendered path, not the name in the definition. If the
    // registration used the declared name instead, this write would land on a
    // list nobody has -- and every row of the outer list would be answering to
    // it at once.
    await expect(keys(page).nth(0)).toHaveAttribute(
      'name',
      /^group\.\d+\.items\.\d+\.key$/
    )
  })

  test('should assign a nested list again without leaving the old rows', async ({
    page,
  }) => {
    await inject(page, FORM_NESTED)
    await page.goto('')

    await choose(page, 'Two')
    await expect(keys(page)).toHaveCount(2)

    await choose(page, 'One')

    await expect(keys(page)).toHaveCount(1)
    await expect(keys(page).nth(0)).toHaveValue('alpha')
  })

  test('should keep a surviving row mounted', async ({ page }) => {
    await inject(page, FORM)
    await page.goto('')

    await choose(page, 'One')

    // Marked on the DOM node itself, because that is what "not remounted"
    // means: React reuses the element instead of building a new one. Focus
    // would have been the friendlier signal and cannot be used -- reaching the
    // picker takes the caret away first.
    await keys(page)
      .nth(0)
      .evaluate((element: HTMLInputElement) => {
        element.dataset.kept = 'yes'
      })

    await choose(page, 'Two')
    await expect(keys(page)).toHaveCount(2)

    // Rows are reused by position, so growing the list leaves the one that was
    // already there alone. Handing out fresh ids for all of them would remount
    // every row on every assignment, dropping the caret with them.
    await expect(keys(page).nth(0)).toHaveAttribute('data-kept', 'yes')
  })
})
