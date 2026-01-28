import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Custom validation', { tag: ['@e2e'] }, () => {
  test('should show error when fields are not equal', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Password",
                  "name": "password",
                  "type": "input/text",
                  "required": true
                },
                {
                  "label": "Confirm Password",
                  "name": "confirmPassword",
                  "type": "input/text",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "password",
                      "operator": "eq",
                      "message": "Passwords must match"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const password = page.locator('input[name="password"]')
    const confirmPassword = page.locator('input[name="confirmPassword"]')

    await password.fill('secret123')
    await confirmPassword.fill('different456')
    await confirmPassword.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Passwords must match', { exact: true })
    await expect(message).toBeVisible()
  })

  test('should not show error when fields are equal', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Password",
                  "name": "password",
                  "type": "input/text",
                  "required": true
                },
                {
                  "label": "Confirm Password",
                  "name": "confirmPassword",
                  "type": "input/text",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "password",
                      "operator": "eq",
                      "message": "Passwords must match"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const password = page.locator('input[name="password"]')
    const confirmPassword = page.locator('input[name="confirmPassword"]')

    await password.fill('secret123')
    await confirmPassword.fill('secret123')
    await confirmPassword.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Passwords must match', { exact: true })
    await expect(message).toHaveCount(0)
  })

  test('should show error when fields are equal but should be different', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Current Username",
                  "name": "currentUsername",
                  "type": "input/text",
                  "required": true
                },
                {
                  "label": "New Username",
                  "name": "newUsername",
                  "type": "input/text",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "currentUsername",
                      "operator": "neq",
                      "message": "New username must be different"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const currentUsername = page.locator('input[name="currentUsername"]')
    const newUsername = page.locator('input[name="newUsername"]')

    await currentUsername.fill('john_doe')
    await newUsername.fill('john_doe')
    await newUsername.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('New username must be different', {
      exact: true,
    })
    await expect(message).toBeVisible()
  })

  test('should not show error when fields are different', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Current Username",
                  "name": "currentUsername",
                  "type": "input/text",
                  "required": true
                },
                {
                  "label": "New Username",
                  "name": "newUsername",
                  "type": "input/text",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "currentUsername",
                      "operator": "neq",
                      "message": "New username must be different"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const currentUsername = page.locator('input[name="currentUsername"]')
    const newUsername = page.locator('input[name="newUsername"]')

    await currentUsername.fill('john_doe')
    await newUsername.fill('jane_doe')
    await newUsername.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('New username must be different', {
      exact: true,
    })
    await expect(message).toHaveCount(0)
  })

  test('should show error when value is not greater', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Min Price",
                  "name": "minPrice",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Max Price",
                  "name": "maxPrice",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "minPrice",
                      "operator": "gt",
                      "message": "Max price must be greater than min price"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const minPrice = page.locator('input[name="minPrice"]')
    const maxPrice = page.locator('input[name="maxPrice"]')

    await minPrice.fill('100')
    await maxPrice.fill('50')
    await maxPrice.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Max price must be greater than min price', {
      exact: true,
    })
    await expect(message).toBeVisible()
  })

  test('should not show error when value is greater', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Min Price",
                  "name": "minPrice",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Max Price",
                  "name": "maxPrice",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "minPrice",
                      "operator": "gt",
                      "message": "Max price must be greater than min price"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const minPrice = page.locator('input[name="minPrice"]')
    const maxPrice = page.locator('input[name="maxPrice"]')

    await minPrice.fill('100')
    await maxPrice.fill('200')
    await maxPrice.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Max price must be greater than min price', {
      exact: true,
    })
    await expect(message).toHaveCount(0)
  })

  test('should show error when value is less than reference', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Start Year",
                  "name": "startYear",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "End Year",
                  "name": "endYear",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "startYear",
                      "operator": "gte",
                      "message": "End year must be equal or after start year"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const startYear = page.locator('input[name="startYear"]')
    const endYear = page.locator('input[name="endYear"]')

    await startYear.fill('2025')
    await endYear.fill('2020')
    await endYear.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText(
      'End year must be equal or after start year',
      {
        exact: true,
      }
    )
    await expect(message).toBeVisible()
  })

  test('should not show error when value is equal', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Start Year",
                  "name": "startYear",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "End Year",
                  "name": "endYear",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "startYear",
                      "operator": "gte",
                      "message": "End year must be equal or after start year"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const startYear = page.locator('input[name="startYear"]')
    const endYear = page.locator('input[name="endYear"]')

    await startYear.fill('2025')
    await endYear.fill('2025')
    await endYear.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText(
      'End year must be equal or after start year',
      {
        exact: true,
      }
    )
    await expect(message).toHaveCount(0)
  })

  test('should show error when value is not less than reference', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Max Quantity",
                  "name": "maxQuantity",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Current Quantity",
                  "name": "currentQuantity",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "maxQuantity",
                      "operator": "lt",
                      "message": "Current quantity must be less than max"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const maxQuantity = page.locator('input[name="maxQuantity"]')
    const currentQuantity = page.locator('input[name="currentQuantity"]')

    await maxQuantity.fill('10')
    await currentQuantity.fill('15')
    await currentQuantity.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Current quantity must be less than max', {
      exact: true,
    })
    await expect(message).toBeVisible()
  })

  test('should not show error when value is less than reference', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Max Quantity",
                  "name": "maxQuantity",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Current Quantity",
                  "name": "currentQuantity",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "maxQuantity",
                      "operator": "lt",
                      "message": "Current quantity must be less than max"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const maxQuantity = page.locator('input[name="maxQuantity"]')
    const currentQuantity = page.locator('input[name="currentQuantity"]')

    await maxQuantity.fill('10')
    await currentQuantity.fill('5')
    await currentQuantity.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Current quantity must be less than max', {
      exact: true,
    })
    await expect(message).toHaveCount(0)
  })

  test('should show error when value exceeds reference', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Budget Limit",
                  "name": "budgetLimit",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Expense",
                  "name": "expense",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "budgetLimit",
                      "operator": "lte",
                      "message": "Expense cannot exceed budget limit"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const budgetLimit = page.locator('input[name="budgetLimit"]')
    const expense = page.locator('input[name="expense"]')

    await budgetLimit.fill('1000')
    await expense.fill('1500')
    await expense.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Expense cannot exceed budget limit', {
      exact: true,
    })
    await expect(message).toBeVisible()
  })

  test('should not show error when value equals reference', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Budget Limit",
                  "name": "budgetLimit",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Expense",
                  "name": "expense",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "budgetLimit",
                      "operator": "lte",
                      "message": "Expense cannot exceed budget limit"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const budgetLimit = page.locator('input[name="budgetLimit"]')
    const expense = page.locator('input[name="expense"]')

    await budgetLimit.fill('1000')
    await expense.fill('1000')
    await expense.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Expense cannot exceed budget limit', {
      exact: true,
    })
    await expect(message).toHaveCount(0)
  })

  test('should validate multiple custom rules on same field', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Min Value",
                  "name": "minValue",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Max Value",
                  "name": "maxValue",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Target Value",
                  "name": "targetValue",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": [
                      {
                        "field": "minValue",
                        "operator": "gte",
                        "message": "Target must be at least min value"
                      },
                      {
                        "field": "maxValue",
                        "operator": "lte",
                        "message": "Target must not exceed max value"
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const minValue = page.locator('input[name="minValue"]')
    const maxValue = page.locator('input[name="maxValue"]')
    const targetValue = page.locator('input[name="targetValue"]')

    await minValue.fill('10')
    await maxValue.fill('100')
    await targetValue.fill('5')
    await targetValue.blur()

    await page.locator('button[type="submit"]').click()

    const minMessage = page.getByText('Target must be at least min value', {
      exact: true,
    })
    await expect(minMessage).toBeVisible()
  })

  test('should pass when value is within range', async ({ page }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Min Value",
                  "name": "minValue",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Max Value",
                  "name": "maxValue",
                  "type": "input/number",
                  "required": true
                },
                {
                  "label": "Target Value",
                  "name": "targetValue",
                  "type": "input/number",
                  "required": true,
                  "validation": {
                    "custom": [
                      {
                        "field": "minValue",
                        "operator": "gte",
                        "message": "Target must be at least min value"
                      },
                      {
                        "field": "maxValue",
                        "operator": "lte",
                        "message": "Target must not exceed max value"
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const minValue = page.locator('input[name="minValue"]')
    const maxValue = page.locator('input[name="maxValue"]')
    const targetValue = page.locator('input[name="targetValue"]')

    await minValue.fill('10')
    await maxValue.fill('100')
    await targetValue.fill('50')
    await targetValue.blur()

    await page.locator('button[type="submit"]').click()

    const minMessage = page.getByText('Target must be at least min value', {
      exact: true,
    })
    const maxMessage = page.getByText('Target must not exceed max value', {
      exact: true,
    })
    await expect(minMessage).toHaveCount(0)
    await expect(maxMessage).toHaveCount(0)
  })

  test('should use eq operator by default when operator is not specified', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [
            {
              "fields": [
                {
                  "label": "Email",
                  "name": "email",
                  "type": "input/text",
                  "required": true
                },
                {
                  "label": "Confirm Email",
                  "name": "confirmEmail",
                  "type": "input/text",
                  "required": true,
                  "validation": {
                    "custom": {
                      "field": "email",
                      "message": "Emails must match"
                    }
                  }
                }
              ]
            }
          ]
        }`
    )

    await page.goto('')

    const email = page.locator('input[name="email"]')
    const confirmEmail = page.locator('input[name="confirmEmail"]')

    await email.fill('test@example.com')
    await confirmEmail.fill('different@example.com')
    await confirmEmail.blur()

    await page.locator('button[type="submit"]').click()

    const message = page.getByText('Emails must match', { exact: true })
    await expect(message).toBeVisible()
  })

  test('should show error on blur when fields are not equal', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Password",
                "name": "password",
                "type": "input/text",
                "required": true
              },
              {
                "label": "Confirm Password",
                "name": "confirmPassword",
                "type": "input/text",
                "required": true,
                "validation": {
                  "custom": {
                    "field": "password",
                    "operator": "eq",
                    "message": "Passwords must match"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const password = page.locator('input[name="password"]')
    const confirmPassword = page.locator('input[name="confirmPassword"]')

    await password.fill('secret123')
    await confirmPassword.fill('different456')
    await confirmPassword.blur()

    const message = page.getByText('Passwords must match', { exact: true })
    await expect(message).toBeVisible()
  })

  test('should not show error on blur when fields are equal', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Password",
                "name": "password",
                "type": "input/text",
                "required": true
              },
              {
                "label": "Confirm Password",
                "name": "confirmPassword",
                "type": "input/text",
                "required": true,
                "validation": {
                  "custom": {
                    "field": "password",
                    "operator": "eq",
                    "message": "Passwords must match"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const password = page.locator('input[name="password"]')
    const confirmPassword = page.locator('input[name="confirmPassword"]')

    await password.fill('secret123')
    await confirmPassword.fill('secret123')
    await confirmPassword.blur()

    const message = page.getByText('Passwords must match', { exact: true })
    await expect(message).toHaveCount(0)
  })

  test('should clear error on blur when value is corrected', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Password",
                "name": "password",
                "type": "input/text",
                "required": true
              },
              {
                "label": "Confirm Password",
                "name": "confirmPassword",
                "type": "input/text",
                "required": true,
                "validation": {
                  "custom": {
                    "field": "password",
                    "operator": "eq",
                    "message": "Passwords must match"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const password = page.locator('input[name="password"]')
    const confirmPassword = page.locator('input[name="confirmPassword"]')
    const message = page.getByText('Passwords must match', { exact: true })

    await password.fill('secret123')
    await confirmPassword.fill('wrong')
    await confirmPassword.blur()

    await expect(message).toBeVisible()

    await confirmPassword.fill('secret123')
    await confirmPassword.blur()

    await expect(message).toHaveCount(0)
  })

  test('should validate gt operator on blur', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Min Price",
                "name": "minPrice",
                "type": "input/number",
                "required": true
              },
              {
                "label": "Max Price",
                "name": "maxPrice",
                "type": "input/number",
                "required": true,
                "validation": {
                  "custom": {
                    "field": "minPrice",
                    "operator": "gt",
                    "message": "Max price must be greater than min price"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const minPrice = page.locator('input[name="minPrice"]')
    const maxPrice = page.locator('input[name="maxPrice"]')

    await minPrice.fill('100')
    await maxPrice.fill('50')
    await maxPrice.blur()

    const message = page.getByText('Max price must be greater than min price', {
      exact: true,
    })
    await expect(message).toBeVisible()
  })

  test('should validate multiple custom rules on blur', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Min Value",
                "name": "minValue",
                "type": "input/number",
                "required": true
              },
              {
                "label": "Max Value",
                "name": "maxValue",
                "type": "input/number",
                "required": true
              },
              {
                "label": "Target Value",
                "name": "targetValue",
                "type": "input/number",
                "required": true,
                "validation": {
                  "custom": [
                    {
                      "field": "minValue",
                      "operator": "gte",
                      "message": "Target must be at least min value"
                    },
                    {
                      "field": "maxValue",
                      "operator": "lte",
                      "message": "Target must not exceed max value"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const minValue = page.locator('input[name="minValue"]')
    const maxValue = page.locator('input[name="maxValue"]')
    const targetValue = page.locator('input[name="targetValue"]')

    await minValue.fill('10')
    await maxValue.fill('100')
    await targetValue.fill('5')
    await targetValue.blur()

    const minMessage = page.getByText('Target must be at least min value', {
      exact: true,
    })
    await expect(minMessage).toBeVisible()
  })

  test('should read current value from other field on blur', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Password",
                "name": "password",
                "type": "input/text",
                "required": true
              },
              {
                "label": "Confirm Password",
                "name": "confirmPassword",
                "type": "input/text",
                "required": true,
                "validation": {
                  "custom": {
                    "field": "password",
                    "operator": "eq",
                    "message": "Passwords must match"
                  }
                }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const password = page.locator('input[name="password"]')
    const confirmPassword = page.locator('input[name="confirmPassword"]')
    const message = page.getByText('Passwords must match', { exact: true })

    await password.fill('initial')
    await confirmPassword.fill('initial')
    await confirmPassword.blur()

    await expect(message).toHaveCount(0)

    await password.fill('changed')
    await confirmPassword.click()
    await confirmPassword.blur()

    await expect(message).toBeVisible()
  })
})
