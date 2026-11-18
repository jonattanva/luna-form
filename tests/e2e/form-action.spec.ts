import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Form action handling', { tag: ['@e2e'] }, () => {
  test('should submit successfully', async ({ page }) => {
    await inject(
      page,
      `{
  "sections": [
    {
      "advanced": {
        "separator": true
      },
      "title": "Profile",
      "description": "Fill in your profile information."
    },
    {
      "advanced": {
        "separator": true
      },
      "fields": [
        {
          "advanced": {
            "data": {
              "testid": "name"
            },
            "horizontal": true
          },
          "label": "Name",
          "name": "name",
          "type": "input/text",
          "required": true,
          "description": "Provide your full name for identification",
          "validation": {
            "required": "Name is required"
          }
        }
      ]
    },
    {
      "fields": [
        {
          "advanced": {
            "data": {
              "testid": "message"
            },
            "horizontal": true
          },
          "label": "Message",
          "name": "message",
          "type": "textarea",
          "required": true,
          "description": "You can write your message here. Keep it short, preferably under 100 characters.",
          "validation": {
            "required": "Message is required"
          }
        }
      ]
    }
  ]
}`
    )
    await page.goto('')

    const name = page.getByTestId('name')
    await expect(name).toBeVisible()
    await name.fill('John Doe')

    const message = page.getByTestId('message')
    await expect(message).toBeVisible()
    await message.fill('Hello, this is a test message.')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      name: 'John Doe',
      message: 'Hello, this is a test message.',
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )

    await expect(name).toBeEmpty()
    await expect(message).toBeEmpty()
  })

  test('should validate and show errors on submission', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
              {
                "advanced": {
                    "separator": true
                },
                "title": "Profile",
                "description": "Fill in your profile information."
              },
              {
                "advanced": {
                    "separator": true
                },
                "fields": [
                    {
                        "advanced": {
                            "data": {
                            "testid": "name"
                            },
                            "horizontal": true
                        },
                        "label": "Name",
                        "name": "name",
                        "type": "input/text",
                        "required": true,
                        "description": "Provide your full name for identification",
                        "validation": {
                            "required": "Name is required"
                        }
                    }
                ]
              },
              {
                  "fields": [
                      {
                          "advanced": {
                              "data": {
                                "testid": "message"
                              },
                              "horizontal": true
                          },
                          "label": "Message",
                          "name": "message",
                          "type": "textarea",
                          "required": true,
                          "description": "You can write your message here. Keep it short, preferably under 100 characters.",
                          "validation": {
                              "required": "Message is required"
                          }
                      }
                  ]
              }
          ]
      }`
    )
    await page.goto('')

    // See the note in `translation.spec.ts`: the click has to wait for the
    // client, not just for the button.
    await expect(page.locator('input[name="name"]')).toBeVisible()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(
      page.getByText('Name is required', { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText('Message is required', { exact: true })
    ).toBeVisible()
  })

  // The schema registry answered `name in {}`, which is true for whatever a
  // plain object inherits: a field named after one of those members was never
  // registered, so it was neither validated nor submitted.
  test('should validate and submit a field named after an object member', async ({
    page,
  }) => {
    await inject(
      page,
      JSON.stringify({
        sections: [
          {
            fields: [
              {
                name: 'toString',
                label: 'Summary',
                type: 'input/text',
                required: true,
              },
            ],
          },
        ],
      })
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('[id="toString-error"]')).toBeVisible()

    await page.locator('input[name="toString"]').fill('Quarterly report')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"toString": "Quarterly report"'
    )
  })

  test('should submit form with select fields', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [ 
            {
                "title": "Payment Method",
                "description": "All transactions are secure and encrypted",
                "fields": [
                    {
                        "label": "Name on card",
                        "name": "name",
                        "type": "input/text",
                        "required": true
                    },
                    {
                        "label": "Card number",
                        "name": "card_number",
                        "type": "input/text",
                        "required": true,
                        "description": "Enter your 16-digit card number",
                        "placeholder": "1234 5678 9012 3456"
                    },
                    {
                        "advanced": {
                            "cols": 3
                        },
                        "type": "column",
                        "fields": [
                            {
                                "label": "Month",
                                "name": "month",
                                "type": "select/month",
                                "required": true
                            },
                            {
                                "label": "Year",
                                "name": "year",
                                "type": "select/year",
                                "required": true,
                                "advanced": {
                                    "length": { "min": 2026, "max": 2032 }
                                }
                            },
                            {
                                "label": "CVV",
                                "name": "cvv",
                                "type": "input/number",
                                "required": true
                            }
                        ]
                    }
                ]
            }
        ]
      }`
    )
    await page.goto('')

    const name = page.getByLabel('Name on card')
    await name.fill('Jane Smith')

    const card = page.getByLabel('Card number')
    await card.fill('1234 5678 9012 3456')

    const monthInput = page.getByRole('combobox').first()
    await monthInput.click()

    const monthOption = page.getByRole('option', {
      name: 'January',
    })
    await monthOption.click()

    const yearInput = page.getByRole('combobox').nth(1)
    await yearInput.click()

    const yearOption = page.getByRole('option', { name: '2028' })
    await yearOption.click()

    // The popup plays an exit animation before it unmounts, and Radix hands
    // focus back to the trigger a task after that. A fill that starts in
    // between loses its keystrokes to the closing popup or the trigger, so
    // wait for both before typing.
    await expect(page.getByRole('listbox')).toBeHidden()
    await expect(yearInput).toBeFocused()

    await page.getByLabel('CVV').fill('123')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      name: 'Jane Smith',
      card_number: '1234 5678 9012 3456',
      month: 1,
      year: 2028,
      cvv: 123,
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )

    await expect(name).toBeEmpty()
    await expect(card).toBeEmpty()
  })
})

