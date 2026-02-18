import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const LIST_FIELD = `{
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
              "name": "email",
              "type": "input/email",
              "placeholder": "name@example.com",
              "required": true
            }
          ]
        }
      ]
    }
  ]
}`

const LIST_FIELD_WITH_MAX = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Email Addresses",
          "name": "emails",
          "type": "list",
          "description": "Add up to 5 email addresses.",
          "advanced": {
            "length": {
              "max": 5
            },
            "action": "Add email address"
          },
          "fields": [
            {
              "name": "email",
              "type": "input/email",
              "placeholder": "name@example.com",
              "required": true
            }
          ]
        }
      ]
    }
  ]
}`

test.describe('List field component', { tag: ['@e2e'] }, () => {
  test('should render label and description', async ({ page }) => {
    await inject(page, LIST_FIELD)
    await page.goto('')

    const fieldset = page.locator('fieldset[id="emails"]')
    await expect(fieldset).toBeVisible()

    const legend = fieldset.locator('legend')
    await expect(legend).toContainText('Email Addresses')

    const description = fieldset.locator('p')
    await expect(description).toContainText('Add up to 5 email addresses.')
  })

  test('should render one item by default', async ({ page }) => {
    await inject(page, LIST_FIELD)
    await page.goto('')

    const inputs = page.locator('input[name="email"]')
    await expect(inputs).toHaveCount(1)
  })

  test('should show add button with custom action label', async ({ page }) => {
    await inject(page, LIST_FIELD)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await expect(addButton).toBeVisible()
  })

  test('should not show remove button when at minimum (1 item)', async ({
    page,
  }) => {
    await inject(page, LIST_FIELD)
    await page.goto('')

    const removeButtons = page.getByRole('button', {
      name: /Remove Email Addresses item/,
    })
    await expect(removeButtons).toHaveCount(0)
  })

  test('should add a new item when add button is clicked', async ({ page }) => {
    await inject(page, LIST_FIELD)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    const inputs = page.locator('input[name="email"]')
    await expect(inputs).toHaveCount(2)
  })

  test('should show remove buttons for all items after adding one', async ({
    page,
  }) => {
    await inject(page, LIST_FIELD)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    const removeButtons = page.getByRole('button', {
      name: /Remove Email Addresses item/,
    })
    await expect(removeButtons).toHaveCount(2)
  })

  test('should remove item on remove button click', async ({ page }) => {
    await inject(page, LIST_FIELD)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    const inputs = page.locator('input[name="email"]')
    await expect(inputs).toHaveCount(2)

    await page
      .getByRole('button', { name: 'Remove Email Addresses item 1' })
      .click()

    await expect(inputs).toHaveCount(1)
  })

  test('should hide remove buttons again after removing down to minimum', async ({
    page,
  }) => {
    await inject(page, LIST_FIELD)
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
    await inject(page, LIST_FIELD_WITH_MAX)
    await page.goto('')

    const fieldset = page.locator('fieldset[id="emails"]')
    await expect(fieldset.getByText('1 / 5')).toBeVisible()
  })

  test('should update counter as items are added', async ({ page }) => {
    await inject(page, LIST_FIELD_WITH_MAX)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()
    await addButton.click()

    const fieldset = page.locator('fieldset[id="emails"]')
    await expect(fieldset.getByText('3 / 5')).toBeVisible()
  })

  test('should include item count in add button aria-label when max is set', async ({
    page,
  }) => {
    await inject(page, LIST_FIELD_WITH_MAX)
    await page.goto('')

    const addButton = page.getByRole('button', {
      name: 'Add email address, 1 of 5',
    })
    await expect(addButton).toBeVisible()
  })

  test('should disable add button when max items is reached', async ({
    page,
  }) => {
    await inject(page, LIST_FIELD_WITH_MAX)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })

    for (let i = 1; i < 5; i++) {
      await addButton.click()
    }

    await expect(addButton).toBeDisabled()
    await expect(page.locator('input[name="email"]')).toHaveCount(5)
  })

  test('should show "5 / 5" counter at max capacity', async ({ page }) => {
    await inject(page, LIST_FIELD_WITH_MAX)
    await page.goto('')

    const addButton = page.getByRole('button', { name: /Add email address/ })

    for (let i = 1; i < 5; i++) {
      await addButton.click()
    }

    const fieldset = page.locator('fieldset[id="emails"]')
    await expect(fieldset.getByText('5 / 5')).toBeVisible()
  })

  test('should use default action label "Add item" when action is not specified', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Tags",
                "name": "tags",
                "type": "list",
                "fields": [
                  {
                    "name": "tag",
                    "type": "input/text"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const addButton = page.getByRole('button', { name: 'Add item' })
    await expect(addButton).toBeVisible()
  })

  test('should render multiple items initially when min is greater than 1', async ({
    page,
  }) => {
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
                "advanced": {
                  "length": {
                    "min": 3
                  },
                  "action": "Add email address"
                },
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

    const inputs = page.locator('input[name="email"]')
    await expect(inputs).toHaveCount(3)
  })

  test('should not show remove buttons when items equal minimum', async ({
    page,
  }) => {
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
                "advanced": {
                  "length": {
                    "min": 3
                  },
                  "action": "Add email address"
                },
                "fields": [
                  {
                    "name": "email",
                    "type": "input/email"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const removeButtons = page.getByRole('button', {
      name: /Remove Email Addresses item/,
    })
    await expect(removeButtons).toHaveCount(0)
  })

  test('should show remove buttons only after adding beyond minimum', async ({
    page,
  }) => {
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
                "advanced": {
                  "length": {
                    "min": 2
                  },
                  "action": "Add email address"
                },
                "fields": [
                  {
                    "name": "email",
                    "type": "input/email"
                  }
                ]
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const removeButtons = page.getByRole('button', {
      name: /Remove Email Addresses item/,
    })
    await expect(removeButtons).toHaveCount(0)

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    await expect(removeButtons).toHaveCount(3)
  })
})
