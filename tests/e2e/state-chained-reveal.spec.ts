import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Chained state reveal', { tag: ['@e2e'] }, () => {
  // A field revealed by a `state` rule can carry a `state` rule of its own,
  // and what that second rule reveals hangs on the first field's value. When
  // the first field is hidden again its value goes with it -- "once a `state`
  // action hides a field, the value is gone" (docs/events/change.md) -- and
  // with it the condition that revealed the second target. So the second
  // target has to go as well.
  //
  // It does not: it stays on screen, and it stays even once the field that
  // revealed it comes back empty. Found on `examples/form/step.json`, where
  // picking "List / Collection", then "Detailed items", then another type
  // leaves "What's inside each item?" under a question nobody has answered.
  // Reproduced on `main`, on top-level fields and inside a list row alike.
  //
  // These run against `/reactive`: the host there holds the values and feeds
  // them back, which is the arrangement the clear is written for.
  const chain = (prefix: string) => `
    {
      "label": "Kind",
      "name": "kind",
      "type": "chips",
      "advanced": { "multiple": false },
      "source": [
        { "label": "List", "value": "list" },
        { "label": "Plain text", "value": "text" }
      ],
      "event": {
        "change": [
          {
            "action": "state",
            "target": ["${prefix}items_kind"],
            "state": { "hidden": false },
            "when": ["list"]
          }
        ]
      }
    },
    {
      "label": "Items kind",
      "name": "items_kind",
      "type": "chips",
      "hidden": true,
      "advanced": { "multiple": false },
      "source": [
        { "label": "Detailed", "value": "detailed" },
        { "label": "Simple", "value": "simple" }
      ],
      "event": {
        "change": [
          {
            "action": "state",
            "target": ["${prefix}detail"],
            "state": { "hidden": false },
            "when": ["detailed"]
          }
        ]
      }
    },
    {
      "label": "Detail",
      "name": "detail",
      "type": "input/text",
      "hidden": true
    }`

  const topLevel = `{ "sections": [{ "fields": [${chain('')}] }] }`

  const inRow = `{
    "sections": [{
      "fields": [{
        "label": "Rows",
        "name": "rows",
        "type": "list",
        "advanced": { "length": { "min": 1 } },
        "fields": [${chain('rows/')}]
      }]
    }]
  }`

  const chip = (page: Page, name: string) =>
    page.getByRole('button', { name, exact: true })

  // Matches the top-level `detail` and a row's `rows.<id>.detail` alike.
  const detail = (page: Page) => page.locator('input[name$="detail"]')

  /**
   * Walk the chain forwards -- each answer reveals the next question -- then
   * hide its first link.
   */
  const revealThenHide = async (page: Page, definition: string) => {
    await inject(page, definition)
    await page.goto('/reactive')

    await chip(page, 'List').click()
    await expect(chip(page, 'Detailed')).toBeVisible()

    await chip(page, 'Detailed').click()
    await expect(detail(page)).toBeVisible()

    await chip(page, 'Plain text').click()
    await expect(chip(page, 'Detailed')).toBeHidden()
  }

  for (const [where, definition] of [
    ['top-level fields', topLevel],
    ['a list row', inRow],
  ] as const) {
    test(`hides what a hidden field revealed, on ${where}`, async ({
      page,
    }) => {
      await revealThenHide(page, definition)

      await expect(detail(page)).toBeHidden()
    })

    test(`does not leave it standing when the field comes back empty, on ${where}`, async ({
      page,
    }) => {
      await revealThenHide(page, definition)
      await chip(page, 'List').click()

      // The question is back and empty, as a hidden field's value is gone...
      await expect(chip(page, 'Detailed')).toBeVisible()
      // ...so nothing it answered can still be standing.
      await expect(detail(page)).toBeHidden()
    })
  }
})
