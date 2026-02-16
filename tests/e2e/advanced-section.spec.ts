import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Advanced section (collapsible)', { tag: ['@e2e'] }, () => {
  test('should render collapsed by default showing only title and chevron', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Advanced Options",
            "advanced": true,
            "fields": [
              {
                "label": "Debug Mode",
                "name": "debug",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('[data-advanced="true"]')
    await expect(fieldset).toBeVisible()
    await expect(fieldset).toHaveAttribute('data-expanded', 'false')

    const legend = fieldset.locator('legend')
    await expect(legend).toBeVisible()
    await expect(legend).toHaveText('Advanced Options')

    const chevron = fieldset.locator('svg')
    await expect(chevron).toBeVisible()

    const field = page.getByLabel('Debug Mode')
    await expect(field).toBeHidden()
  })

  test('should expand on click showing fields and description', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Advanced Options",
            "description": "These are optional settings.",
            "advanced": true,
            "fields": [
              {
                "label": "Debug Mode",
                "name": "debug",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('[data-advanced="true"]')
    const legend = fieldset.locator('legend')

    await legend.click()

    await expect(fieldset).toHaveAttribute('data-expanded', 'true')

    const field = page.getByLabel('Debug Mode')
    await expect(field).toBeVisible()

    const description = page.getByText('These are optional settings.', {
      exact: true,
    })
    await expect(description).toBeVisible()
  })

  test('should collapse on second click hiding fields', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Advanced Options",
            "advanced": true,
            "fields": [
              {
                "label": "Debug Mode",
                "name": "debug",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('[data-advanced="true"]')
    const legend = fieldset.locator('legend')

    await legend.click()
    await expect(fieldset).toHaveAttribute('data-expanded', 'true')

    await legend.click()
    await expect(fieldset).toHaveAttribute('data-expanded', 'false')

    const field = page.getByLabel('Debug Mode')
    await expect(field).toBeHidden()
  })

  test('should render left border on expanded content', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Advanced Options",
            "advanced": true,
            "fields": [
              {
                "label": "Debug Mode",
                "name": "debug",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('[data-advanced="true"]')
    await fieldset.locator('legend').click()

    const content = fieldset.locator('[data-slot="field-set-content"]')
    await expect(content).toBeVisible()
    await expect(content).toHaveClass(/border-l-2/)
  })

  test('should rotate chevron when expanded', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Advanced Options",
            "advanced": true,
            "fields": [
              {
                "label": "Debug Mode",
                "name": "debug",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('[data-advanced="true"]')
    const chevron = fieldset.locator('svg')

    await expect(chevron).not.toHaveClass(/rotate-90/)

    await fieldset.locator('legend').click()

    await expect(chevron).toHaveClass(/rotate-90/)
  })

  test('should not show description when collapsed', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Advanced Options",
            "description": "Hidden until expanded.",
            "advanced": true,
            "fields": [
              {
                "label": "Debug Mode",
                "name": "debug",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const description = page.getByText('Hidden until expanded.', {
      exact: true,
    })
    await expect(description).toBeHidden()
  })

  test('should work alongside regular sections', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Basic Info",
            "fields": [
              {
                "label": "Name",
                "name": "name",
                "type": "input/text"
              }
            ]
          },
          {
            "title": "Advanced Options",
            "advanced": true,
            "fields": [
              {
                "label": "Debug Mode",
                "name": "debug",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const regularLegend = page.locator('fieldset:not([data-advanced]) legend')
    await expect(regularLegend).toBeVisible()
    await expect(regularLegend).toHaveText('Basic Info')

    const regularField = page.getByLabel('Name')
    await expect(regularField).toBeVisible()

    const advancedFieldset = page.locator('[data-advanced="true"]')
    await expect(advancedFieldset).toHaveAttribute('data-expanded', 'false')

    const advancedField = page.getByLabel('Debug Mode')
    await expect(advancedField).toBeHidden()

    await advancedFieldset.locator('legend').click()
    await expect(advancedField).toBeVisible()
  })

  test('should support multiple fields inside advanced section', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Advanced Options",
            "advanced": true,
            "fields": [
              {
                "label": "Option A",
                "name": "option_a",
                "type": "input/text"
              },
              {
                "label": "Option B",
                "name": "option_b",
                "type": "input/text"
              },
              {
                "label": "Option C",
                "name": "option_c",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const fieldset = page.locator('[data-advanced="true"]')
    await fieldset.locator('legend').click()

    await expect(page.getByLabel('Option A')).toBeVisible()
    await expect(page.getByLabel('Option B')).toBeVisible()
    await expect(page.getByLabel('Option C')).toBeVisible()
  })
})
