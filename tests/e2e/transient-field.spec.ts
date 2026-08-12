import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'
import { captureValueChanges, lastEventFor } from './support/value-changes'

// Two selects that do the same thing -- copy what was chosen into `target` --
// so the only thing that can explain a difference between them is the flag.
//
// A select stands in for the control this exists for, which is a button: a
// field whose whole job is to write somewhere else. It is the easiest thing to
// drive from a test, and the mechanism underneath is the one that matters.
const FORM = JSON.stringify({
  sections: [
    {
      fields: [
        {
          label: 'Transient',
          name: 'transient_pick',
          type: 'select',
          advanced: { transient: true },
          source: [
            { label: 'Alpha', value: 'alpha' },
            { label: 'Beta', value: 'beta' },
          ],
          event: {
            change: [{ action: 'value', value: { target: '{value}' } }],
          },
        },
        {
          label: 'Stored',
          name: 'stored_pick',
          type: 'select',
          source: [
            { label: 'Gamma', value: 'gamma' },
            { label: 'Delta', value: 'delta' },
          ],
          event: {
            change: [{ action: 'value', value: { target: '{value}' } }],
          },
        },
        {
          label: 'Target',
          name: 'target',
          type: 'input/text',
        },
      ],
    },
  ],
})

function comboboxFor(page: Page, label: string) {
  return page
    .locator('[data-slot="field"]')
    .filter({ hasText: label })
    .getByRole('combobox')
    .first()
}

// The editor renders `select` as a listbox, not a native element, so choosing
// is open-click-close rather than `selectOption`.
async function choose(page: Page, label: string, option: string) {
  await comboboxFor(page, label).click()
  await page.getByRole('option', { name: option }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('listbox')).toBeHidden()
}

test.describe('Transient field', { tag: ['@e2e'] }, () => {
  test('should deliver to the target and report nothing about itself', async ({
    page,
  }) => {
    await inject(page, FORM)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await choose(page, 'Transient', 'Alpha')

    await expect(page.locator('input[name="target"]')).toHaveValue('alpha')
    await expect
      .poll(() => lastEventFor(events, 'target'))
      .toMatchObject({
        name: 'target',
        value: 'alpha',
      })

    // The point of the flag. The event went out, the target has the value, and
    // the consumer was never told the emitter itself holds anything -- so
    // there is nothing for it to persist.
    expect(lastEventFor(events, 'transient_pick')).toBeUndefined()
  })

  test('should report an ordinary field that carries the same event', async ({
    page,
  }) => {
    await inject(page, FORM)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await choose(page, 'Stored', 'Gamma')

    await expect(page.locator('input[name="target"]')).toHaveValue('gamma')

    // Same form, same event, no flag: this one is reported. Without it the
    // test above would pass on a form where nothing works at all.
    await expect
      .poll(() => lastEventFor(events, 'stored_pick'))
      .toMatchObject({ name: 'stored_pick', value: 'gamma' })
  })

  test('should act again when the same value is chosen twice', async ({
    page,
  }) => {
    await inject(page, FORM)
    await page.goto('/reactive')

    const target = page.locator('input[name="target"]')

    await choose(page, 'Transient', 'Alpha')
    await expect(target).toHaveValue('alpha')

    // Move the target away, then choose the very same option again. Nothing
    // about the second press can be read as "no change" -- the field kept no
    // value from the first -- so the command runs again, which is what a
    // button being pressed twice has to mean.
    await target.fill('edited by hand')
    await expect(target).toHaveValue('edited by hand')

    await choose(page, 'Transient', 'Alpha')
    await expect(target).toHaveValue('alpha')
  })
})
