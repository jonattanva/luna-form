import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('List field initial value', { tag: ['@e2e'] }, () => {
  test('should render the correct number of items from initial value', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "emails": [
            { "email": "first@example.com" },
            { "email": "second@example.com" },
            { "email": "third@example.com" }
          ]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Email Addresses",
                "name": "emails",
                "type": "list",
                "advanced": {
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

    const inputs = page.locator('input[name$="email"]')
    await expect(inputs).toHaveCount(3)
  })

  test('should pre-fill input values from initial value array', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "emails": [
            { "email": "first@example.com" },
            { "email": "second@example.com" }
          ]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Email Addresses",
                "name": "emails",
                "type": "list",
                "advanced": {
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

    const inputs = page.locator('input[name$="email"]')
    await expect(inputs.nth(0)).toHaveValue('first@example.com')
    await expect(inputs.nth(1)).toHaveValue('second@example.com')
  })

  test('should submit list initial values without modification', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "tags": [
            { "label": "Alpha", "value": "alpha" },
            { "label": "Beta", "value": "beta" }
          ]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Tags",
                "name": "tags",
                "type": "list",
                "advanced": {
                  "action": "Add tag"
                },
                "fields": [
                  {
                    "label": "Label",
                    "name": "label",
                    "type": "input/text"
                  },
                  {
                    "label": "Value",
                    "name": "value",
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

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    await expect(page.locator('pre code')).toContainText('"tags"')
    await expect(page.locator('pre code')).toContainText('"Alpha"')
    await expect(page.locator('pre code')).toContainText('"alpha"')
    await expect(page.locator('pre code')).toContainText('"Beta"')
    await expect(page.locator('pre code')).toContainText('"beta"')
  })

  test('should pre-fill multi-field list items from initial value', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "contacts": [
            { "name": "Alice", "email": "alice@example.com" },
            { "name": "Bob", "email": "bob@example.com" }
          ]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Contacts",
                "name": "contacts",
                "type": "list",
                "advanced": {
                  "action": "Add contact"
                },
                "fields": [
                  {
                    "label": "Name",
                    "name": "name",
                    "type": "input/text"
                  },
                  {
                    "label": "Email",
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

    const nameInputs = page.locator('input[name$="name"]')
    const emailInputs = page.locator('input[name$="email"]')

    await expect(nameInputs.nth(0)).toHaveValue('Alice')
    await expect(emailInputs.nth(0)).toHaveValue('alice@example.com')
    await expect(nameInputs.nth(1)).toHaveValue('Bob')
    await expect(emailInputs.nth(1)).toHaveValue('bob@example.com')
  })

  test('should show remove buttons when initial value has more than one item', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "emails": [
            { "email": "first@example.com" },
            { "email": "second@example.com" }
          ]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Email Addresses",
                "name": "emails",
                "type": "list",
                "advanced": {
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
    await expect(removeButtons).toHaveCount(2)
  })

  test('should allow adding items beyond initial value count', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "emails": [
            { "email": "first@example.com" }
          ]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Email Addresses",
                "name": "emails",
                "type": "list",
                "advanced": {
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

    const inputs = page.locator('input[name$="email"]')
    await expect(inputs).toHaveCount(1)

    const addButton = page.getByRole('button', { name: /Add email address/ })
    await addButton.click()

    await expect(inputs).toHaveCount(2)
    await expect(inputs.nth(0)).toHaveValue('first@example.com')
    await expect(inputs.nth(1)).toHaveValue('')
  })

  test('should update counter correctly when initial value is provided with max set', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "emails": [
            { "email": "first@example.com" },
            { "email": "second@example.com" }
          ]
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Email Addresses",
                "name": "emails",
                "type": "list",
                "advanced": {
                  "action": "Add email address",
                  "length": {
                    "max": 5
                  }
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

    const fieldset = page.locator('fieldset[id="emails"]')
    await expect(fieldset.getByText('2 / 5')).toBeVisible()
  })

  test('should respect min constraint when initial value has fewer items', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "emails": [
            { "email": "only@example.com" }
          ]
        },
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

    const inputs = page.locator('input[name$="email"]')
    await expect(inputs).toHaveCount(3)
    await expect(inputs.nth(0)).toHaveValue('only@example.com')
  })
})
