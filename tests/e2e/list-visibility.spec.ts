import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

const getSelect = (page: Page, label: string) => {
  return page
    .locator('[data-slot="field"]')
    .filter({ hasText: label })
    .getByRole('combobox')
    .first()
}

test.describe('List visibility', { tag: ['@e2e'] }, () => {
  test('should not render list with static hidden:true on load', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [{
          "fields": [
            { "label": "Name", "name": "name", "type": "input/text" },
            {
              "label": "Items",
              "name": "items",
              "type": "list",
              "hidden": true,
              "fields": [{ "name": "value", "type": "input/text" }]
            }
          ]
        }]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('fieldset[id="items"]')
    await expect(fieldset).toHaveCount(0)
  })

  test('should show list when state event sets hidden:false', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [{
          "fields": [
            {
              "label": "Type",
              "name": "type",
              "type": "select",
              "source": [
                { "label": "Simple", "value": "simple" },
                { "label": "List", "value": "list" }
              ],
              "event": {
                "change": [{
                  "action": "state",
                  "target": "items",
                  "state": { "hidden": false },
                  "when": "list"
                }]
              }
            },
            {
              "label": "Items",
              "name": "items",
              "type": "list",
              "hidden": true,
              "fields": [{ "name": "value", "label": "Value", "type": "input/text" }]
            }
          ]
        }]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('fieldset[id="items"]')
    await expect(fieldset).toHaveCount(0)

    const typeSelect = getSelect(page, 'Type')
    await typeSelect.click()
    await page.getByRole('option', { name: 'List' }).click()

    await expect(fieldset).toBeVisible()

    await typeSelect.click()
    await page.getByRole('option', { name: 'Simple' }).click()

    await expect(fieldset).toHaveCount(0)
  })

  test('should render list when at least one internal field is visible', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [{
          "fields": [
            {
              "label": "Items",
              "name": "items",
              "type": "list",
              "fields": [
                { "name": "hidden_value", "type": "input/text", "hidden": true },
                { "name": "visible_value", "label": "Visible Value", "type": "input/text" }
              ]
            }
          ]
        }]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('fieldset[id="items"]')
    await expect(fieldset).toBeVisible()
  })
})
