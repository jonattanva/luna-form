import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Initial value nested state events', { tag: ['@e2e'] }, () => {
  const getSelect = (page: Page, label: string) => {
    return page
      .locator('[data-slot="field"]')
      .filter({ hasText: label })
      .getByRole('combobox')
      .first()
  }

  test('should reveal nested (dotted) targets from select initial value on initial load', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "authType": "basic"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Authentication type",
                "name": "authType",
                "type": "select",
                "defaultValue": "none",
                "source": [
                  { "label": "None", "value": "none" },
                  { "label": "Basic Auth", "value": "basic" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": ["basicAuth.username", "basicAuth.password"],
                      "state": { "hidden": false },
                      "when": "basic"
                    }
                  ]
                }
              },
              {
                "label": "Username",
                "name": "basicAuth.username",
                "type": "input/text",
                "hidden": true
              },
              {
                "label": "Password",
                "name": "basicAuth.password",
                "type": "input/password",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('should reveal nested (dotted) targets when select changes at runtime', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Authentication type",
                "name": "authType",
                "type": "select",
                "defaultValue": "none",
                "source": [
                  { "label": "None", "value": "none" },
                  { "label": "Basic Auth", "value": "basic" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": ["basicAuth.username", "basicAuth.password"],
                      "state": { "hidden": false },
                      "when": "basic"
                    }
                  ]
                }
              },
              {
                "label": "Username",
                "name": "basicAuth.username",
                "type": "input/text",
                "hidden": true
              },
              {
                "label": "Password",
                "name": "basicAuth.password",
                "type": "input/password",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByLabel('Username')).toHaveCount(0)
    await expect(page.getByLabel('Password')).toHaveCount(0)

    const authType = getSelect(page, 'Authentication type')
    await authType.click()
    await page.getByRole('option', { name: 'Basic Auth' }).click()

    await page.mouse.click(10, 10)
    await expect(page.getByRole('listbox')).toBeHidden()

    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  // Control: a SIMPLE target name also fails on initial load when the trigger
  // field declares a defaultValue. Proves the root cause is the defaultValue
  // race during hydration, not the dot in the target name.
  test('should reveal simple target from select initial value when trigger has a defaultValue', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "authType": "basic"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Authentication type",
                "name": "authType",
                "type": "select",
                "defaultValue": "none",
                "source": [
                  { "label": "None", "value": "none" },
                  { "label": "Basic Auth", "value": "basic" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": "username",
                      "state": { "hidden": false },
                      "when": "basic"
                    }
                  ]
                }
              },
              {
                "label": "Username",
                "name": "username",
                "type": "input/text",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByLabel('Username')).toBeVisible()
  })

  // Control: dotted target names work fine on initial load when the trigger has
  // NO defaultValue. Proves the dot is not the cause.
  test('should reveal nested (dotted) targets from initial value when trigger has no defaultValue', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "authType": "basic"
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Authentication type",
                "name": "authType",
                "type": "select",
                "source": [
                  { "label": "None", "value": "none" },
                  { "label": "Basic Auth", "value": "basic" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "state",
                      "target": ["basicAuth.username", "basicAuth.password"],
                      "state": { "hidden": false },
                      "when": "basic"
                    }
                  ]
                }
              },
              {
                "label": "Username",
                "name": "basicAuth.username",
                "type": "input/text",
                "hidden": true
              },
              {
                "label": "Password",
                "name": "basicAuth.password",
                "type": "input/password",
                "hidden": true
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })
})
