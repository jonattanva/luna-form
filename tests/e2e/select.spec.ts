import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Select form', { tag: ['@e2e'] }, () => {
  test('should work correctly with select month input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Month",
                            "name": "month",
                            "type": "select/month"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'May' })
    await option.click()

    const form = page.locator('form')
    await expect(form).toContainText('May')
  })

  // The years are the host's to give: luna-form keeps no clock, so the test
  // runs the same on any day.
  test('should work correctly with select year input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "context": { "years": { "current": 2026, "inFive": 2031 } },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Year",
                            "name": "year",
                            "type": "select/year",
                            "advanced": {
                                "length": {
                                    "min": { "$ref": "#/context/years.current" },
                                    "max": { "$ref": "#/context/years.inFive" }
                                }
                            }
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const options = page.getByRole('option')
    await expect(options).toHaveText([
      '2026',
      '2027',
      '2028',
      '2029',
      '2030',
      '2031',
    ])

    await page.getByRole('option', { name: '2028' }).click()

    const form = page.locator('form')
    await expect(form).toContainText('2028')
  })

  test('should render select array source correctly', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Fruit",
                            "name": "fruit",
                            "type": "select",
                            "source": [
                                { "value": "apple", "label": "Apple" },
                                { "value": "banana", "label": "Banana" },
                                { "value": "cherry", "label": "Cherry" }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const appleOption = page.getByRole('option', { name: 'Apple' })
    const bananaOption = page.getByRole('option', { name: 'Banana' })
    const cherryOption = page.getByRole('option', { name: 'Cherry' })

    await expect(appleOption).toBeVisible()
    await expect(bananaOption).toBeVisible()
    await expect(cherryOption).toBeVisible()
  })

  // A locked select still says what it holds. Its options are declared inline,
  // so nothing has to be fetched to name the value.
  for (const lock of ['disabled', 'readonly']) {
    test(`should display the value of a ${lock} select with an array source`, async ({
      page,
    }) => {
      await inject(
        page,
        JSON.stringify({
          sections: [
            {
              fields: [
                {
                  label: 'Select Fruit',
                  name: 'fruit',
                  type: 'select',
                  [lock]: true,
                  defaultValue: 'banana',
                  source: [
                    { value: 'apple', label: 'Apple' },
                    { value: 'banana', label: 'Banana' },
                  ],
                },
              ],
            },
          ],
        })
      )

      await page.goto('')

      const select = page.getByRole('combobox')
      await expect(select).toBeDisabled()
      await expect(select).toContainText('Banana')
    })
  }

  // A disabled select fetches nothing, so a remote source has no options to
  // name what it holds: the object value stands in as its only option, and a
  // saved selection stays readable.
  test('should display the object value of a disabled select with a remote source', async ({
    page,
  }) => {
    let requests = 0
    await page.route('**/api/locked-fruits', (route) => {
      requests += 1
      return route.fulfill({
        body: JSON.stringify([{ value: 'apple', label: 'Apple' }]),
        contentType: 'application/json',
      })
    })

    await inject(
      page,
      JSON.stringify({
        sections: [
          {
            fields: [
              {
                label: 'Select Fruit',
                name: 'fruit',
                type: 'select',
                disabled: true,
                defaultValue: { value: 'banana', label: 'Banana' },
                source: { url: '/api/locked-fruits' },
              },
            ],
          },
        ],
      })
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toBeDisabled()
    await expect(select).toContainText('Banana')
    expect(requests).toBe(0)
  })

  // Requests are keyed by the source, not by the field: two fields declaring
  // the same one share a single request and its cache entry.
  test('should share one request between two selects with the same source', async ({
    page,
  }) => {
    let requests = 0
    await page.route('**/api/shared-fruits', (route) => {
      requests += 1
      return route.fulfill({
        body: JSON.stringify([
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
        ]),
        contentType: 'application/json',
      })
    })

    const source = { url: '/api/shared-fruits' }
    await inject(
      page,
      JSON.stringify({
        sections: [
          {
            fields: [
              { label: 'First', name: 'first', type: 'select', source },
              { label: 'Second', name: 'second', type: 'select', source },
            ],
          },
        ],
      })
    )

    await page.goto('')

    for (const name of ['First', 'Second']) {
      const select = page.getByRole('combobox', { name })
      await expect(select).toBeVisible()
      await select.click()
      await expect(page.getByRole('option', { name: 'Banana' })).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('listbox')).toBeHidden()
    }

    expect(requests).toBe(1)
  })

  test('should work correctly with select day input type', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Day",
                            "name": "day",
                            "type": "select/day"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'Wednesday' })
    await option.click()

    const form = page.locator('form')
    await expect(form).toContainText('Wednesday')
  })

  test('should render all 7 week days for select day input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Select Day",
                            "name": "day",
                            "type": "select/day"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    for (const day of days) {
      await expect(page.getByRole('option', { name: day })).toBeVisible()
    }
  })

  test('should render both options for select active input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    await expect(page.getByRole('option', { name: 'Yes' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'No' })).toBeVisible()
  })

  test('should work correctly with select active input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'No' })
    await option.click()

    const form = page.locator('form')
    await expect(form).toContainText('No')
  })

  test('should submit the correct value for select active input type', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    await page.getByRole('option', { name: 'Yes' }).click()

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"active": true')
  })

  test('should not show "Invalid input" when selecting "No" in a required select/active field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active",
                            "required": true
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    // Seleccionamos "No" (que se traduce a false)
    await page.getByRole('option', { name: 'No' }).click()

    // Verificamos que NO aparezca el mensaje de error "Invalid input"
    await expect(page.getByText('Invalid input')).toBeHidden()

    // Intentamos hacer submit para asegurar que pasa la validación
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"active": false')
  })

  test('should display correct option when initial value is boolean true', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "value": { "active": true },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toContainText('Yes')
  })

  test('should display correct option when initial value is boolean false', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "value": { "active": false },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toContainText('No')
  })

  test('should display correct option when initial value is string "true"', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "value": { "active": "true" },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toContainText('Yes')
  })

  test('should display correct option when initial value is string "false"', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "value": { "active": "false" },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Active",
                            "name": "active",
                            "type": "select/active"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await expect(select).toContainText('No')
  })

  test('should render select fetch source correctly', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": {
                                "options": {
                                    "label": "name",
                                    "value": "id"
                                }
                            },
                            "label": "Select User",
                            "name": "user",
                            "type": "select",
                            "source": {
                                "url": "https://jsonplaceholder.typicode.com/users",
                                "method": "GET"
                            }
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const select = page.getByRole('combobox')
    await select.click()

    const option = page.getByRole('option', { name: 'Leanne Graham' })
    await expect(option).toBeVisible()
  })
})

