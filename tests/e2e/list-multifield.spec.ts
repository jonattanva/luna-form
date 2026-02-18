import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const MULTIFIELD_LIST = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Email Addresses",
          "name": "emails",
          "type": "list",
          "description": "Add up to 5 email addresses.",
          "advanced": {
            "action": "Add email address"
          },
          "fields": [
            {
              "name": "name",
              "label": "Name",
              "type": "input/text"
            },
            {
              "name": "comments",
              "label": "Comments",
              "type": "input/textarea",
              "placeholder": "Add any additional comments"
            }
          ]
        }
      ]
    }
  ]
}`

const MULTIFIELD_LIST_WITH_MAX = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Email Addresses",
          "name": "emails",
          "type": "list",
          "description": "Add up to 3 email addresses.",
          "advanced": {
            "action": "Add email address",
            "length": {
              "max": 3
            }
          },
          "fields": [
            {
              "name": "name",
              "label": "Name",
              "type": "input/text"
            },
            {
              "name": "comments",
              "label": "Comments",
              "type": "input/textarea",
              "placeholder": "Add any additional comments"
            }
          ]
        }
      ]
    }
  ]
}`

test.describe('List field - multi-field card layout', { tag: ['@e2e'] }, () => {
  test('should render item inside a card container', async ({ page }) => {
    await inject(page, MULTIFIELD_LIST)
    await page.goto('')

    const card = page.locator('[data-slot="field-group"]').first().locator('..')
    await expect(card).toHaveClass(/rounded-lg/)
    await expect(card).toHaveClass(/border/)
  })

  test('should render item header with label and index', async ({ page }) => {
    await inject(page, MULTIFIELD_LIST)
    await page.goto('')

    const header = page.getByText('Email Addresses 1')
    await expect(header).toBeVisible()
  })

  test('should render all fields inside the card', async ({ page }) => {
    await inject(page, MULTIFIELD_LIST)
    await page.goto('')

    const nameInput = page.locator('input[name="name"]')
    const commentsTextarea = page.locator('textarea[name="comments"]')

    await expect(nameInput).toHaveCount(1)
    await expect(commentsTextarea).toHaveCount(1)
  })

  test('should not show remove button when at minimum', async ({ page }) => {
    await inject(page, MULTIFIELD_LIST)
    await page.goto('')

    const removeButtons = page.getByRole('button', {
      name: /Remove Email Addresses item/,
    })
    await expect(removeButtons).toHaveCount(0)
  })

  test('should add a new card when add button is clicked', async ({ page }) => {
    await inject(page, MULTIFIELD_LIST)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    await expect(page.getByText('Email Addresses 1')).toBeVisible()
    await expect(page.getByText('Email Addresses 2')).toBeVisible()

    await expect(page.locator('input[name="name"]')).toHaveCount(2)
    await expect(page.locator('textarea[name="comments"]')).toHaveCount(2)
  })

  test('should show remove button in card header after adding an item', async ({
    page,
  }) => {
    await inject(page, MULTIFIELD_LIST)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    const removeButton1 = page.getByRole('button', {
      name: 'Remove Email Addresses item 1',
    })
    const removeButton2 = page.getByRole('button', {
      name: 'Remove Email Addresses item 2',
    })

    await expect(removeButton1).toBeVisible()
    await expect(removeButton2).toBeVisible()
  })

  test('should remove the correct card when remove button is clicked', async ({
    page,
  }) => {
    await inject(page, MULTIFIELD_LIST)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    const nameInputs = page.locator('input[name="name"]')
    await nameInputs.nth(0).fill('First')
    await nameInputs.nth(1).fill('Second')

    await page
      .getByRole('button', { name: 'Remove Email Addresses item 1' })
      .click()

    await expect(nameInputs).toHaveCount(1)
    await expect(nameInputs.first()).toHaveValue('Second')
  })

  test('should hide remove buttons after removing down to minimum', async ({
    page,
  }) => {
    await inject(page, MULTIFIELD_LIST)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    await page
      .getByRole('button', { name: 'Remove Email Addresses item 2' })
      .click()

    const removeButtons = page.getByRole('button', {
      name: /Remove Email Addresses item/,
    })
    await expect(removeButtons).toHaveCount(0)
  })

  test('should show counter when max is set', async ({ page }) => {
    await inject(page, MULTIFIELD_LIST_WITH_MAX)
    await page.goto('')

    const fieldset = page.locator('fieldset[id="emails"]')
    await expect(fieldset.getByText('1 / 3')).toBeVisible()
  })

  test('should update counter as cards are added', async ({ page }) => {
    await inject(page, MULTIFIELD_LIST_WITH_MAX)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()
    await addButton.click()

    const fieldset = page.locator('fieldset[id="emails"]')
    await expect(fieldset.getByText('3 / 3')).toBeVisible()
  })

  test('should disable add button when max cards is reached', async ({
    page,
  }) => {
    await inject(page, MULTIFIELD_LIST_WITH_MAX)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()
    await addButton.click()

    await expect(addButton).toBeDisabled()
  })

  test('single-field list should not render card header', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Email Addresses",
                "name": "emails",
                "type": "list",
                "advanced": { "action": "Add email address" },
                "fields": [
                  {
                    "name": "email",
                    "type": "input/email",
                    "placeholder": "name@example.com"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const header = page.getByText('Email Addresses 1')
    await expect(header).toBeHidden()
  })
})
