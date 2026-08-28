import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// The `state` half of a change event at mount is covered by
// `initial-value-chips-state-event.spec.ts`. This file covers the other two
// actions on the same replay -- `value` and `source` -- which write into
// fields that are still mounting when the replay runs.

const VALUE_ACTION = `{
  "action": "value",
  "value": { "advanced_body": "saved" }
}`

const SOURCE_ACTION = `{
  "action": "source",
  "target": "city",
  "source": { "url": "/api/cities" }
}`

const chips = (action: string, value: string) => `{
  "value": ${value},
  "sections": [
    {
      "fields": [
        {
          "label": "Data type",
          "name": "data_type",
          "type": "chips",
          "advanced": { "multiple": false },
          "source": [
            { "label": "None", "value": "none" },
            { "label": "Custom JSON", "value": "advanced" }
          ],
          "event": { "change": [${action}] }
        },
        {
          "label": "Advanced body",
          "name": "advanced_body",
          "type": "input/text"
        },
        {
          "label": "City",
          "name": "city",
          "type": "select"
        }
      ]
    }
  ]
}`

// The same event, with the target declared before the field that writes to it.
// Declaration order decides mount order, and the replay runs from the mount of
// the field that carries the event.
const chipsAfterTarget = (value: string) => `{
  "value": ${value},
  "sections": [
    {
      "fields": [
        {
          "label": "Advanced body",
          "name": "advanced_body",
          "type": "input/text"
        },
        {
          "label": "Data type",
          "name": "data_type",
          "type": "chips",
          "advanced": { "multiple": false },
          "source": [
            { "label": "None", "value": "none" },
            { "label": "Custom JSON", "value": "advanced" }
          ],
          "event": { "change": [${VALUE_ACTION}] }
        }
      ]
    }
  ]
}`

const selectable = (type: string, value: string) => `{
  "value": ${value},
  "sections": [
    {
      "fields": [
        {
          "label": "Data type",
          "name": "data_type",
          "type": "${type}",
          "source": [
            { "label": "None", "value": "none" },
            { "label": "Custom JSON", "value": "advanced" }
          ],
          "event": { "change": [${VALUE_ACTION}] }
        },
        {
          "label": "Advanced body",
          "name": "advanced_body",
          "type": "input/text"
        }
      ]
    }
  ]
}`

// A `state` that hides on the other chip, which clears what the target holds.
// Reopened on the chip that does not hide it, the replay must leave the saved
// text where it is.
const clearing = (value: string) => `{
  "value": ${value},
  "sections": [
    {
      "fields": [
        {
          "label": "Data type",
          "name": "data_type",
          "type": "chips",
          "advanced": { "multiple": false },
          "source": [
            { "label": "None", "value": "none" },
            { "label": "Custom JSON", "value": "advanced" }
          ],
          "event": {
            "change": [
              {
                "action": "state",
                "target": ["advanced_body"],
                "state": { "hidden": true },
                "when": "none"
              }
            ]
          }
        },
        {
          "label": "Advanced body",
          "name": "advanced_body",
          "type": "input/text"
        }
      ]
    }
  ]
}`

const mockCities = (page: Page) =>
  page.route('**/api/cities*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ label: 'Bogota', value: 'bogota' }]),
    })
  })

const getSelect = (page: Page, label: string) =>
  page
    .locator('[data-slot="field"]')
    .filter({ hasText: label })
    .getByRole('combobox')
    .first()

test.describe('Initial value chips change actions', { tag: ['@e2e'] }, () => {
  test('should fill the target when the form opens on a saved chips value', async ({
    page,
  }) => {
    await inject(page, chips(VALUE_ACTION, `{ "data_type": ["advanced"] }`))
    await page.goto('/reactive')

    await expect(page.locator('input[name="advanced_body"]')).toHaveValue(
      'saved'
    )
  })

  test('should fill the target when the chip is clicked', async ({ page }) => {
    await inject(page, chips(VALUE_ACTION, `{}`))
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Custom JSON' }).click()

    await expect(page.locator('input[name="advanced_body"]')).toHaveValue(
      'saved'
    )
  })

  test('should fill a target declared before the chips field', async ({
    page,
  }) => {
    await inject(page, chipsAfterTarget(`{ "data_type": ["advanced"] }`))
    await page.goto('/reactive')

    await expect(page.locator('input[name="advanced_body"]')).toHaveValue(
      'saved'
    )
  })

  test('should submit what the form opened on and filled in', async ({
    page,
  }) => {
    await inject(page, chips(VALUE_ACTION, `{ "data_type": ["advanced"] }`))
    await page.goto('/reactive')

    await expect(page.locator('input[name="advanced_body"]')).toHaveValue(
      'saved'
    )
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    const payload = page.locator('pre code')
    await expect(payload).toContainText('"advanced_body"')
    await expect(payload).toContainText('"saved"')
  })

  test('should load the target source when the form opens on a saved chips value', async ({
    page,
  }) => {
    await mockCities(page)
    await inject(page, chips(SOURCE_ACTION, `{ "data_type": ["advanced"] }`))
    await page.goto('/reactive')

    await getSelect(page, 'City').click()

    await expect(page.getByRole('option', { name: 'Bogota' })).toBeVisible()
  })

  test('should load the target source when the chip is clicked', async ({
    page,
  }) => {
    await mockCities(page)
    await inject(page, chips(SOURCE_ACTION, `{}`))
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Custom JSON' }).click()
    await getSelect(page, 'City').click()

    await expect(page.getByRole('option', { name: 'Bogota' })).toBeVisible()
  })

  test('should fill the target when the form opens on a saved select value', async ({
    page,
  }) => {
    await inject(page, selectable('select', `{ "data_type": "advanced" }`))
    await page.goto('/reactive')

    await expect(page.locator('input[name="advanced_body"]')).toHaveValue(
      'saved'
    )
  })

  test('should fill the target when the form opens on a saved radio value', async ({
    page,
  }) => {
    await inject(page, selectable('radio', `{ "data_type": "advanced" }`))
    await page.goto('/reactive')

    await expect(page.locator('input[name="advanced_body"]')).toHaveValue(
      'saved'
    )
  })

  test('should keep the target visible when the saved chips value does not hide it', async ({
    page,
  }) => {
    await inject(
      page,
      clearing(
        `{ "data_type": ["advanced"], "advanced_body": "{ \\"a\\": 1 }" }`
      )
    )
    await page.goto('/reactive')

    await expect(page.locator('input[name="advanced_body"]')).toHaveValue(
      '{ "a": 1 }'
    )
  })
})
