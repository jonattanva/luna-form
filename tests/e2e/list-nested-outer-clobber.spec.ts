import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; value: unknown }

// The same two-deep shape as `list-nested-change-propagation`, but read from
// the other end: there, the inner list is the one that changes and the outer
// one is the path it has to emit under. Here the OUTER list is the one that
// changes, and the question is what it says its rows are worth.
//
// One group holding one rule, so that the second group an add produces is
// unambiguous, and the first is already carrying something to lose.
//
// `collapsed: false` is what makes a group collapsible at all -- the control
// is offered whenever the key is present, whatever it is set to -- and it is
// what luna-flow's conditional declares.
const NESTED = `{
  "value": {
    "rules": [
      { "rule": [ { "rule": "a" } ] }
    ]
  },
  "sections": [
    {
      "fields": [
        {
          "name": "rules",
          "type": "list",
          "advanced": { "title": "Condition Group", "action": "Add new condition group", "collapsed": false },
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

test.describe('Nested list outer change', { tag: ['@e2e'] }, () => {
  test('adding an OUTER item keeps what the groups already hold', async ({
    page,
  }) => {
    await inject(page, NESTED)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await page.getByRole('button', { name: /Add new condition group/ }).click()

    // The group that was already there keeps its rules, and the one just added
    // is the only empty one. Emitting `[{}, {}]` here is what used to wipe the
    // consumer's document while the form went on showing the rules.
    await expect
      .poll(() => lastChangeNamed(events, 'rules'))
      .toEqual({
        name: 'rules',
        value: [{ rule: [{ rule: 'a' }] }, { rule: undefined }],
      })
  })

  test('adding an OUTER item keeps an edit made since mount', async ({
    page,
  }) => {
    await inject(page, NESTED)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    // The value the list mounted with is the one thing it could always fall
    // back on. Typing first is what says the live rows are read, and not that
    // snapshot: after this, "a" is the stale answer and "edited" the right one.
    const field = page.locator('[id="rules.0.rule.0.rule"]')
    await field.fill('edited')

    await page.getByRole('button', { name: /Add new condition group/ }).click()

    await expect
      .poll(() => lastChangeNamed(events, 'rules'))
      .toEqual({
        name: 'rules',
        value: [{ rule: [{ rule: 'edited' }] }, { rule: undefined }],
      })
  })

  test('adding an OUTER item keeps an edit made inside a collapsed group', async ({
    page,
  }) => {
    await inject(page, NESTED)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await page.locator('[id="rules.0.rule.0.rule"]').fill('edited')

    // Collapsing is what separates "on screen" from "able to answer": the row
    // goes into <Activity mode="hidden">, which keeps its state and tears its
    // effects down. The inner list stops answering while the value it owns is
    // still the live one, so this is the case that says the hand-off on the
    // way out happened -- without it the answer is the mounted value, "a".
    await page
      .getByRole('button', { name: 'Collapse Condition Group 1' })
      .click()
    await expect(page.locator('[id="rules.0.rule.0.rule"]')).toBeHidden()

    await page.getByRole('button', { name: /Add new condition group/ }).click()

    await expect
      .poll(() => lastChangeNamed(events, 'rules'))
      .toEqual({
        name: 'rules',
        value: [{ rule: [{ rule: 'edited' }] }, { rule: undefined }],
      })
  })

  test('removing an OUTER item keeps what the surviving group holds', async ({
    page,
  }) => {
    await inject(page, NESTED)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await page.getByRole('button', { name: /Add new condition group/ }).click()
    await page.locator('[id="rules.1.rule.0.rule"]').fill('kept')

    // The first and not the last, which is what tells "removed the one asked
    // for" apart from "removed one" -- and the emitted array is positional, so
    // the survivor has to arrive at index 0 carrying its own rules.
    await page
      .getByRole('button', { name: 'Remove Condition Group item 1' })
      .click()

    await expect
      .poll(() => lastChangeNamed(events, 'rules'))
      .toEqual({
        name: 'rules',
        value: [{ rule: [{ rule: 'kept' }] }],
      })
  })
})
