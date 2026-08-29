import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Global style', { tag: ['@e2e'] }, () => {
  test('compact declared on the config reaches a section that does not declare it', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "style": { "compact": true },
        "sections": [
          {
            "title": "Section",
            "fields": [
              { "label": "A", "name": "a", "type": "input/text" },
              { "label": "B", "name": "b", "type": "input/text" }
            ]
          }
        ]
      }`
    )

    await page.goto('/reactive')

    const group = page.locator('[data-slot="field-group"]').last()
    await expect(group).toHaveAttribute('data-compact', 'true')
  })

  test('compact declared on the section works', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Section",
            "advanced": { "compact": true },
            "fields": [{ "label": "A", "name": "a", "type": "input/text" }]
          }
        ]
      }`
    )

    await page.goto('/reactive')

    const group = page.locator('[data-slot="field-group"]').last()
    await expect(group).toHaveAttribute('data-compact', 'true')
  })

  test('horizontal declared on the config reaches a field that does not declare it', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "style": { "horizontal": true },
        "sections": [
          { "fields": [{ "label": "A", "name": "a", "type": "input/text" }] }
        ]
      }`
    )

    await page.goto('/reactive')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')
  })

  test('horizontal declared on the field works', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "A",
                "name": "a",
                "type": "input/text",
                "advanced": { "horizontal": true }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('/reactive')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')
  })

  test('a field opting out explicitly beats the config', async ({ page }) => {
    await inject(
      page,
      `{
        "style": { "horizontal": true },
        "sections": [
          {
            "fields": [
              {
                "label": "A",
                "name": "a",
                "type": "input/text",
                "advanced": { "horizontal": false }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('/reactive')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'vertical')
  })

  test('a section opting out explicitly beats the config', async ({ page }) => {
    await inject(
      page,
      `{
        "style": { "compact": true },
        "sections": [
          {
            "title": "Section",
            "advanced": { "compact": false },
            "fields": [{ "label": "A", "name": "a", "type": "input/text" }]
          }
        ]
      }`
    )

    await page.goto('/reactive')

    const group = page.locator('[data-slot="field-group"]').last()
    await expect(group).not.toHaveAttribute('data-compact', 'true')
  })

  test('a checkbox stays horizontal against the config', async ({ page }) => {
    await inject(
      page,
      `{
        "style": { "horizontal": false },
        "sections": [
          {
            "fields": [
              { "label": "Accept", "name": "accept", "type": "checkbox" }
            ]
          }
        ]
      }`
    )

    await page.goto('/reactive')

    const field = page.locator('[data-slot="field"]').first()
    await expect(field).toHaveAttribute('data-orientation', 'horizontal')
  })

  test('a vertical field still renders its description below the control', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "A",
                "name": "a",
                "type": "input/text",
                "description": "Help text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('/reactive')

    await expect(page.getByText('Help text')).toBeVisible()
  })

  test('showOptionalLabel declared on the config reaches the label', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "style": { "showOptionalLabel": false },
        "sections": [
          { "fields": [{ "label": "A", "name": "a", "type": "input/text" }] }
        ]
      }`
    )

    await page.goto('/reactive')

    const label = page.locator('[data-slot="field-label"]').first()
    await expect(label).not.toContainText('(Optional)')
  })
})
