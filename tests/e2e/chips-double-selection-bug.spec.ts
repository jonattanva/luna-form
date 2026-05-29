import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

/**
 * Regression tests for the bug where chips fields silently drop the first
 * user interaction after the form has been mounted with a non-empty `value`
 * prop (or after the `value` prop is re-applied on a reactive update).
 *
 * Root cause: `skipNextOnChangeRef` in `useValue` is armed any time the
 * `value` prop hydration writes a value that differs from the atom's current
 * value. The `chips` and `select` strategies (`InputSelectable`) then read
 * and consume that flag on the first `onChange`, returning early without
 * calling `onValueChange`, updating the atom, or dispatching change events.
 *
 * This mirrors the analogous suite for the select field in
 * `select-double-selection-bug.spec.ts`.
 */
test.describe(
  'Chips field - dropped first interaction with initial values',
  { tag: ['@e2e'] },
  () => {
    test('should select a chip on first click when form has initial values', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": {
          "kind": ["text"]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Kind",
                "name": "kind",
                "type": "chips",
                "advanced": { "multiple": false },
                "source": [
                  { "label": "Text", "value": "text" },
                  { "label": "Email", "value": "email" },
                  { "label": "Number", "value": "number" }
                ]
              }
            ]
          }
        ]
      }`
      )

      await page.goto('')

      const chips = page.locator('button[type="button"]')
      const text = chips.nth(0)
      const email = chips.nth(1)

      await expect(text).toHaveClass(/bg-violet-600/)
      await expect(email).not.toHaveClass(/bg-violet-600/)

      // With the bug, the first click is silently dropped, leaving "Text"
      // highlighted. A single interaction must register the change.
      await email.click()

      await expect(email).toHaveClass(/bg-violet-600/)
      await expect(text).not.toHaveClass(/bg-violet-600/)
    })

    test('should submit the new chips value after a single change when form has initial values', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": {
          "kind": ["text"]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Kind",
                "name": "kind",
                "type": "chips",
                "advanced": { "multiple": false },
                "source": [
                  { "label": "Text", "value": "text" },
                  { "label": "Email", "value": "email" },
                  { "label": "Number", "value": "number" }
                ]
              }
            ]
          }
        ]
      }`
      )

      await page.goto('')

      const chips = page.locator('button[type="button"]')
      await chips.nth(1).click()

      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()

      // With the bug, the submitted data still contains "text" because the
      // first onChange was skipped and the store was never updated.
      await expect(page.locator('pre code')).toContainText('"email"')
    })

    /**
     * Reactive onValueChange scenario.
     *
     * When the parent feeds onValueChange back into the `value` prop, useValue
     * re-runs for every field and re-arms `skipNextOnChangeRef` whenever the
     * incoming value differs from the atom. Even a change to a different field
     * is enough to silence the next chips click.
     */
    test('reactive form: chips must register on first click after another field changes via onValueChange', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": {
          "kind": ["text"],
          "label": "My Field"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Kind",
                "name": "kind",
                "type": "chips",
                "advanced": { "multiple": false },
                "source": [
                  { "label": "Text", "value": "text" },
                  { "label": "Email", "value": "email" },
                  { "label": "Number", "value": "number" }
                ]
              },
              {
                "label": "Label",
                "name": "label",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
      )

      await page.goto('/reactive')

      const chips = page.locator('button[type="button"]').filter({
        hasText: /^(Text|Email|Number)$/,
      })
      await expect(chips.nth(0)).toHaveClass(/bg-violet-600/)

      // Step 1: change the text field. This triggers onValueChange → parent
      // updates value prop → useValue re-runs for the chips field → arms the
      // skip flag again.
      const labelInput = page.locator('input[name="label"]')
      await labelInput.clear()
      await labelInput.fill('Updated Label')
      await labelInput.blur()

      // Step 2: change the chips with a SINGLE click.
      await chips.nth(1).click()

      await expect(chips.nth(1)).toHaveClass(/bg-violet-600/)
      await expect(chips.nth(0)).not.toHaveClass(/bg-violet-600/)

      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()

      await expect(page.locator('pre code')).toContainText('"email"')
      await expect(page.locator('pre code')).toContainText(
        '"label": "Updated Label"'
      )
    })
  }
)
