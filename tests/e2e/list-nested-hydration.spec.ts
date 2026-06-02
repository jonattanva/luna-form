import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

// Controlled <Form> with a top-level `list` (`field`) whose item contains a
// NESTED `list` (`items`). The `value` prop pre-populates the nested list with
// two rows. The nested list is named by its dotted path (`field.0.items`) and
// receives the full form value unchanged, so its row count is resolved via
// `extract(value, "field.0.items")` -- which cannot traverse the `field` array
// (isObject is false for arrays), returns null, and the nested list starts at 0
// rows. The data survives in `value` but never becomes editable rows.
//
// The nested list is intentionally left non-collapsed so its single `key` input
// renders directly and visibly, keeping the assertion free of <Activity> timing.
const NESTED_HYDRATED_LIST = `{
  "value": {
    "field": [
      { "label": "Contact", "items": [ { "key": "name" }, { "key": "phone" } ] }
    ]
  },
  "sections": [
    {
      "title": "Field",
      "fields": [
        {
          "name": "field",
          "type": "list",
          "label": "Field",
          "advanced": { "action": "Add field", "collapsed": true, "length": { "min": 0 } },
          "fields": [
            { "name": "label", "type": "input/text", "label": "Label" },
            {
              "name": "items",
              "type": "list",
              "label": "Items",
              "advanced": { "action": "Add item", "length": { "min": 0 } },
              "fields": [
                { "name": "key", "type": "input/text", "label": "Key" }
              ]
            }
          ]
        }
      ]
    }
  ]
}`

test.describe('Nested list hydration from value', { tag: ['@e2e'] }, () => {
  test('hydrates nested list rows from value on mount', async ({ page }) => {
    await inject(page, NESTED_HYDRATED_LIST)
    await page.goto('/reactive')

    // Top-level list has one hydrated, collapsed item ("Contact").
    await page.getByRole('button', { name: 'Expand Field 1' }).click()

    // Sanity: the top-level item hydrated (label + the nested list is rendered).
    await expect(page.locator('input[name="field.0.label"]')).toHaveValue(
      'Contact'
    )
    await expect(page.locator('fieldset[id="field.0.items"]')).toBeVisible()

    // BUG: the nested list resolves its row count by the dotted path
    // `field.0.items` through `extract`, which cannot descend into the `field`
    // array, so it renders zero rows even though `value` has two items.
    await expect(page.locator('input[name^="field.0.items."]')).toHaveCount(2)

    // Each hydrated row keeps its `key` value.
    await expect(page.locator('input[name="field.0.items.0.key"]')).toHaveValue(
      'name'
    )
    await expect(page.locator('input[name="field.0.items.1.key"]')).toHaveValue(
      'phone'
    )
  })
})
