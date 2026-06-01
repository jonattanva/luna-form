import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; type?: string; value: unknown }

// Controlled <Form> with a multi-field list hydrated from `value` with three
// items. After removing a non-last item the surviving items keep their values
// (the 0.0.61 / PR #38 reset fix), but their leaf-level `onValueChange` paths
// still use the internal stable id instead of the current array position. A
// positional consumer cannot map `field.<staleId>.<leaf>` onto the compacted
// array, which is what produces the persisted ghost item.
const GHOST_LIST = `{
  "value": {
    "field": [
      { "label": "First Name",   "name": "first_name", "required": "true",  "type": "text",  "example": "Jane" },
      { "label": "Email",        "name": "email",       "required": "true",  "type": "email", "example": "jane@example.com" },
      { "label": "Mobile Phone", "name": "phone",       "required": "false", "type": "tel",   "example": "555-1234" }
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
          "advanced": { "action": "Add field", "length": { "min": 1 } },
          "fields": [
            { "label": "Label",    "name": "label",    "type": "input/text" },
            { "label": "Name",     "name": "name",     "type": "input/text" },
            { "label": "Required", "name": "required", "type": "select/active" },
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
  predicate: (e: ValueChange) => boolean
): ValueChange | undefined {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i] && predicate(events[i])) {
      return events[i]
    }
  }
  return undefined
}

test.describe('List removal leaves no ghost item', { tag: ['@e2e'] }, () => {
  test('the list-level emit is correct after removing a non-last item', async ({
    page,
  }) => {
    await inject(page, GHOST_LIST)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await expect(page.locator('input[name$=".label"]')).toHaveCount(3)

    await page.getByRole('button', { name: 'Remove Field item 2' }).click()

    // The list-level positional emit keeps exactly the 1st and 3rd originals
    // (the reset fix from PR #38). This is the part that already works.
    await expect
      .poll(() => {
        const last = lastEventFor(events, (e) => e.name === 'field')
        return Array.isArray(last?.value)
          ? (last.value as Array<Record<string, unknown>>).map((i) => i.label)
          : undefined
      })
      .toEqual(['First Name', 'Mobile Phone'])
  })

  test('editing a survivor after a non-last removal emits a positional leaf path', async ({
    page,
  }) => {
    await inject(page, GHOST_LIST)
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    const labels = page.locator('input[name$=".label"]')
    await expect(labels).toHaveCount(3)

    // Remove the middle item. Survivors keep stable ids [0, 2]; the trailing
    // survivor "Mobile Phone" is now at array position 1.
    await page.getByRole('button', { name: 'Remove Field item 2' }).click()
    await expect(labels).toHaveCount(2)

    // Edit the trailing survivor's label (now at position 1).
    const survivorLabel = labels.nth(1)
    await expect(survivorLabel).toHaveValue('Mobile Phone')
    await survivorLabel.fill('Mobile Phone Number')

    // The leaf emit must address the item by its CURRENT POSITION
    // (field.1.label) to match the positional array the consumer stores.
    // BUG: it is emitted as field.2.label (the stale stable id), which a
    // positional consumer writes at index 2 -> trailing ghost item.
    const leaf = await test.step('wait for leaf emit', async () => {
      await expect
        .poll(() =>
          lastEventFor(events, (e) => /^field\.\d+\.label$/.test(e.name))
        )
        .toMatchObject({ value: 'Mobile Phone Number' })
      return lastEventFor(events, (e) => /^field\.\d+\.label$/.test(e.name))
    })

    expect(
      leaf?.name,
      `leaf emit path should be positional; got ${leaf?.name}`
    ).toBe('field.1.label')
  })
})
