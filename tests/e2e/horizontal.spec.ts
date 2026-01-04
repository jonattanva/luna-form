import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Horizontal orientation', { tag: ['@e2e'] }, () => {
  test('should apply horizontal orientation to input field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Horizontal Input",
                "name": "horizontalInput",
                "type": "input/text",
                "advanced": {
                  "orientation": "horizontal"
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')

    // Check for horizontal layout classes (flex-row on md screens)
    await expect(field).toHaveClass(/md:flex-row/)
  })

  test('should default to horizontal orientation for radio fields', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Radio Field",
                "name": "radioField",
                "type": "radio",
                "options": [
                  { "label": "Option 1", "value": "1" },
                  { "label": "Option 2", "value": "2" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')
  })

  test('should default to horizontal orientation for checkbox fields', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Checkbox Field",
                "name": "checkboxField",
                "type": "checkbox"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')
  })

  test('should apply horizontal orientation to textarea field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Horizontal Textarea",
                "name": "horizontalTextarea",
                "type": "textarea",
                "advanced": {
                  "orientation": "horizontal"
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')
    await expect(field).toHaveClass(/md:flex-row/)
  })

  test('should show error message on blur for required horizontal field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Required Horizontal",
                "name": "requiredHorizontal",
                "type": "input/text",
                "required": true,
                "advanced": {
                  "orientation": "horizontal"
                },
                "validation": {
                  "required": "Field is required"
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const input = page.getByLabel('Required Horizontal')

    // Focus and blur without typing
    await input.focus()
    await input.blur()

    const errorMessage = page.getByText('Field is required', { exact: true })
    await expect(errorMessage).toBeVisible()

    // Check that the field container has the invalid state attribute
    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-invalid', 'true')
  })
})
