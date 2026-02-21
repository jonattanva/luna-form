import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const LIST_WITH_COLUMN = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Contacts",
          "name": "contacts",
          "type": "list",
          "advanced": {
            "action": "Add contact"
          },
          "fields": [
            {
              "type": "column",
              "fields": [
                {
                  "name": "first",
                  "label": "First name",
                  "type": "input/text"
                },
                {
                  "name": "last",
                  "label": "Last name",
                  "type": "input/text"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`

const LIST_WITH_COLUMN_COLS = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Contacts",
          "name": "contacts",
          "type": "list",
          "advanced": {
            "action": "Add contact"
          },
          "fields": [
            {
              "type": "column",
              "advanced": {
                "cols": 3
              },
              "fields": [
                {
                  "name": "first",
                  "label": "First name",
                  "type": "input/text",
                  "advanced": { "cols": 2 }
                },
                {
                  "name": "last",
                  "label": "Last name",
                  "type": "input/text",
                  "advanced": { "cols": 1 }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`

test.describe('List field - column layout', { tag: ['@e2e'] }, () => {
  test('should render column fields with indexed names in the first row', async ({
    page,
  }) => {
    await inject(page, LIST_WITH_COLUMN)
    await page.goto('')

    await expect(page.locator('input[name="contacts.0.first"]')).toHaveCount(1)
    await expect(page.locator('input[name="contacts.0.last"]')).toHaveCount(1)
  })

  test('should render column fields with correct indexed names after adding a row', async ({
    page,
  }) => {
    await inject(page, LIST_WITH_COLUMN)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add contact/ })
    await addButton.click()

    await expect(page.locator('input[name="contacts.0.first"]')).toHaveCount(1)
    await expect(page.locator('input[name="contacts.0.last"]')).toHaveCount(1)
    await expect(page.locator('input[name="contacts.1.first"]')).toHaveCount(1)
    await expect(page.locator('input[name="contacts.1.last"]')).toHaveCount(1)
  })

  test('should preserve column grid layout inside a list item', async ({
    page,
  }) => {
    await inject(page, LIST_WITH_COLUMN)
    await page.goto('')

    const fields = page.locator('[data-slot="field"]')
    await expect(fields).toHaveCount(2)

    const grid = fields.first().locator('..').locator('..')
    await expect(grid).toHaveClass(/md:grid-cols-2/)
  })

  test('should apply advanced cols to column grid inside a list item', async ({
    page,
  }) => {
    await inject(page, LIST_WITH_COLUMN_COLS)
    await page.goto('')

    const fields = page.locator('[data-slot="field"]')
    const grid = fields.first().locator('..').locator('..')
    await expect(grid).toHaveClass(/md:grid-cols-3/)
  })

  test('should apply field col-span inside a column within a list item', async ({
    page,
  }) => {
    await inject(page, LIST_WITH_COLUMN_COLS)
    await page.goto('')

    const firstField = page
      .locator('[data-slot="field"]:has-text("First name")')
      .locator('..')
    await expect(firstField).toHaveClass(/col-span-2/)

    const lastField = page
      .locator('[data-slot="field"]:has-text("Last name")')
      .locator('..')
    await expect(lastField).toHaveClass(/col-span-1/)
  })

  test('should update indexed names after removing the first row', async ({
    page,
  }) => {
    await inject(page, LIST_WITH_COLUMN)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add contact/ })
    await addButton.click()

    await page.locator('input[name="contacts.0.first"]').fill('Alice')
    await page.locator('input[name="contacts.1.first"]').fill('Bob')

    await page.getByRole('button', { name: 'Remove Contacts item 1' }).click()

    // Bob keeps his stable id (contacts.1.first) after Alice is removed
    await expect(page.locator('input[name="contacts.1.first"]')).toHaveValue(
      'Bob'
    )
    await expect(page.locator('input[name="contacts.0.first"]')).toHaveCount(0)
  })
})
