import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const SIMPLE_LIST = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Items",
          "name": "items",
          "type": "list",
          "fields": [
            { "name": "item", "label": "Item", "type": "input/text" }
          ]
        }
      ]
    }
  ]
}`

const LIST_WITH_MAX = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Items",
          "name": "items",
          "type": "list",
          "advanced": {
            "length": { "max": 3 }
          },
          "fields": [
            { "name": "item", "label": "Item", "type": "input/text" }
          ]
        }
      ]
    }
  ]
}`

const LIST_AT_MAX = `{
  "value": { "items": [{ "item": "x" }] },
  "sections": [
    {
      "fields": [
        {
          "label": "Items",
          "name": "items",
          "type": "list",
          "advanced": {
            "length": { "min": 1, "max": 1 }
          },
          "fields": [
            { "name": "item", "label": "Item", "type": "input/text" }
          ]
        }
      ]
    }
  ]
}`

// Rows created somewhere else and only corrected here: no add button and no
// remove control, while each row stays editable.
const FIXED_LIST = `{
  "value": { "items": [{ "item": "first" }, { "item": "second" }] },
  "sections": [
    {
      "fields": [
        {
          "label": "Items",
          "name": "items",
          "type": "list",
          "advanced": { "fixed": true, "length": { "min": 0 } },
          "fields": [
            { "name": "item", "label": "Item", "type": "input/text" }
          ]
        }
      ]
    }
  ]
}`

test.describe('List Add Button', { tag: ['@e2e'] }, () => {
  test('renders with 36px height, dashed border, and rounded-md corners', async ({
    page,
  }) => {
    await inject(page, SIMPLE_LIST)
    await page.goto('')

    const button = page.getByRole('button', { name: 'Add item' })
    await expect(button).toHaveCSS('height', '36px')
    await expect(button).toHaveCSS('border-style', 'dashed')
    // Tailwind v4 `rounded-md` resolves to 8px.
    await expect(button).toHaveCSS('border-radius', '8px')
  })

  test('centers content horizontally when no length limit is set', async ({
    page,
  }) => {
    await inject(page, SIMPLE_LIST)
    await page.goto('')

    const button = page.getByRole('button', { name: 'Add item' })
    await expect(button).toHaveCSS('justify-content', 'center')
  })

  test('uses space-between layout and shows a counter when max length is set', async ({
    page,
  }) => {
    await inject(page, LIST_WITH_MAX)
    await page.goto('')

    const button = page.getByRole('button', { name: /Add item, 1 of 3/ })
    await expect(button).toHaveCSS('justify-content', 'space-between')
    await expect(button.getByText('1 / 3')).toBeVisible()
  })

  test('disables interaction and reverts hover when at max capacity', async ({
    page,
  }) => {
    await inject(page, LIST_AT_MAX)
    await page.goto('')

    const button = page.getByRole('button', { name: /Add item, 1 of 1/ })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-disabled', 'true')

    // The !canAdd hover overrides cancel the regular hover transitions, so
    // border and text colors must stay constant when hovered while disabled.
    const before = await button.evaluate((el) => ({
      border: getComputedStyle(el).borderColor,
      color: getComputedStyle(el).color,
    }))
    await button.dispatchEvent('mouseenter')
    const after = await button.evaluate((el) => ({
      border: getComputedStyle(el).borderColor,
      color: getComputedStyle(el).color,
    }))

    expect(after.border).toBe(before.border)
    expect(after.color).toBe(before.color)
  })

  test('a fixed list offers no add button and no remove control, and its rows stay editable', async ({
    page,
  }) => {
    await inject(page, FIXED_LIST)
    await page.goto('')

    const form = page.locator('form')
    await expect(form.locator('input[name^="items."]')).toHaveCount(2)
    await expect(form.getByRole('button', { name: /Add item/ })).toHaveCount(0)
    await expect(form.getByRole('button', { name: /^Remove/ })).toHaveCount(0)

    const second = form.locator('input[name="items.1.item"]')
    await second.fill('changed')
    await expect(second).toHaveValue('changed')
  })
})
