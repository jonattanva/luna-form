import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; type?: string; value: unknown }

// Controlled <Form> with a collapsed, multi-field list hydrated from `value` with
// three items. The `required` leaf is a built-in `select/active` carrying a
// `defaultValue` ("false"). After removing a NON-last item without editing
// anything, the surviving items keep stable ids [0, 2]; the trailing survivor
// "Mobile Phone" shifts to array position 1 but stays DOM-named `field.2.*`.
//
// The parent compacts the emitted array, so the re-passed `value.field` only has
// indices [0, 1]. When the shifted survivor is expanded, its `required` resolves
// its value by the stable-id path `field.2.required` against that compacted array
// -> undefined -> falls back to `defaultValue` ("false"), clobbering the hydrated
// "true". Leaf fields WITHOUT a defaultValue (label/example) have nothing to fall
// back to, so they keep their seeded value -- which is why only `required` is lost.
const COLLAPSED_REQUIRED_LIST = `{
  "value": {
    "field": [
      { "label": "First Name",   "required": "true", "example": "Ada" },
      { "label": "Contact Email", "required": "true", "example": "a@b.com" },
      { "label": "Mobile Phone",  "required": "true", "example": "+34 600" }
    ]
  },
  "sections": [
    {
      "title": "Field",
      "fields": [
        {
          "label": "Field",
          "name": "field",
          "type": "list",
          "advanced": {
            "action": "Add field",
            "collapsed": true,
            "length": { "min": 0 }
          },
          "fields": [
            { "label": "Label",     "name": "label",    "type": "input/text" },
            { "label": "Required?", "name": "required", "type": "select/active", "defaultValue": "false" },
            { "label": "Example",   "name": "example",  "type": "input/text" }
          ]
        }
      ]
    }
  ]
}`

// Same scenario without `collapsed`: the cards render open, so the survivor's
// `useValue` effect runs immediately on removal (instead of being deferred until
// expand). This guards the "effect runs immediately" timing of the same root
// cause -- the `required` select must keep "true" without any expand step.
const EXPANDED_REQUIRED_LIST = `{
  "value": {
    "field": [
      { "label": "First Name",   "required": "true", "example": "Ada" },
      { "label": "Contact Email", "required": "true", "example": "a@b.com" },
      { "label": "Mobile Phone",  "required": "true", "example": "+34 600" }
    ]
  },
  "sections": [
    {
      "title": "Field",
      "fields": [
        {
          "label": "Field",
          "name": "field",
          "type": "list",
          "advanced": {
            "action": "Add field",
            "length": { "min": 0 }
          },
          "fields": [
            { "label": "Label",     "name": "label",    "type": "input/text" },
            { "label": "Required?", "name": "required", "type": "select/active", "defaultValue": "false" },
            { "label": "Example",   "name": "example",  "type": "input/text" }
          ]
        }
      ]
    }
  ]
}`

function captureValueChanges(page: Page): ValueChange[] {
  const events: ValueChange[] = []
  page.on('console', (msg: ConsoleMessage) => {
    if (!msg.text().startsWith('Form values changed:')) {
      return
    }
    const arg = msg.args()[1]
    if (!arg) {
      return
    }
    arg
      .jsonValue()
      .then((value) => {
        events.push(value as ValueChange)
      })
      .catch(() => {})
  })
  return events
}

function lastEventFor(
  events: ValueChange[],
  predicate: (e: ValueChange) => boolean
): ValueChange | undefined {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i] && predicate(events[i])) {
      return events[i]
    }
  }
  return undefined
}

test.describe(
  'List removal clobbers required on the shifted item',
  { tag: ['@e2e'] },
  () => {
    test('removing a non-last item keeps the shifted survivor required', async ({
      page,
    }) => {
      await inject(page, COLLAPSED_REQUIRED_LIST)
      const events = captureValueChanges(page)
      await page.goto('/reactive')

      const cards = page.locator('[data-slot="list-item-card"]')
      await expect(cards).toHaveCount(3)

      // Remove the middle item (Contact Email) without editing anything.
      await page.getByRole('button', { name: 'Remove Field item 2' }).click()
      await expect(cards).toHaveCount(2)

      // The list-level positional emit is correct: both survivors keep
      // required "true". This is the part the 0.0.61 / 0.0.62 fixes got right.
      await expect
        .poll(() => {
          const last = lastEventFor(events, (e) => e.name === 'field')
          return Array.isArray(last?.value)
            ? (last.value as Array<Record<string, unknown>>).map(
                (item) => item.required
              )
            : undefined
        })
        .toEqual(['true', 'true'])

      // Expand the trailing survivor (now position 2 in the DOM, stable id 2).
      await page.getByRole('button', { name: 'Expand Field 2' }).click()

      // Sanity: leaf fields WITHOUT a defaultValue keep their hydrated value.
      await expect(page.locator('input[name="field.2.label"]')).toHaveValue(
        'Mobile Phone'
      )

      // BUG: `required` has defaultValue "false". The survivor resolves its value
      // from the compacted parent array by its stable-id path `field.2.required`
      // -> undefined -> falls back to "false", clobbering the hydrated "true".
      // The "Required?" dropdown shows "No" instead of "Yes".
      await expect(page.locator('[id="field.2.required"]')).toContainText('Yes')
    })

    test('keeps the shifted survivor required on an open (non-collapsed) list', async ({
      page,
    }) => {
      await inject(page, EXPANDED_REQUIRED_LIST)
      await page.goto('/reactive')

      const cards = page.locator('[data-slot="list-item-card"]')
      await expect(cards).toHaveCount(3)

      // Remove the middle item; cards are open so no expand step is needed and
      // the survivor's value sync runs immediately.
      await page.getByRole('button', { name: 'Remove Field item 2' }).click()
      await expect(cards).toHaveCount(2)

      // Sanity: the trailing survivor is "Mobile Phone" (stable id 2).
      await expect(page.locator('input[name="field.2.label"]')).toHaveValue(
        'Mobile Phone'
      )

      // Its "Required?" dropdown must still read "Yes" (not clobbered to "No").
      await expect(page.locator('[id="field.2.required"]')).toContainText('Yes')
    })
  }
)
