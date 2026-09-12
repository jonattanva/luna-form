import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Hidden target clearing', { tag: ['@e2e'] }, () => {
  // The clear is only observable from outside, so these run against
  // `/reactive`: the host there holds the values and feeds them back through
  // `value`, which is the arrangement the contract is written for. On a form
  // that keeps nothing, re-showing a field would come up empty either way and
  // the assertions below would pass without meaning anything.
  //
  // Two things vary, and both halves of the matrix matter.
  //
  // HOW the form says "hide":
  //   explicit  a rule whose state is `hidden: true` fires on "hide"
  //   revert    a rule whose state is `hidden: false` fires on "show", and
  //             hiding is what happens when it stops matching and the field
  //             falls back to its static `hidden: true`
  //
  // WHETHER the field survives it: `advanced.keepValue`.
  //
  // The two phrasings are the same act -- "once a `state` action hides a
  // field, the value is gone" (docs/events/change.md) -- so every case here
  // has a twin that must agree with it. A case passing alone means nothing.
  const definition = (mode: 'explicit' | 'revert', keep: boolean) => {
    const rule =
      mode === 'explicit'
        ? `{ "action": "state", "target": ["note", "items"], "state": { "hidden": true }, "when": "hide" }`
        : `{ "action": "state", "target": ["note", "items"], "state": { "hidden": false }, "when": "show" }`

    // Written with LEADING commas so they can sit last in either object.
    const hidden = mode === 'revert' ? `,\n            "hidden": true` : ''

    // `keepValue` lives inside `advanced`, so it cannot be one fragment shared
    // by both fields the way `hidden` is: the note has no `advanced` to join
    // and the list already has one of its own.
    const noteKeep = keep
      ? `,\n            "advanced": { "keepValue": true }`
      : ''
    const listAdvanced = keep
      ? `"advanced": { "length": { "min": 1 }, "keepValue": true }`
      : `"advanced": { "length": { "min": 1 } }`

    return `{
      "sections": [{
        "fields": [
          {
            "label": "Visibility",
            "name": "visibility",
            "type": "select",
            "source": [
              { "label": "Show", "value": "show" },
              { "label": "Hide", "value": "hide" }
            ],
            "event": { "change": [${rule}] }
          },
          {
            "label": "Note",
            "name": "note",
            "type": "input/text"${hidden}${noteKeep}
          },
          {
            "label": "Items",
            "name": "items",
            "type": "list",
            ${listAdvanced},
            "fields": [{ "label": "Value", "name": "value", "type": "input/text" }]${hidden}
          }
        ]
      }]
    }`
  }

  const getSelect = (page: Page) => {
    return page
      .locator('[data-slot="field"]')
      .filter({ hasText: 'Visibility' })
      .getByRole('combobox')
      .first()
  }

  const choose = async (page: Page, option: 'Show' | 'Hide') => {
    await getSelect(page).click()
    await page.getByRole('option', { name: option, exact: true }).click()
  }

  const note = (page: Page) => page.locator('input[name="note"]')
  const item = (page: Page) => page.locator('input[name="items.0.value"]')

  const NOTE = 'written by hand'
  const ITEM = 'a row value'

  /**
   * Fill both fields, hide them, show them again.
   *
   * Returns with the fields back on screen, so what the caller asserts is what
   * showing a hidden field again gives you.
   */
  const fillHideShow = async (
    page: Page,
    mode: 'explicit' | 'revert',
    keep = false,
    path = '/reactive'
  ) => {
    await inject(page, definition(mode, keep))
    await page.goto(path)

    if (mode === 'revert') {
      await choose(page, 'Show')
    }

    await expect(note(page)).toBeVisible()
    await note(page).fill(NOTE)
    await item(page).fill(ITEM)

    await choose(page, 'Hide')
    await expect(note(page)).toHaveCount(0)

    await choose(page, 'Show')
    await expect(note(page)).toBeVisible()
  }

  test('clears an input hidden by an explicit rule', async ({ page }) => {
    await fillHideShow(page, 'explicit')
    await expect(note(page)).toHaveValue('')
  })

  test('clears a list hidden by an explicit rule', async ({ page }) => {
    await fillHideShow(page, 'explicit')
    await expect(item(page)).toHaveValue('')
  })

  test('clears an input reverted to its static hidden', async ({ page }) => {
    await fillHideShow(page, 'revert')
    await expect(note(page)).toHaveValue('')
  })

  /**
   * The case the other three were written to catch.
   *
   * `use-input-core` decides what to clear in two branches. An explicit
   * `hidden: true` clears every target it was given; a target reverting to its
   * static hidden is filtered by whether it is hidden at all. That filter used
   * to ask the schema registry alone, which `onMount` fills from the INPUT
   * path only -- a list never registers there, so the filter dropped it and its
   * rows survived a hide that emptied every input beside them.
   *
   * The fix is that the filter now asks both registries, so keep this next to
   * its explicit twin above: the pair is the whole point.
   */
  test('clears a list reverted to its static hidden', async ({ page }) => {
    await fillHideShow(page, 'revert')
    await expect(item(page)).toHaveValue('')
  })

  // The same four, for a field that declares it is put away rather than
  // dropped. `advanced.keepValue` is read off the FIELD, so it has to hold
  // under both phrasings -- which is exactly what the four above stopped
  // taking for granted.

  test('keeps an input hidden by an explicit rule that declares keepValue', async ({
    page,
  }) => {
    await fillHideShow(page, 'explicit', true)
    await expect(note(page)).toHaveValue(NOTE)
  })

  test('keeps a list hidden by an explicit rule that declares keepValue', async ({
    page,
  }) => {
    await fillHideShow(page, 'explicit', true)
    await expect(item(page)).toHaveValue(ITEM)
  })

  test('keeps an input reverted to its static hidden that declares keepValue', async ({
    page,
  }) => {
    await fillHideShow(page, 'revert', true)
    await expect(note(page)).toHaveValue(NOTE)
  })

  test('keeps a list reverted to its static hidden that declares keepValue', async ({
    page,
  }) => {
    await fillHideShow(page, 'revert', true)
    await expect(item(page)).toHaveValue(ITEM)
  })

  // Everything above runs on a CONTROLLED form, and there the state action is
  // the only clear that shows: hiding a field unmounts it and empties the
  // form's own copy too, but that half is never reported, so the host still
  // has the value and hands it back. Which means a `keepValue` that only
  // reached the reported clear would pass every case above and still lose the
  // value on a form that holds its own -- the same half-working flag this file
  // was opened to catch, one layer down.
  //
  // `/` is that form: it renders `<Form>` with an `onValueChange` and no
  // `value`, so the copy the field unmounts with is the only one there is.

  test('drops what an input held when the form holds its own values', async ({
    page,
  }) => {
    await fillHideShow(page, 'explicit', false, '')
    await expect(note(page)).toHaveValue('')
  })

  test('drops what a list held when the form holds its own values', async ({
    page,
  }) => {
    await fillHideShow(page, 'explicit', false, '')
    await expect(item(page)).toHaveValue('')
  })

  test('keeps what an input held when the form holds its own values', async ({
    page,
  }) => {
    await fillHideShow(page, 'explicit', true, '')
    await expect(note(page)).toHaveValue(NOTE)
  })

  test('keeps what a list held when the form holds its own values', async ({
    page,
  }) => {
    await fillHideShow(page, 'explicit', true, '')
    await expect(item(page)).toHaveValue(ITEM)
  })
})
