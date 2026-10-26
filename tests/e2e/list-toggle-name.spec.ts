import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

/**
 * A row's toggle shows the row's preview label, and its accessible name has to
 * carry that text (WCAG 2.5.3, label in name). Naming it after the list title
 * and position alone hid what the row holds, and two lists sharing a title
 * gave several toggles the same name.
 */
const form = (top: string) => `{
  ${top}
  "sections": [
    {
      "fields": [
        {
          "label": "Question",
          "name": "questions",
          "type": "list",
          "advanced": {
            "collapsed": true,
            "preview": { "label": "label" }
          },
          "fields": [
            { "name": "label", "label": "Label", "type": "input/text" },
            { "name": "kind", "label": "Kind", "type": "input/text" }
          ]
        },
        {
          "label": "Contact",
          "name": "contacts",
          "type": "list",
          "advanced": { "collapsed": true },
          "fields": [
            { "name": "email", "label": "Email", "type": "input/text" },
            { "name": "phone", "label": "Phone", "type": "input/text" }
          ]
        }
      ]
    }
  ],
  "value": {
    "questions": [
      { "label": "Full name", "kind": "text" },
      { "label": "Email address", "kind": "email" },
      { "label": "", "kind": "text" }
    ],
    "contacts": [
      { "email": "a@example.com", "phone": "1" },
      { "email": "b@example.com", "phone": "2" }
    ]
  }
}`

test.describe('List row toggle name', { tag: ['@e2e'] }, () => {
  test('should name each toggle after the label its row shows', async ({
    page,
  }) => {
    await inject(page, form(''))
    await page.goto('/reactive')

    await expect(
      page.getByRole('button', {
        name: 'Expand Full name (Question 1)',
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: 'Expand Email address (Question 2)',
        exact: true,
      })
    ).toBeVisible()
  })

  test('should name the remove button after the row too', async ({ page }) => {
    await inject(page, form(''))
    await page.goto('/reactive')

    await expect(
      page.getByRole('button', {
        name: 'Remove Full name (Question item 1)',
        exact: true,
      })
    ).toBeVisible()
  })

  test('should follow the label as the user edits it', async ({ page }) => {
    await inject(page, form(''))
    await page.goto('/reactive')

    await page
      .getByRole('button', { name: 'Expand Full name (Question 1)' })
      .click()
    const input = page.locator('input[name="questions.0.label"]')
    await input.fill('First name')
    await expect(input).toHaveValue('First name')

    await expect(
      page.getByRole('button', {
        name: 'Collapse First name (Question 1)',
        exact: true,
      })
    ).toBeVisible()
  })

  test('should keep the list title and position for a row with no preview label', async ({
    page,
  }) => {
    await inject(page, form(''))
    await page.goto('/reactive')

    await expect(
      page.getByRole('button', { name: 'Expand Contact 1', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Remove Contact item 1', exact: true })
    ).toBeVisible()
  })

  test('should speak the language of the form', async ({ page }) => {
    await inject(page, form('"lang": "es",'))
    await page.goto('/reactive')

    await expect(
      page.getByRole('button', {
        name: 'Expandir Full name (Question 1)',
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: 'Eliminar Full name (Question 1)',
        exact: true,
      })
    ).toBeVisible()
  })
})
