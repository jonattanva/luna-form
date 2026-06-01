import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe(
  'Grid Alignment (Truncation & Flexible Height)',
  { tag: ['@e2e'] },
  () => {
    test('should ensure labels are truncated to 1 line and inputs align upwards', async ({
      page,
    }) => {
      // Set viewport to md breakpoint to trigger the CSS rules
      await page.setViewportSize({ width: 1024, height: 768 })

      await inject(
        page,
        `{
        "sections": [
            {
                "fields": [
                    {
                        "type": "column",
                        "advanced": { "cols": 2 },
                        "fields": [
                            {
                                "label": "This is a very long label that should definitely be truncated to a single line in desktop grid layout",
                                "name": "longLabel",
                                "type": "input/text"
                            },
                            {
                                "label": "Short",
                                "name": "shortLabel",
                                "type": "input/text",
                                "style": { "showOptionalLabel": false }
                            }
                        ]
                    }
                ]
            }
        ]}`
      )

      await page.goto('')

      const labels = page.locator('[data-slot="field-label"]')
      const longLabelText = labels.first().locator('span').first()
      const shortLabel = labels.last()

      // 1. Verify truncation via CSS property (text-overflow: ellipsis)
      // Note: Playwright doesn't easily test "is it visually truncated", but we check the class and height
      await expect(longLabelText).toHaveClass(/truncate/)

      // 2. Verify that the label height is NOT 2 lines approx (2lh) anymore for short labels
      // A single line is usually ~20px, 2lh would be ~40px.
      const shortLabelBox = await shortLabel.boundingBox()
      expect(shortLabelBox?.height).toBeLessThan(30) // Should be roughly 1 line height

      // 3. Verify vertical alignment of inputs
      // Even if labels have different text lengths, they are now 1-line each (due to truncation)
      // So inputs should be vertically aligned.
      const inputs = page.locator('input')
      const input1Box = await inputs.first().boundingBox()
      const input2Box = await inputs.last().boundingBox()

      // They should start at the same Y position
      expect(Math.abs((input1Box?.y ?? 0) - (input2Box?.y ?? 0))).toBeLessThan(
        5
      )
    })

    test('should allow description to have up to 2 lines without reserving 2 lines flat', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1024, height: 768 })

      await inject(
        page,
        `{
        "sections": [
            {
                "fields": [
                    {
                        "type": "column",
                        "advanced": { "cols": 1 },
                        "fields": [
                            {
                                "label": "Field with short description",
                                "name": "field1",
                                "type": "input/text",
                                "description": "Short help"
                            }
                        ]
                    }
                ]
            }
        ]}`
      )

      await page.goto('')

      const description = page.locator('p') // Selector for Description component
      const descBox = await description.boundingBox()

      // If it's 1 line, it should be around 16-20px, NOT 40px (which would be 2 lines)
      expect(descBox?.height).toBeLessThan(25)
    })
  }
)
