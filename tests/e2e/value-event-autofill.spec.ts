import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; value: unknown }

// Schema that mirrors the bug report: typing in `label` should auto-fill
// `name`, with `name` carrying a transform pipeline. `onlyIfTargetEmpty: true`
// is the flag that the buggy path (pre-fix) was misinterpreting.
const AUTOFILL_LIST = `{
  "sections": [
    {
      "title": "Field",
      "fields": [
        {
          "label": "Field",
          "name": "field",
          "type": "list",
          "advanced": { "action": "Add another field", "length": { "min": 1 } },
          "fields": [
            {
              "label": "Name that users will see",
              "name": "label",
              "type": "input/text",
              "event": {
                "change": [
                  {
                    "action": "value",
                    "onlyIfTargetEmpty": true,
                    "value": { "field/name": "{value}" }
                  }
                ]
              }
            },
            {
              "label": "Technical key",
              "name": "name",
              "type": "input/text",
              "advanced": {
                "transform": ["remove-space", "lowercase", "remove-accent"]
              }
            }
          ]
        }
      ]
    }
  ],
  "value": { "field": [{}] }
}`

// The same schema plus `echo`, a second target the source writes to
// unconditionally, and without a `value` of its own.
//
// `echo` is how a test can tell that the debounced batch has run without
// asking about `name`, which is the field under test and whose value at that
// exact instant is what the two tests below are about.
//
// No `value` because these tests run against `/`, which renders the form
// without one. That is the difference that matters: `/reactive` feeds every
// `onValueChange` straight back in as `value`, and a changed `value` prop makes
// the field re-run its change events on the spot -- so there the copy lands
// about 17ms after the source is typed, long before anyone can reach the
// target. Without the echo the only thing that delivers it is the 300ms
// debounce in `input-textable`, which is wide enough to click into a field.
const AUTOFILL_LIST_WITH_ECHO = `{
  "sections": [
    {
      "title": "Field",
      "fields": [
        {
          "label": "Field",
          "name": "field",
          "type": "list",
          "advanced": { "action": "Add another field", "length": { "min": 1 } },
          "fields": [
            {
              "label": "Name that users will see",
              "name": "label",
              "type": "input/text",
              "event": {
                "change": [
                  {
                    "action": "value",
                    "onlyIfTargetEmpty": true,
                    "value": { "field/name": "{value}" }
                  },
                  {
                    "action": "value",
                    "value": { "field/echo": "{value}" }
                  }
                ]
              }
            },
            {
              "label": "Technical key",
              "name": "name",
              "type": "input/text",
              "advanced": {
                "transform": ["remove-space", "lowercase", "remove-accent"]
              }
            },
            {
              "label": "Echo",
              "name": "echo",
              "type": "input/text"
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
  'Value-event auto-fill (label -> name with transforms)',
  { tag: ['@e2e'] },
  () => {
    test('Bug A: target keeps mirroring source while user has not edited it', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST)
      captureValueChanges(page)
      await page.goto('/reactive')

      const labelInput = page.locator('input[name="field.0.label"]')
      const nameInput = page.locator('input[name="field.0.name"]')

      // Type "Name" character-by-character — pre-fix this would freeze the
      // target at "n" because `onlyIfTargetEmpty && !isEmpty("n")` short-
      // circuits subsequent keystrokes.
      await labelInput.click()
      for (const ch of ['N', 'Na', 'Nam', 'Name']) {
        await labelInput.fill(ch)
      }

      await expect(nameInput).toHaveValue('name')
    })

    test('Bug B: consumer receives an onValueChange for the auto-filled target', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST)
      const events = captureValueChanges(page)
      await page.goto('/reactive')

      await page.locator('input[name="field.0.label"]').fill('Name')

      await expect
        .poll(() => lastEventFor(events, 'field.0.name'))
        .toMatchObject({ name: 'field.0.name', value: 'name' })

      // The source event must also have fired.
      await expect
        .poll(() => lastEventFor(events, 'field.0.label'))
        .toMatchObject({ name: 'field.0.label', value: 'Name' })
    })

    test('stop on user edit: manual edits to the target lock it from further auto-fills', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST)
      captureValueChanges(page)
      await page.goto('/reactive')

      const labelInput = page.locator('input[name="field.0.label"]')
      const nameInput = page.locator('input[name="field.0.name"]')

      await labelInput.fill('Name')
      await expect(nameInput).toHaveValue('name')

      // User overrides the auto-filled value manually.
      await nameInput.fill('custom_key')
      await expect(nameInput).toHaveValue('custom_key')

      // Subsequent edits to the source must not clobber the user's value.
      await labelInput.fill('Nombre')
      await expect(nameInput).toHaveValue('custom_key')
    })

    test('persistence: auto-filled value survives a re-render with the parent value', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST)
      captureValueChanges(page)
      await page.goto('/reactive')

      await page.locator('input[name="field.0.label"]').fill('Name')

      // The reactive harness echoes onValueChange back into the value prop on
      // every emit. An add-another-field click forces the form to re-render
      // and re-hydrate from the parent's value — if Bug B were still present,
      // `name` would not be in `value` and the input would clear.
      await page
        .getByRole('button', { name: /Add another field/ })
        .first()
        .click()

      await expect(page.locator('input[name="field.0.name"]')).toHaveValue(
        'name'
      )
    })

    // The tests above all wait for the auto-fill to land before touching the
    // target, which is what hid the next two: the copy is debounced by 300ms,
    // so anyone who reaches the still-empty target inside that window has it
    // delivered under their caret. Writing a controlled input's value while it
    // is focused collapses the selection to the end of the new text, and
    // everything typed afterwards lands behind it -- the report was
    // `customeremailcustomer_email`.
    //
    // Nothing here is timing-dependent. The click lands well inside the 300ms,
    // and the copy is then awaited through `echo` rather than raced, so by the
    // first keystroke the target is provably focused and the batch has provably
    // run. Before the fix this failed 18 times out of 18, on all three
    // browsers, with exactly the reported value.
    test('a target the user is already in keeps what the user typed', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST_WITH_ECHO)
      await page.goto('/')

      const labelInput = page.locator('input[name="field.0.label"]')
      const nameInput = page.locator('input[name="field.0.name"]')
      const echoInput = page.locator('input[name="field.0.echo"]')

      await labelInput.fill('Customer Email')

      // Into the empty key before the copy is due.
      await nameInput.click()

      // `echo` is written by the same batch, so this is the copy landing.
      await expect(echoInput).toHaveValue('Customer Email')

      await nameInput.pressSequentially('customer_email')

      await expect(nameInput).toHaveValue('customer_email')
    })

    // The cheap way to satisfy the test above is to throw the copy away
    // whenever the target has focus, which would strand anyone who clicks into
    // the key to look at it and leaves without typing: they would keep the
    // empty required field the auto-fill exists to spare them. It is postponed,
    // not dropped.
    test('a target the user leaves untouched still receives the auto-fill', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST_WITH_ECHO)
      await page.goto('/')

      const labelInput = page.locator('input[name="field.0.label"]')
      const nameInput = page.locator('input[name="field.0.name"]')
      const echoInput = page.locator('input[name="field.0.echo"]')

      await labelInput.fill('Customer Email')
      await nameInput.click()
      await expect(echoInput).toHaveValue('Customer Email')

      // Away without typing a thing.
      await echoInput.click()

      await expect(nameInput).toHaveValue('customeremail')
    })
  }
)
