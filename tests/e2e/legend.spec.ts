import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Legend component', { tag: ['@e2e'] }, () => {
  test('should render only title when description is not provided', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Section Title Only",
            "fields": [
              {
                "label": "Field",
                "name": "field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const legend = page.locator('legend')
    await expect(legend).toBeVisible()
    await expect(legend).toHaveText('Section Title Only')
  })

  test('should render only description when title is not provided', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "description": "This is a standalone description.",
            "fields": [
              {
                "label": "Field",
                "name": "field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const legend = page.locator('legend')
    await expect(legend).toHaveCount(0)

    const description = page.getByText('This is a standalone description.')
    await expect(description).toBeVisible()
  })

  test('should render both title and description', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Complete Section",
            "description": "This section has both title and description.",
            "fields": [
              {
                "label": "Field",
                "name": "field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const legend = page.locator('legend')
    await expect(legend).toBeVisible()
    await expect(legend).toHaveText('Complete Section')

    const description = page.getByText(
      'This section has both title and description.'
    )
    await expect(description).toBeVisible()
  })

  test('should not render legend or description when both are empty', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Field Without Legend",
                "name": "fieldWithoutLegend",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const legend = page.locator('legend')
    await expect(legend).toHaveCount(0)

    const field = page.getByLabel('Field Without Legend')
    await expect(field).toBeVisible()
  })

  test('should render markdown link in title', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Section with [Link](https://example.com)",
            "fields": [
              {
                "label": "Field",
                "name": "field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const legend = page.locator('legend')
    await expect(legend).toBeVisible()

    const link = legend.getByRole('link', { name: 'Link' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', 'https://example.com')
  })

  test('should render markdown link in description', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "Section Title",
            "description": "Visit [Documentation](https://docs.example.com) for help.",
            "fields": [
              {
                "label": "Field",
                "name": "field",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const link = page.getByRole('link', { name: 'Documentation' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', 'https://docs.example.com')
  })

  test('should render multiple sections with different legend configurations', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "title": "First Section",
            "description": "First description.",
            "fields": [
              {
                "label": "Field 1",
                "name": "field1",
                "type": "input/text"
              }
            ]
          },
          {
            "title": "Second Section",
            "fields": [
              {
                "label": "Field 2",
                "name": "field2",
                "type": "input/text"
              }
            ]
          },
          {
            "fields": [
              {
                "label": "Field 3",
                "name": "field3",
                "type": "input/text"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const legends = page.locator('legend')
    await expect(legends).toHaveCount(2)

    await expect(legends.nth(0)).toHaveText('First Section')
    await expect(legends.nth(1)).toHaveText('Second Section')

    const firstDescription = page.getByText('First description.')
    await expect(firstDescription).toBeVisible()

    const allFields = page.locator('input[type="text"]')
    await expect(allFields).toHaveCount(3)
  })
})
