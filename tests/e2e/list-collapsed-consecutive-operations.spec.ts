import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; value: unknown }

const COLLAPSED_LIST_FOUR_ITEMS = `{
  "sections": [
    {
      "title": "Fields",
      "fields": [
        {
          "label": "Field",
          "name": "field",
          "type": "list",
          "advanced": {
            "action": "Add another field",
            "collapsed": true,
            "length": { "min": 0 }
          },
          "fields": [
            { "name": "label", "type": "input/text", "label": "Label" },
            { "name": "name", "type": "input/text", "label": "Name" }
          ]
        }
      ]
    }
  ],
  "value": {
    "field": [
      { "label": "Email", "name": "email" },
      { "label": "Phone", "name": "phone" },
      { "label": "Address", "name": "address" },
      {}
    ]
  }
}`

const COLLAPSED_LIST_THREE_ITEMS = `{
  "sections": [
    {
      "title": "Fields",
      "fields": [
        {
          "label": "Field",
          "name": "field",
          "type": "list",
          "advanced": {
            "action": "Add another field",
            "collapsed": true,
            "length": { "min": 0 }
          },
          "fields": [
            { "name": "label", "type": "input/text", "label": "Label" },
            { "name": "name", "type": "input/text", "label": "Name" }
          ]
        }
      ]
    }
  ],
  "value": {
    "field": [
      { "label": "Email", "name": "email" },
      { "label": "Phone", "name": "phone" },
      { "label": "Address", "name": "address" }
    ]
  }
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

function lastFieldChange(events: ValueChange[]): ValueChange | undefined {
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i]
    if (event?.name === 'field') {
      return event
    }
  }
  return undefined
}

test.describe(
  'List collapsed consecutive operations (reactive parent)',
  { tag: ['@e2e'] },
  () => {
    test('preserves remaining items across two consecutive removes (middle then first)', async ({
      page,
    }) => {
      await inject(page, COLLAPSED_LIST_FOUR_ITEMS)
      const events = captureValueChanges(page)
      await page.goto('/reactive')

      // First remove: middle item (Phone).
      await page.getByRole('button', { name: 'Remove Field item 2' }).click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [
            { label: 'Email', name: 'email' },
            { label: 'Address', name: 'address' },
            { label: undefined, name: undefined },
          ],
        })

      // Second remove: first item (Email). At this point the parent has
      // already collapsed `value` to length 3 with contiguous indices, while
      // the internal stable IDs are [0, 2, 3]. The fix maps each stable ID to
      // its position in the pre-remove items array to look up the right slot.
      await page.getByRole('button', { name: 'Remove Field item 1' }).click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [
            { label: 'Address', name: 'address' },
            { label: undefined, name: undefined },
          ],
        })
    })

    test('preserves remaining items across three consecutive removes at position 0', async ({
      page,
    }) => {
      await inject(page, COLLAPSED_LIST_FOUR_ITEMS)
      const events = captureValueChanges(page)
      await page.goto('/reactive')

      // Remove "Email".
      await page.getByRole('button', { name: 'Remove Field item 1' }).click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [
            { label: 'Phone', name: 'phone' },
            { label: 'Address', name: 'address' },
            { label: undefined, name: undefined },
          ],
        })

      // Remove "Phone".
      await page.getByRole('button', { name: 'Remove Field item 1' }).click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [
            { label: 'Address', name: 'address' },
            { label: undefined, name: undefined },
          ],
        })

      // Remove "Address".
      await page.getByRole('button', { name: 'Remove Field item 1' }).click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [{ label: undefined, name: undefined }],
        })
    })

    test('preserves data across Remove then Add', async ({ page }) => {
      await inject(page, COLLAPSED_LIST_THREE_ITEMS)
      const events = captureValueChanges(page)
      await page.goto('/reactive')

      // Remove "Phone".
      await page.getByRole('button', { name: 'Remove Field item 2' }).click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [
            { label: 'Email', name: 'email' },
            { label: 'Address', name: 'address' },
          ],
        })

      // Add a new item — survivors must remain intact.
      await page
        .getByRole('button', { name: /Add another field/ })
        .first()
        .click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [
            { label: 'Email', name: 'email' },
            { label: 'Address', name: 'address' },
            { label: undefined, name: undefined },
          ],
        })
    })

    test('preserves data across Add then Remove', async ({ page }) => {
      await inject(page, COLLAPSED_LIST_THREE_ITEMS)
      const events = captureValueChanges(page)
      await page.goto('/reactive')

      // Add a new (empty) item.
      await page
        .getByRole('button', { name: /Add another field/ })
        .first()
        .click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [
            { label: 'Email', name: 'email' },
            { label: 'Phone', name: 'phone' },
            { label: 'Address', name: 'address' },
            { label: undefined, name: undefined },
          ],
        })

      // Remove "Phone".
      await page.getByRole('button', { name: 'Remove Field item 2' }).click()
      await expect
        .poll(() => lastFieldChange(events))
        .toEqual({
          name: 'field',
          value: [
            { label: 'Email', name: 'email' },
            { label: 'Address', name: 'address' },
            { label: undefined, name: undefined },
          ],
        })
    })
  }
)
