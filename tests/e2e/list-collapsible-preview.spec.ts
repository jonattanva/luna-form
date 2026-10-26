import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const HEADER_FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Multi List",
          "name": "multi",
          "type": "list",
          "advanced": {
            "preview": { "label": "key", "tags": ["value"] }
          },
          "fields": [
            { "name": "key", "label": "Key", "type": "input/text" },
            { "name": "value", "label": "Value", "type": "input/text" }
          ]
        },
        {
          "label": "Single List",
          "name": "single",
          "type": "list",
          "advanced": {
            "collapsed": true,
            "preview": { "label": "item" }
          },
          "fields": [
            { "name": "item", "label": "Item", "type": "input/text" }
          ]
        }
      ]
    }
  ],
  "value": {
    "multi": [{ "key": "K1", "value": "V1" }],
    "single": [{ "item": "S1" }]
  }
}`

test.describe('List Collapsible - Preview', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ page }) => {
    await inject(page, HEADER_FIXTURE)
    await page.goto('')
  })

  test('single-field collapsed: preview reflects initial value on first render', async ({
    page,
  }) => {
    // Inputs in a collapsed item live inside <Activity mode="hidden">; their
    // effects don't run yet, so the preview must fall back to the initial
    // value tree resolved by the parent FieldList.
    await expect(page.locator('input[name="single.0.item"]')).toBeHidden()
    await expect(page.locator('button').filter({ hasText: 'S1' })).toBeVisible()
  })

  test('multi-field tags preview shows label and tags correctly', async ({
    page,
  }) => {
    // Collapse the multi item so the preview renders inline in the header
    await page
      .getByRole('button', { name: 'Collapse K1 (Multi List 1)' })
      .click()

    const card = page.locator('[data-slot="list-item-card"]')
    await expect(card.getByText('K1')).toBeVisible()
    await expect(card.getByText('V1')).toBeVisible()
  })

  test('preview reflects edits made after expanding the item', async ({
    page,
  }) => {
    await page
      .getByRole('button', { name: 'Expand S1 (Single List 1)' })
      .click()

    await page.locator('input[name="single.0.item"]').fill('Edited')

    await page
      .getByRole('button', { name: 'Collapse Edited (Single List 1)' })
      .click()
    await expect(page.getByText('Edited')).toBeVisible()
  })

  test('single-field: label is visible while collapsed and after expanding', async ({
    page,
  }) => {
    // Initially collapsed
    await expect(page.locator('input[name="single.0.item"]')).toBeHidden()
    await expect(page.locator('button').filter({ hasText: 'S1' })).toBeVisible()

    // Expand and the header label remains
    await page
      .getByRole('button', { name: 'Expand S1 (Single List 1)' })
      .click()
    await expect(page.locator('input[name="single.0.item"]')).toBeVisible()
    await expect(page.locator('button').filter({ hasText: 'S1' })).toBeVisible()
  })
})

// A row holds a date as `yyyy-MM-dd`; its preview shows the day the way the
// field does, in the label and in the tags alike.
test.describe('List Collapsible - Date preview', { tag: ['@e2e'] }, () => {
  test('a date in the preview is shown in its field format', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [{
          "fields": [{
            "label": "Stays",
            "name": "stays",
            "type": "list",
            "advanced": {
              "collapsed": true,
              "preview": { "label": "check_in", "tags": ["check_out"] }
            },
            "fields": [
              {
                "name": "check_in",
                "label": "Check-in",
                "type": "input/date",
                "advanced": { "format": "dd/MM/yyyy" }
              },
              { "name": "check_out", "label": "Check-out", "type": "input/date" }
            ]
          }]
        }],
        "value": { "stays": [{ "check_in": "2026-10-05", "check_out": "2026-10-09" }] }
      }`
    )
    await page.goto('')

    const card = page.locator('[data-slot="list-item-card"]')
    await expect(card.getByText('05/10/2026')).toBeVisible()
    await expect(card.getByText('October 9, 2026')).toBeVisible()
  })
})

test.describe('List Collapsible - Controlled host', { tag: ['@e2e'] }, () => {
  test('on a controlled host, a nested row previews what is typed in it alone', async ({
    page,
  }) => {
    // The host hands its value back on every keystroke, and a row no longer
    // renders for it: the row typed in follows through its own subscriptions,
    // and the rows beside it keep showing what they hold.
    await inject(
      page,
      `{
        "sections": [{
          "fields": [{
            "name": "section",
            "label": "Section",
            "type": "list",
            "fields": [
              { "name": "title", "label": "Title", "type": "input/text" },
              {
                "name": "field",
                "label": "Question",
                "type": "list",
                "advanced": {
                  "collapsed": true,
                  "preview": { "label": "label", "tags": ["name"], "badge": "type" }
                },
                "fields": [
                  { "name": "label", "label": "Label", "type": "input/text" },
                  { "name": "name", "label": "Name", "type": "input/text" },
                  { "name": "type", "label": "Type", "type": "input/text" }
                ]
              }
            ]
          }]
        }],
        "value": {
          "section": [{
            "title": "S",
            "field": [
              { "label": "First", "name": "first", "type": "text" },
              { "label": "Second", "name": "second", "type": "email" }
            ]
          }]
        }
      }`
    )
    await page.goto('/reactive')

    const rows = page.locator(
      '[data-slot="list-item-card"] [data-slot="list-item-card"]'
    )
    await expect(rows).toHaveCount(2)

    await rows.nth(0).locator('button[aria-expanded="false"]').click()
    await page.locator('input[name="section.0.field.0.label"]').fill('Renamed')
    await page.locator('input[name="section.0.field.0.name"]').fill('renamed')
    await page.locator('input[name="section.0.field.0.type"]').fill('number')

    // The label follows while the row is open, the tags and the badge once it
    // is collapsed again.
    await expect(
      rows.nth(0).getByText('Renamed', { exact: true })
    ).toBeVisible()
    await rows.nth(0).locator('button[aria-expanded="true"]').click()
    await expect(
      rows.nth(0).getByText('renamed', { exact: true })
    ).toBeVisible()
    await expect(rows.nth(0).getByText('number', { exact: true })).toBeVisible()

    await expect(rows.nth(1).getByText('Second', { exact: true })).toBeVisible()
    await expect(rows.nth(1).getByText('second', { exact: true })).toBeVisible()
    await expect(rows.nth(1).getByText('email', { exact: true })).toBeVisible()

    // A row added after the host has handed its value back starts empty and
    // previews what is typed into it.
    await page.getByRole('button', { name: 'Add item' }).first().click()
    await expect(rows).toHaveCount(3)
    await rows.nth(2).locator('button[aria-expanded="false"]').click()
    await page.locator('input[name="section.0.field.2.label"]').fill('Third')
    await rows.nth(2).locator('button[aria-expanded="true"]').click()
    await expect(rows.nth(2).getByText('Third', { exact: true })).toBeVisible()

    // Removing the first row leaves the others previewing their own values.
    await page.getByRole('button', { name: 'Remove Question item 1' }).click()
    await expect(rows).toHaveCount(2)
    await expect(rows.nth(0).getByText('Second', { exact: true })).toBeVisible()
    await expect(rows.nth(0).getByText('email', { exact: true })).toBeVisible()
    await expect(rows.nth(1).getByText('Third', { exact: true })).toBeVisible()
  })
})
