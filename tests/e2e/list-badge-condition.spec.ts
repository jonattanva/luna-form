import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const FIXTURE = {
  sections: [
    {
      fields: [
        {
          advanced: {
            action: 'Add another field',
            collapsed: false,
            preview: {
              badge: {
                label: 'Required',
                when: {
                  field: 'required',
                  operator: 'eq',
                  value: 'true',
                },
              },
              label: 'label',
              tags: ['type', 'name'],
            },
            length: {
              min: 1,
            },
          },
          name: 'field',
          type: 'list',
          fields: [
            {
              label: 'Name that users will see',
              name: 'label',
              type: 'input/text',
            },
            {
              label: 'Required?',
              name: 'required',
              type: 'select',
              source: [
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ],
            },
            {
              label: 'Technical key',
              name: 'name',
              type: 'input/text',
            },
            {
              name: 'type',
              type: 'input/text',
            },
          ],
        },
      ],
    },
  ],
}

test.describe('List Preview Badge Condition', { tag: ['@e2e'] }, () => {
  test('should show badge only when required is true', async ({ page }) => {
    await inject(page, JSON.stringify(FIXTURE))
    await page.goto('')

    // Wait for the form to be ready
    await page.waitForSelector('form')

    // Fill first item
    const labelInput = page.getByLabel('Name that users will see')
    const technicalKeyInput = page.getByLabel('Technical key')
    const requiredSelect = page.getByLabel('Required?')

    await labelInput.fill('First Field')
    await technicalKeyInput.fill('name_1')

    // Custom select interaction
    await requiredSelect.click()
    await page.getByRole('option', { name: 'Yes' }).click()

    // Note: previewBadge logic only renders when !isOpen in FieldListItem
    // Use evaluate to scroll and click the header to collapse (if necessary)
    await page.getByText('First Field').first().click()

    // The badge text is often transformed (e.g., uppercase in CSS)
    // The FieldPreview adds a div with flex classes. Inside FieldPreviewItem, we have spans.
    const badgeLocator = page
      .locator('button[aria-expanded="false"]')
      .filter({ hasText: 'First Field' })
      .locator('xpath=./following-sibling::div')
      .locator('span')
      .filter({ hasText: /^Required$/i })
    await expect(badgeLocator).toBeVisible()

    // Add second item
    await page.getByRole('button', { name: 'Add another field' }).click()

    await labelInput.nth(1).fill('Second Field')
    await technicalKeyInput.nth(1).fill('name_2')

    await requiredSelect.nth(1).click()
    await page.getByRole('option', { name: 'No' }).click()

    // Collapse second item
    await page.getByText('Second Field').first().click()

    // Verify only one "Required" badge exists in the first item and NOT in the second
    await expect(badgeLocator).toBeVisible()
    const secondBadgeLocator = page
      .locator('button[aria-expanded="false"]')
      .filter({ hasText: 'Second Field' })
      .locator('xpath=./following-sibling::div')
      .locator('span')
      .filter({ hasText: /^Required$/i })
    await expect(secondBadgeLocator).toBeHidden()
  })
})
