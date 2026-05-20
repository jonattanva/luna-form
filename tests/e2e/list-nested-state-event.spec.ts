import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const CHIP_TRIGGER = {
  name: 'mode',
  type: 'chips',
  advanced: {
    multiple: false,
    options: { label: 'name', value: 'id' },
  },
  source: [
    { id: 'simple', name: 'Simple' },
    { id: 'detailed', name: 'Detailed' },
  ],
}

function buildSchema(target: Record<string, unknown>): string {
  return JSON.stringify({
    sections: [
      {
        fields: [
          {
            name: 'rows',
            type: 'list',
            fields: [
              {
                ...CHIP_TRIGGER,
                event: {
                  change: [
                    {
                      action: 'state',
                      target: `rows/${target.name}`,
                      state: { hidden: false },
                      when: ['detailed'],
                    },
                  ],
                },
              },
              target,
            ],
          },
        ],
      },
    ],
  })
}

test.describe(
  'State events targeting fields inside a list',
  { tag: ['@e2e'] },
  () => {
    test('reveals an input field on chip click', async ({ page }) => {
      const schema = buildSchema({
        name: 'detail',
        type: 'input/text',
        label: 'Detail',
        hidden: true,
      })
      await inject(page, schema)
      await page.goto('')

      const detail = page.locator('input[name="rows.0.detail"]')
      await expect(detail).toHaveCount(0)

      await page
        .locator('button')
        .filter({ hasText: /^Detailed$/ })
        .click()

      await expect(detail).toBeVisible()
    })

    test('reveals an input field from initial value on mount', async ({
      page,
    }) => {
      const base = JSON.parse(
        buildSchema({
          name: 'detail',
          type: 'input/text',
          label: 'Detail',
          hidden: true,
        })
      )
      const schema = JSON.stringify({
        ...base,
        value: { rows: [{ mode: ['detailed'] }] },
      })
      await inject(page, schema)
      await page.goto('')

      await expect(page.locator('input[name="rows.0.detail"]')).toBeVisible()
    })

    test('reveals a nested list on chip click', async ({ page }) => {
      const schema = buildSchema({
        name: 'inner',
        type: 'list',
        hidden: true,
        advanced: { action: 'Add inner' },
        fields: [{ name: 'child', type: 'input/text', label: 'Child' }],
      })
      await inject(page, schema)
      await page.goto('')

      const innerList = page.locator('fieldset[id="rows.0.inner"]')
      await expect(innerList).toHaveCount(0)

      await page
        .locator('button')
        .filter({ hasText: /^Detailed$/ })
        .click()

      await expect(innerList).toBeVisible()
    })
  }
)
