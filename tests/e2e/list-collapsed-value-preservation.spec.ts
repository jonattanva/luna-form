import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; value: unknown }

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

const COLLAPSED_LIST_ONE_ITEM = `{
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
      { "label": "Email", "name": "email" }
    ]
  }
}`

const EXPANDED_LIST_THREE_ITEMS = `{
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
            "collapsed": false,
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

async function lastFieldChange(
  events: ValueChange[]
): Promise<ValueChange | undefined> {
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i]
    if (event?.name === 'field') {
      return event
    }
  }
  return undefined
}

test.describe('List collapsed value preservation', { tag: ['@e2e'] }, () => {
  test('preserves data of three collapsed items when adding a new item', async ({
    page,
  }) => {
    await inject(page, COLLAPSED_LIST_THREE_ITEMS)
    const events = captureValueChanges(page)
    await page.goto('')

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
  })

  test('preserves the single collapsed item when adding a new item', async ({
    page,
  }) => {
    await inject(page, COLLAPSED_LIST_ONE_ITEM)
    const events = captureValueChanges(page)
    await page.goto('')

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
          { label: undefined, name: undefined },
        ],
      })
  })

  test('preserves remaining items when removing the middle collapsed item', async ({
    page,
  }) => {
    await inject(page, COLLAPSED_LIST_THREE_ITEMS)
    const events = captureValueChanges(page)
    await page.goto('')

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
  })

  test('preserves remaining items when removing the first collapsed item', async ({
    page,
  }) => {
    await inject(page, COLLAPSED_LIST_THREE_ITEMS)
    const events = captureValueChanges(page)
    await page.goto('')

    await page.getByRole('button', { name: 'Remove Field item 1' }).click()

    await expect
      .poll(() => lastFieldChange(events))
      .toEqual({
        name: 'field',
        value: [
          { label: 'Phone', name: 'phone' },
          { label: 'Address', name: 'address' },
        ],
      })
  })

  test('preserves edits made to an expanded item when adding another item', async ({
    page,
  }) => {
    await inject(page, COLLAPSED_LIST_THREE_ITEMS)
    const events = captureValueChanges(page)
    await page.goto('')

    // Expand the second item by clicking its collapsed header.
    await page
      .getByRole('button', { name: /Expand Field 2/ })
      .first()
      .click()

    const phoneLabelInput = page.locator('input[name="field.1.label"]')
    await expect(phoneLabelInput).toBeVisible()
    await phoneLabelInput.fill('Phone (edited)')

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
          { label: 'Phone (edited)', name: 'phone' },
          { label: 'Address', name: 'address' },
          { label: undefined, name: undefined },
        ],
      })
  })

  test('preserves edits and remaining collapsed items when removing a different item', async ({
    page,
  }) => {
    await inject(page, COLLAPSED_LIST_THREE_ITEMS)
    const events = captureValueChanges(page)
    await page.goto('')

    await page
      .getByRole('button', { name: /Expand Field 2/ })
      .first()
      .click()

    const phoneLabelInput = page.locator('input[name="field.1.label"]')
    await expect(phoneLabelInput).toBeVisible()
    await phoneLabelInput.fill('Phone (edited)')

    await page.getByRole('button', { name: 'Remove Field item 1' }).click()

    await expect
      .poll(() => lastFieldChange(events))
      .toEqual({
        name: 'field',
        value: [
          { label: 'Phone (edited)', name: 'phone' },
          { label: 'Address', name: 'address' },
        ],
      })
  })

  test('regression: non-collapsed list still preserves data on add', async ({
    page,
  }) => {
    await inject(page, EXPANDED_LIST_THREE_ITEMS)
    const events = captureValueChanges(page)
    await page.goto('')

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
  })
})
