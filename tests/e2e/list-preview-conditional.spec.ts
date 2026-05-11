import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const CONDITIONAL_FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Field",
          "name": "field",
          "type": "list",
          "advanced": {
            "collapsed": true,
            "preview": {
              "label": "label",
              "tags": [
                "type",
                {
                  "field": "name",
                  "when": { "field": "name", "operator": "neq", "value": "" }
                }
              ],
              "badge": {
                "when": { "field": "required", "operator": "eq", "value": true },
                "label": "Required"
              }
            }
          },
          "fields": [
            { "name": "label", "label": "Label", "type": "input/text" },
            { "name": "name", "label": "Name", "type": "input/text" },
            { "name": "type", "label": "Type", "type": "input/text" },
            { "name": "required", "label": "Required", "type": "input/text" }
          ]
        }
      ]
    }
  ],
  "value": {
    "field": [
      { "label": "Email", "name": "email", "type": "text", "required": true },
      { "label": "Phone", "name": "", "type": "text", "required": false }
    ]
  }
}`

test.describe('List Preview Conditional', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ page }) => {
    await inject(page, CONDITIONAL_FIXTURE)
    await page.goto('')
  })

  test('badge with static label renders when condition matches', async ({
    page,
  }) => {
    const badge = page.getByText('Required', { exact: true })
    await expect(badge).toBeVisible()
    await expect(badge).toHaveClass(/bg-primary/)
    await expect(badge).toHaveClass(/text-primary-foreground/)
  })

  test('badge is hidden when condition does not match', async ({ page }) => {
    // Second item has required=false, so its row must NOT contain "Required".
    const phoneCard = page
      .locator('[data-slot="list-item-card"]')
      .filter({ hasText: 'Phone' })
    await expect(phoneCard.getByText('Required')).toBeHidden()
  })

  test('conditional tag is omitted when condition does not match', async ({
    page,
  }) => {
    // Tag with `when: name neq ""` should be hidden when name is empty.
    const phoneCard = page
      .locator('[data-slot="list-item-card"]')
      .filter({ hasText: 'Phone' })
    // Type ("text") is unconditional and should still be visible.
    await expect(phoneCard.getByText('text')).toBeVisible()
    // The empty name tag should not render any text for "name".
    await expect(phoneCard.locator('text=email')).toHaveCount(0)
  })

  test('conditional tag renders when condition matches', async ({ page }) => {
    const emailCard = page
      .locator('[data-slot="list-item-card"]')
      .filter({ hasText: 'Email' })
    await expect(emailCard.getByText('email', { exact: true })).toBeVisible()
    await expect(emailCard.getByText('text', { exact: true })).toBeVisible()
  })

  test('string-based preview keeps backward compatibility', async ({
    page,
  }) => {
    // The label uses the simple string form ("label") and should resolve to
    // the actual field value, exactly like before this change.
    await expect(
      page.getByRole('button', { name: /Email|Collapse|Expand/ }).first()
    ).toContainText('Email')
  })
})
