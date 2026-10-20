import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A column whose fields are all hidden draws nothing, yet its box stayed in the
// layout: the form's gap on either side of it, plus the column's own, opened a
// hole between the fields around it.
const FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Kind",
          "name": "kind",
          "type": "select",
          "source": [
            { "label": "Visible", "value": "visible" },
            { "label": "Hidden", "value": "hidden" }
          ],
          "event": {
            "change": [
              {
                "action": "state",
                "target": "example",
                "state": { "hidden": true },
                "when": "hidden"
              },
              {
                "action": "state",
                "target": "help",
                "state": { "hidden": true },
                "when": "hidden"
              }
            ]
          }
        },
        {
          "type": "column",
          "advanced": { "cols": 2 },
          "fields": [
            { "label": "Example", "name": "example", "type": "input/text" },
            { "label": "Help", "name": "help", "type": "input/text" }
          ]
        },
        { "label": "Key", "name": "key", "type": "input/text" }
      ]
    }
  ]
}`

/** The space between the bottom of one field and the top of the next. */
async function spaceBetween(page: Page, above: string, below: string) {
  const first = await page.getByLabel(above).boundingBox()
  const second = await page.getByLabel(below).boundingBox()
  if (!first || !second) {
    throw new Error('Both fields must be on screen')
  }
  return second.y - (first.y + first.height)
}

async function choose(page: Page, option: string) {
  await page.getByRole('combobox', { name: 'Kind' }).click()
  await page.getByRole('option', { name: option }).click()
}

test.describe('Column with every field hidden', { tag: ['@e2e'] }, () => {
  test('takes no room and comes back when a field shows again', async ({
    page,
  }) => {
    await inject(page, FIXTURE)
    await page.goto('')

    const column = page.locator('[data-slot="column"]')
    await expect(column).toBeVisible()
    const withColumn = await spaceBetween(page, 'Example', 'Key')

    await choose(page, 'Hidden')
    await expect(page.getByLabel('Example')).toHaveCount(0)
    await expect(column).toBeHidden()

    // One gap between the fields left, the same one the column kept from the
    // field below it.
    expect(await spaceBetween(page, 'Kind', 'Key')).toBeCloseTo(withColumn, 0)

    await choose(page, 'Visible')
    await expect(column).toBeVisible()
    await expect(page.getByLabel('Example')).toBeVisible()
  })
})