// A remote source that fails gives its field no options: an HTTP error, a
// request that never answers, and JSON with no array at the `namespace` all
// leave the select empty, and the rest of the form keeps working.
test.describe('Select with a failing remote source', { tag: ['@e2e'] }, () => {
  const FRUITS = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ]

  const failing = (namespace?: string) =>
    JSON.stringify({
      sections: [
        {
          fields: [
            { label: 'Name', name: 'name', type: 'input/text' },
            {
              label: 'Fruit',
              name: 'fruit',
              type: 'select',
              source: { url: '/api/failing-fruits', namespace },
            },
          ],
        },
      ],
    })

  /** Opens the select, whose request has settled, and counts its options. */
  async function expectNoOptions(page: Page) {
    await page.getByRole('combobox', { name: 'Fruit (Optional)' }).click()
    await expect(page.getByRole('option')).toHaveCount(0)
    await expect(page.getByText('Apple', { exact: true })).toBeHidden()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).toBeHidden()
  }

  /** Types in the field beside the select, submits, and reads what was sent. */
  async function typeAndSubmit(page: Page) {
    const name = page.getByRole('textbox', { name: 'Name (Optional)' })
    await name.fill('Ada')
    await expect(name).toHaveValue('Ada')

    const request = page.waitForRequest((sent) => sent.method() === 'POST')
    await page.getByRole('button', { name: 'Submit' }).click()
    const [sent] = JSON.parse((await request).postData() ?? '[]')
    return sent
  }

  // The body of the error is an array of options: a field that took the body
  // of any response would offer them.
  test('offers nothing when the source answers 500', async ({ page }) => {
    await page.route('**/api/failing-fruits', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify(FRUITS),
      })
    )
    await inject(page, failing())

    const settled = page.waitForResponse(
      (response) => response.status() === 500
    )
    await page.goto('')
    await settled

    await expectNoOptions(page)
    expect(await typeAndSubmit(page)).toEqual({ name: 'Ada', fruit: '' })
  })

  test('offers nothing when the request fails on the network', async ({
    page,
  }) => {
    await page.route('**/api/failing-fruits', (route) => route.abort())
    await inject(page, failing())

    const settled = page.waitForEvent('requestfailed', (request) =>
      request.url().includes('/api/failing-fruits')
    )
    await page.goto('')
    await settled

    await expectNoOptions(page)
    expect(await typeAndSubmit(page)).toEqual({ name: 'Ada', fruit: '' })
  })

  // The options sit beside the `namespace`, not at it.
  test('offers nothing when the namespace holds no array', async ({ page }) => {
    await page.route('**/api/failing-fruits', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { total: 2 }, items: FRUITS }),
      })
    )
    await inject(page, failing('data'))

    const settled = page.waitForResponse((response) =>
      response.url().includes('/api/failing-fruits')
    )
    await page.goto('')
    await settled

    await expectNoOptions(page)
    expect(await typeAndSubmit(page)).toEqual({ name: 'Ada', fruit: '' })
  })
})
