import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const single = (value: string) => `{
  "value": ${value},
  "sections": [
    {
      "fields": [
        {
          "label": "Data type",
          "name": "data_type",
          "type": "chips",
          "advanced": { "multiple": false },
          "source": [
            { "label": "None", "value": "none" },
            { "label": "Custom JSON", "value": "advanced" }
          ],
          "event": {
            "change": [
              {
                "action": "state",
                "target": ["advanced_body"],
                "state": { "hidden": false },
                "when": "advanced"
              }
            ]
          }
        },
        {
          "label": "Advanced body",
          "name": "advanced_body",
          "type": "input/text",
          "hidden": true
        }
      ]
    }
  ]
}`

const multiple = (value: string) => `{
  "value": ${value},
  "sections": [
    {
      "fields": [
        {
          "label": "Channels",
          "name": "channels",
          "type": "chips",
          "source": [
            { "label": "Email", "value": "email" },
            { "label": "SMS", "value": "sms" },
            { "label": "Push", "value": "push" }
          ],
          "event": {
            "change": [
              {
                "action": "state",
                "target": ["sms_number"],
                "state": { "hidden": false },
                "when": ["sms"]
              }
            ]
          }
        },
        {
          "label": "SMS number",
          "name": "sms_number",
          "type": "input/text",
          "hidden": true
        }
      ]
    }
  ]
}`

test.describe('Initial value chips state event', { tag: ['@e2e'] }, () => {
  test('should reveal the target when the form opens on a matching single chips value', async ({
    page,
  }) => {
    await inject(page, single(`{ "data_type": ["advanced"] }`))
    await page.goto('/reactive')

    await expect(page.locator('input[name="advanced_body"]')).toBeVisible()
  })

  test('should keep the target hidden when the saved single chips value does not match', async ({
    page,
  }) => {
    await inject(page, single(`{ "data_type": ["none"] }`))
    await page.goto('/reactive')

    await expect(page.getByRole('button', { name: 'None' })).toBeVisible()
    await expect(page.locator('input[name="advanced_body"]')).toBeHidden()
  })

  test('should keep the value the revealed target was reopened on', async ({
    page,
  }) => {
    await inject(
      page,
      single(`{ "data_type": ["advanced"], "advanced_body": "{ \\"a\\": 1 }" }`)
    )
    await page.goto('/reactive')

    await expect(page.locator('input[name="advanced_body"]')).toHaveValue(
      '{ "a": 1 }'
    )
  })

  test('should reveal the target when the chip is clicked', async ({
    page,
  }) => {
    await inject(page, single(`{}`))
    await page.goto('/reactive')

    const target = page.locator('input[name="advanced_body"]')
    await expect(target).toBeHidden()

    await page.getByRole('button', { name: 'Custom JSON' }).click()

    await expect(target).toBeVisible()
  })

  test('should reveal the target when the chips are clicked into a multiple selection', async ({
    page,
  }) => {
    await inject(page, multiple(`{}`))
    await page.goto('/reactive')

    const target = page.locator('input[name="sms_number"]')
    await expect(target).toBeHidden()

    await page.getByRole('button', { name: 'Email' }).click()
    await page.getByRole('button', { name: 'SMS' }).click()

    await expect(target).toBeVisible()
  })

  test('should reveal the target when the form opens on a matching multiple chips value', async ({
    page,
  }) => {
    await inject(page, multiple(`{ "channels": ["email", "sms"] }`))
    await page.goto('/reactive')

    await expect(page.locator('input[name="sms_number"]')).toBeVisible()
  })

  test('should keep the target hidden when no entry of a multiple chips value matches', async ({
    page,
  }) => {
    await inject(page, multiple(`{ "channels": ["email", "push"] }`))
    await page.goto('/reactive')

    await expect(page.getByRole('button', { name: 'Email' })).toBeVisible()
    await expect(page.locator('input[name="sms_number"]')).toBeHidden()
  })

  test('should reveal the target when a multiple chips value holds only the match', async ({
    page,
  }) => {
    await inject(page, multiple(`{ "channels": ["sms"] }`))
    await page.goto('/reactive')

    await expect(page.locator('input[name="sms_number"]')).toBeVisible()
  })
})
