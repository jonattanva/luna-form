import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

/**
 * Regression tests for the bug where select fields require two selections
 * to register a value change when the form has initial values via the
 * `values` prop.
 *
 * Root cause: `skipNextOnChangeRef` in `useValue` is set to true when
 * an initial value is applied, which causes `onChange` to return early
 * on the first user interaction with the select field. The second selection
 * then works because the ref has already been reset.
 *
 * There are two distinct triggers for this bug:
 * 1. Initial page load with a `value` prop.
 * 2. Reactive updates: any call to `onValueChange` that causes the parent
 *    to update the `value` prop re-runs `useValue` for ALL fields, resetting
 *    `skipNextOnChangeRef` to true and silently dropping the next select
 *    interaction.
 */
test.describe(
  'Select field - double selection bug with initial values',
  {
    tag: ['@e2e'],
  },
  () => {
    const getSelect = (page: Page, label: string) => {
      return page
        .locator('[data-slot="field"]')
        .filter({ hasText: label })
        .getByRole('combobox')
        .first()
    }

    test('should update select value after a single selection when form has initial values', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": {
          "country": "us"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Country",
                "name": "country",
                "type": "select",
                "source": [
                  { "label": "United States", "value": "us" },
                  { "label": "Canada", "value": "ca" },
                  { "label": "Mexico", "value": "mx" }
                ]
              }
            ]
          }
        ]
      }`
      )

      await page.goto('')

      const select = getSelect(page, 'Country')
      await expect(select).toContainText('United States')

      await select.click()
      await page.getByRole('option', { name: 'Canada' }).click()

      // After a single selection the value must be updated.
      // With the bug, the combobox still shows "United States" because onChange
      // returns early the first time and the Jotai atom is never updated.
      await expect(select).toContainText('Canada')
    })

    test('should submit the new select value after a single change when form has initial values', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": {
          "country": "us"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Country",
                "name": "country",
                "type": "select",
                "source": [
                  { "label": "United States", "value": "us" },
                  { "label": "Canada", "value": "ca" },
                  { "label": "Mexico", "value": "mx" }
                ]
              }
            ]
          }
        ]
      }`
      )

      await page.goto('')

      const select = getSelect(page, 'Country')
      await expect(select).toContainText('United States')

      await select.click()
      await page.getByRole('option', { name: 'Canada' }).click()

      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()

      // With the bug, the submitted data contains "us" instead of "ca"
      // because the first onChange was skipped and the store was never updated.
      await expect(page.locator('pre code')).toContainText('"country": "ca"')
    })

    test('should fire change events after a single selection when form has initial values', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": {
          "document_type": "passport"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Document Type",
                "name": "document_type",
                "type": "select",
                "source": [
                  { "label": "Passport", "value": "passport" },
                  { "label": "DNI", "value": "dni" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "passport_number",
                      "state": { "hidden": false },
                      "when": "passport"
                    }
                  ]
                }
              },
              {
                "label": "Passport Number",
                "name": "passport_number",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
      )

      await page.goto('')

      const passportNumber = page.locator('input[name="passport_number"]')

      // Initial value is "passport" so the field should be visible on load.
      await expect(passportNumber).toBeVisible()

      // Change to "dni" with a single selection. The state event must fire
      // immediately to hide passport_number.
      // With the bug, the first onChange is skipped so the event never fires
      // and passport_number remains visible.
      const select = getSelect(page, 'Document Type')
      await select.click()
      await page.getByRole('option', { name: 'DNI' }).click()

      await page.mouse.click(10, 10)
      await expect(page.getByRole('listbox')).toBeHidden()

      await expect(passportNumber).toBeHidden()
    })

    test('should update select/month value after a single selection when form has initial values', async ({
      page,
    }) => {
      // select/month generates values as "1".."12" (no leading zero)
      await inject(
        page,
        `{
        "value": {
          "birth_month": "1"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Birth Month",
                "name": "birth_month",
                "type": "select/month"
              }
            ]
          }
        ]
      }`
      )

      await page.goto('')

      const select = getSelect(page, 'Birth Month')
      await expect(select).toContainText('January')

      await select.click()
      await page.getByRole('option', { name: 'June' }).click()

      // Must update on first click, not require a second.
      await expect(select).toContainText('June')

      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      await expect(page.locator('pre code')).toContainText('"birth_month": "6"')
    })

    /**
     * Form builder scenario: the library is used to build a configuration form
     * where a "field type" selector drives the visibility of other configuration
     * options. Initial values are loaded when editing an existing field
     * definition. The bug caused the first type change to be silently ignored,
     * leaving the builder in an inconsistent state.
     */
    test('form builder: changing field type on first interaction should update the configuration form', async ({
      page,
    }) => {
      // Simulate editing an existing field configuration that was saved as
      // type "input/text". The user wants to change it to "select".
      //
      // Each extra field uses a single state event: when the condition matches
      // the field becomes visible; when it does not match the state is cleared
      // and the field falls back to its default hidden: true.
      await inject(
        page,
        `{
        "value": {
          "field_type": "input/text",
          "field_label": "My Field",
          "field_required": true
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Field Type",
                "name": "field_type",
                "type": "select",
                "source": [
                  { "label": "Text input", "value": "input/text" },
                  { "label": "Select", "value": "select" },
                  { "label": "Textarea", "value": "textarea" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "field_options",
                      "state": { "hidden": false },
                      "when": "select"
                    },
                    {
                      "action": "state",
                      "target": "field_rows",
                      "state": { "hidden": false },
                      "when": "textarea"
                    }
                  ]
                }
              },
              {
                "label": "Label",
                "name": "field_label",
                "type": "input/text"
              },
              {
                "label": "Options (comma separated)",
                "name": "field_options",
                "type": "input/text",
                "hidden": true
              },
              {
                "label": "Rows",
                "name": "field_rows",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
      )

      await page.goto('')

      const fieldOptions = page.locator('input[name="field_options"]')
      const fieldRows = page.locator('input[name="field_rows"]')

      // With initial type "input/text", both extra fields must be hidden.
      await expect(fieldOptions).toBeHidden()
      await expect(fieldRows).toBeHidden()

      // Change type to "select" with a single interaction.
      // With the bug, the first onChange is skipped so the state events never
      // fire and field_options remains hidden.
      const typeSelect = getSelect(page, 'Field Type')
      await typeSelect.click()
      await page.getByRole('option', { name: 'Select' }).click()

      await page.mouse.click(10, 10)
      await expect(page.getByRole('listbox')).toBeHidden()

      await expect(fieldOptions).toBeVisible()
      await expect(fieldRows).toBeHidden()

      // Change to "textarea" to verify events continue working after the
      // initial value has been consumed.
      await typeSelect.click()
      await page.getByRole('option', { name: 'Textarea' }).click()

      await page.mouse.click(10, 10)
      await expect(page.getByRole('listbox')).toBeHidden()

      await expect(fieldOptions).toBeHidden()
      await expect(fieldRows).toBeVisible()
    })

    test('form builder: submitted data reflects the type changed on first interaction', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": {
          "field_type": "input/text",
          "field_label": "Username"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Field Type",
                "name": "field_type",
                "type": "select",
                "source": [
                  { "label": "Text input", "value": "input/text" },
                  { "label": "Select", "value": "select" },
                  { "label": "Textarea", "value": "textarea" }
                ]
              },
              {
                "label": "Label",
                "name": "field_label",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
      )

      await page.goto('')

      const typeSelect = getSelect(page, 'Field Type')
      await expect(typeSelect).toContainText('Text input')

      // Single selection — must register on first click.
      await typeSelect.click()
      await page.getByRole('option', { name: 'Textarea' }).click()

      await expect(typeSelect).toContainText('Textarea')

      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()

      // With the bug the store was never updated so "input/text" was submitted
      // instead of "textarea".
      await expect(page.locator('pre code')).toContainText(
        '"field_type": "textarea"'
      )
      await expect(page.locator('pre code')).toContainText(
        '"field_label": "Username"'
      )
    })

    /**
     * Reactive onValueChange scenario (the actual form builder use case).
     *
     * Every time onValueChange fires and the parent updates the `value` prop,
     * useValue re-runs for ALL fields and sets skipNextOnChangeRef = true again.
     * If the select's atom value does not change (same string, Jotai skips the
     * re-render), Radix does not emit a synthetic onChange to consume the flag,
     * so the next real user click on the select is silently dropped.
     *
     * This test uses the /reactive page which wires onValueChange → value prop.
     */
    test('reactive form builder: select must register on first click after another field changes via onValueChange', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "value": {
          "field_type": "input/text",
          "field_label": "My Field"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Field Type",
                "name": "field_type",
                "type": "select",
                "source": [
                  { "label": "Text input", "value": "input/text" },
                  { "label": "Select", "value": "select" },
                  { "label": "Textarea", "value": "textarea" }
                ]
              },
              {
                "label": "Label",
                "name": "field_label",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
      )

      // /reactive feeds onValueChange back into the value prop, simulating a
      // real form builder that keeps form values in state.
      await page.goto('/reactive')

      const typeSelect = getSelect(page, 'Field Type')
      await expect(typeSelect).toContainText('Text input')

      // Step 1: change the text field.
      // This triggers onValueChange → parent updates value prop →
      // useValue re-runs for field_type → skipNextOnChangeRef = true.
      const labelInput = page.locator('input[name="field_label"]')
      await labelInput.clear()
      await labelInput.fill('Updated Label')
      await labelInput.blur()

      // Step 2: change the select with a SINGLE interaction.
      // With the bug: skipNextOnChangeRef is still true (no synthetic onChange
      // consumed it because the field_type atom value did not change) →
      // onChange returns early → select still shows "Text input".
      await typeSelect.click()
      await page.getByRole('option', { name: 'Textarea' }).click()

      await expect(typeSelect).toContainText('Textarea')

      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()

      await expect(page.locator('pre code')).toContainText(
        '"field_type": "textarea"'
      )
      await expect(page.locator('pre code')).toContainText(
        '"field_label": "Updated Label"'
      )
    })
  }
)
