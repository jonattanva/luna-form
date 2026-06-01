import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; value: unknown }

// Controlled <Form> with a multi-field (collapsible) list hydrated from `value`
// with three items. The cards are forced collapsed (`advanced.collapsed: true`)
// so their leaf inputs live inside <Activity mode="hidden"> and never hydrate the
// flat value atom -- this is the precondition for the positional-fallback path in
// `computeListValue`. `preview.label` exposes each item's `label` in the collapsed
// card header so we can read it without expanding.
const HYDRATED_LIST = `{
  "value": {
    "field": [
      { "label": "First Name", "name": "first_name", "required": true,  "type": "text",  "example": "Jane" },
      { "label": "Email",      "name": "email",      "required": true,  "type": "email", "example": "jane@example.com" },
      { "label": "Phone",      "name": "phone",      "required": false, "type": "tel",   "example": "555-1234" }
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
            "length": { "min": 1 },
            "collapsed": true,
            "preview": { "label": "label" }
          },
          "fields": [
            { "label": "Label",    "name": "label",    "type": "input/text" },
            { "label": "Name",     "name": "name",     "type": "input/text" },
            { "label": "Required", "name": "required", "type": "checkbox" },
            { "label": "Type",     "name": "type",     "type": "input/text" },
            { "label": "Example",  "name": "example",  "type": "input/text" }
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
  name: string
): ValueChange | undefined {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i]?.name === name) {
      return events[i]
    }
  }
  return undefined
}

test.describe(
  'List removal of a non-last hydrated item',
  { tag: ['@e2e'] },
  () => {
    test('keeps the trailing item value after removing the middle one', async ({
      page,
    }) => {
      await inject(page, HYDRATED_LIST)
      await page.goto('/reactive')

      const cards = page.locator('[data-slot="list-item-card"]')

      // Three hydrated, collapsed cards: First Name, Email, Phone.
      await expect(cards).toHaveCount(3)
      await expect(cards.nth(0)).toContainText('First Name')
      await expect(cards.nth(1)).toContainText('Email')
      await expect(cards.nth(2)).toContainText('Phone')

      // Remove the middle item without editing anything.
      await page.getByRole('button', { name: 'Remove Field item 2' }).click()

      // Two cards remain: the survivors must still be First Name and Phone.
      await expect(cards).toHaveCount(2)
      await expect(cards.nth(0)).toContainText('First Name')
      // BUG: the trailing survivor (stable id 2) reads `field.2.label` against the
      // re-passed, compacted 2-element array, so its label resolves to undefined
      // and the header falls back to the placeholder "Field 2" instead of "Phone".
      await expect(cards.nth(1)).toContainText('Phone')
    })

    test('expanded trailing survivor keeps its hydrated inputs', async ({
      page,
    }) => {
      await inject(page, HYDRATED_LIST)
      await page.goto('/reactive')

      await page.getByRole('button', { name: 'Remove Field item 2' }).click()

      // The trailing survivor stays keyed by stable id 2 (survivors are [0, 2]),
      // so its inputs are named `field.2.*`. Expanding re-hydrates from the parent
      // value, which is now the compacted [First Name, Phone] array -> `field.2.*`
      // is undefined -> inputs render empty.
      await page.getByRole('button', { name: 'Expand Field 2' }).click()

      await expect(page.locator('input[name="field.2.label"]')).toHaveValue(
        'Phone'
      )
      await expect(page.locator('input[name="field.2.name"]')).toHaveValue(
        'phone'
      )
    })

    test('onValueChange emits the 1st and 3rd originals (not the deleted 2nd)', async ({
      page,
    }) => {
      await inject(page, HYDRATED_LIST)
      const events = captureValueChanges(page)
      await page.goto('/reactive')

      await page.getByRole('button', { name: 'Remove Field item 2' }).click()

      await expect
        .poll(() => {
          const last = lastEventFor(events, 'field')
          return Array.isArray(last?.value)
            ? (last.value as Array<Record<string, unknown>>).map(
                (item) => item.label
              )
            : undefined
        })
        .toEqual(['First Name', 'Phone'])
    })
  }
)
