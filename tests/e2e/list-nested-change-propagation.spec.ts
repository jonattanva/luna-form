import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; value: unknown }

// Nested list: `rules` (groups) -> `rule` (conditions). A single leaf per rule
// keeps the repro minimal.
const NESTED = `{
  "value": {
    "rules": [
      { "rule": [ { "rule": "a" }, { "rule": "b" } ] }
    ]
  },
  "sections": [
    {
      "fields": [
        {
          "name": "rules",
          "type": "list",
          "advanced": { "title": "Condition Group", "action": "Add new condition group" },
          "fields": [
            {
              "name": "rule",
              "type": "list",
              "advanced": { "title": "Rule", "action": "Add new rule" },
              "fields": [
                { "name": "rule", "type": "input/text" }
              ]
            }
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

const lastChangeNamed = (events: ValueChange[], name: string) =>
  [...events].reverse().find((event) => event?.name === name)

test.describe('Nested list change propagation', { tag: ['@e2e'] }, () => {
  test('removing an item of a NESTED list emits onValueChange to the root', async ({
    page,
  }) => {
    await inject(page, NESTED)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Remove Rule item 2' }).click()

    // The inner list must emit its structural change under its full positional
    // name (`rules.0.rule`) with the reduced array, just like leaf edits emit
    // `rules.0.rule.0.rule`.
    await expect
      .poll(() => lastChangeNamed(events, 'rules.0.rule'))
      .toEqual({ name: 'rules.0.rule', value: [{ rule: 'a' }] })
  })

  test('adding an item to a NESTED list emits onValueChange to the root', async ({
    page,
  }) => {
    await inject(page, NESTED)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await page
      .getByRole('button', { name: /Add new rule/ })
      .first()
      .click()

    await expect
      .poll(() => lastChangeNamed(events, 'rules.0.rule'))
      .toEqual({
        name: 'rules.0.rule',
        value: [{ rule: 'a' }, { rule: 'b' }, { rule: undefined }],
      })
  })
})
