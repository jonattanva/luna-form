import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Reverse checkbox/switch layout', { tag: ['@e2e'] }, () => {
  test('should show checkbox with default reverse (input left, label right)', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
            {
                "fields": [
                    {
                        "label": "Accept terms",
                        "name": "terms",
                        "type": "checkbox"
                    }
                ]
            }
        ]}`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]')
    await expect(field).toHaveCount(1)
    await expect(field).toHaveClass(/flex-row-reverse/)
  })

  test('should show checkbox with reverse false (label left, input right)', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
            {
                "fields": [
                    {
                        "advanced": {
                            "reverse": false
                        },
                        "label": "Accept terms",
                        "name": "terms",
                        "type": "checkbox"
                    }
                ]
            }
        ]}`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]')
    await expect(field).toHaveCount(1)

    const classes = await field.getAttribute('class')
    expect(classes).not.toContain('flex-row-reverse')
    expect(classes).toContain('flex-row')
  })

  test('should show switch with reverse false (label left, switch right)', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
            {
                "fields": [
                    {
                        "advanced": {
                            "reverse": false
                        },
                        "label": "Dark mode",
                        "name": "darkMode",
                        "type": "checkbox/switch"
                    }
                ]
            }
        ]}`
    )

    await page.goto('')

    const field = page.locator('[data-slot="field"]')
    await expect(field).toHaveCount(1)

    const classes = await field.getAttribute('class')
    expect(classes).not.toContain('flex-row-reverse')
    expect(classes).toContain('flex-row')
  })
})
