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
  }
)