// A success that does not keep the values starts the form over: what the
// definition gives it, or what the host still holds through `value`. Clearing
// the values alone left a list with the rows it had, emptied, and a field the
// host held blank.
test.describe('The form after a successful submit', { tag: ['@e2e'] }, () => {
  const form = JSON.stringify({
    sections: [
      {
        fields: [
          { label: 'Name', name: 'name', type: 'input/text' },
          {
            fields: [{ label: 'SKU', name: 'sku', type: 'input/text' }],
            label: 'Items',
            name: 'items',
            type: 'list',
          },
        ],
      },
    ],
  })

  for (const [route, name, rows] of [
    ['/', '', ['']],
    ['/reactive', 'Ada', ['A1', 'B2']],
  ] as const) {
    test(`should start over on ${route}, a list with the rows it starts with`, async ({
      page,
    }) => {
      await inject(page, form)
      await page.goto(route)

      await page.locator('input[name="name"]').fill('Ada')
      await page.locator('input[name$=".sku"]').first().fill('A1')
      await page.getByRole('button', { name: 'Add item' }).click()
      await page.locator('input[name$=".sku"]').nth(1).fill('B2')
      await page.getByRole('button', { name: 'Submit' }).click()
      await expect(page.getByText('Form submitted successfully')).toBeVisible()

      // `/` keeps nothing; `/reactive` holds what was reported, as a host
      // that keeps the values does.
      await expect(page.locator('input[name="name"]')).toHaveValue(name)
      await expect(page.locator('input[name$=".sku"]')).toHaveCount(rows.length)
      for (const [index, value] of rows.entries()) {
        await expect(
          page.locator('input[name$=".sku"]').nth(index)
        ).toHaveValue(value)
      }
    })
  }

  test('should start blank for a host that clears its state on success', async ({
    page,
  }) => {
    await inject(
      page,
      JSON.stringify({ ...JSON.parse(form), host: { clearOnSuccess: true } })
    )
    await page.goto('/reactive')

    await page.locator('input[name="name"]').fill('Ada')
    await page.locator('input[name$=".sku"]').first().fill('A1')
    await page.getByRole('button', { name: 'Add item' }).click()
    await page.locator('input[name$=".sku"]').nth(1).fill('B2')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    await expect(page.locator('input[name="name"]')).toHaveValue('')
    await expect(page.locator('input[name$=".sku"]')).toHaveCount(1)
    await expect(page.locator('input[name$=".sku"]')).toHaveValue('')
  })

  test('should end a submit that checks nothing as any other', async ({
    page,
  }) => {
    await inject(
      page,
      JSON.stringify({
        ...JSON.parse(form),
        host: { clearOnSuccess: true, validateOnSubmit: false },
      })
    )
    await page.goto('/reactive')

    await page.locator('input[name="name"]').fill('Ada')
    await page.getByRole('button', { name: 'Add item' }).click()
    await expect(page.locator('input[name$=".sku"]')).toHaveCount(2)
    await page.getByRole('button', { name: 'Submit' }).click()

    // `onSuccess` is called, and the form starts over from what the host
    // holds then, which it cleared: the list is back to the row it starts with.
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('input[name="name"]')).toHaveValue('')
    await expect(page.locator('input[name$=".sku"]')).toHaveCount(1)
  })

  test('should hide again what a change event revealed', async ({ page }) => {
    await inject(
      page,
      JSON.stringify({
        sections: [
          {
            fields: [
              {
                event: {
                  change: [
                    {
                      action: 'state',
                      state: { hidden: false },
                      target: 'company',
                      when: 'business',
                    },
                  ],
                },
                label: 'Kind',
                name: 'kind',
                source: [
                  { label: 'Personal', value: 'personal' },
                  { label: 'Business', value: 'business' },
                ],
                type: 'radio',
              },
              {
                hidden: true,
                label: 'Company',
                name: 'company',
                type: 'input/text',
              },
            ],
          },
        ],
      })
    )
    await page.goto('/')

    await page.getByRole('radio', { name: 'Business' }).click()
    await page.locator('input[name="company"]').fill('Acme')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    await expect(
      page.getByRole('radio', { name: 'Business' })
    ).not.toBeChecked()
    await expect(page.locator('input[name="company"]')).toHaveCount(0)
  })

  test('should bring a keyboard user back to the submit button', async ({
    page,
  }) => {
    await inject(page, form)
    await page.goto('/')

    await page.locator('input[name="name"]').fill('Ada')
    await page.locator('input[name="name"]').press('Enter')
    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    await expect(page.getByRole('button', { name: 'Submit' })).toBeFocused()
  })
})
