import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Group component', { tag: ['@e2e'] }, () => {
  test('should render field-group with default spacing', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "First Name",
                "name": "first_name",
                "type": "input/text"
              },
              {
                "label": "Last Name",
                "name": "last_name",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const group = page.locator('[data-slot="field-group"]')
    await expect(group.first()).toBeVisible()
    await expect(group.first()).toHaveClass(/gap-8/)
  })

  test('should render field-group with compact spacing when section has compact enabled', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "compact": true,
            "fields": [
              {
                "label": "Email",
                "name": "email",
                "type": "input/email"
              },
              {
                "label": "Phone",
                "name": "phone",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const groups = page.locator('[data-slot="field-group"]')
    const sectionGroup = groups.nth(1)
    await expect(sectionGroup).toBeVisible()
    await expect(sectionGroup).toHaveAttribute('data-compact', 'true')
    await expect(sectionGroup).toHaveClass(/gap-3/)
  })

  test('should render multiple groups for multiple sections', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Personal Info",
            "fields": [
              {
                "label": "Name",
                "name": "name",
                "type": "input/text"
              }
            ]
          },
          {
            "title": "Contact Info",
            "fields": [
              {
                "label": "Email",
                "name": "email",
                "type": "input/email"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const groups = page.locator('[data-slot="field-group"]')
    await expect(groups).toHaveCount(3)
  })

  test('should support mixed compact and non-compact sections', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Section A",
            "fields": [
              {
                "label": "Field A",
                "name": "field_a",
                "type": "input/text"
              }
            ]
          },
          {
            "title": "Section B",
            "compact": true,
            "fields": [
              {
                "label": "Field B",
                "name": "field_b",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const groups = page.locator('[data-slot="field-group"]')

    const nonCompactGroup = groups.nth(1)
    await expect(nonCompactGroup).not.toHaveAttribute('data-compact', 'true')
    await expect(nonCompactGroup).toHaveClass(/gap-8/)

    const compactGroup = groups.nth(2)
    await expect(compactGroup).toHaveAttribute('data-compact', 'true')
    await expect(compactGroup).toHaveClass(/gap-3/)
  })
})
