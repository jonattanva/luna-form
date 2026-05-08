import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Input Transform', { tag: ['@e2e'] }, () => {
  test('should apply uppercase transform on typing', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "name": "localUppercase",
                "type": "input/text",
                "advanced": {
                  "transform": "uppercase"
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const input = page.locator('input[name="localUppercase"]')
    await input.fill('hello world')
    // We expect the value to instantly transform
    await expect(input).toHaveValue('HELLO WORLD')
  })

  test('should apply lowercase transform on typing', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "name": "localLowercase",
                "type": "input/text",
                "advanced": {
                  "transform": "lowercase"
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const input = page.locator('input[name="localLowercase"]')
    await input.fill('HELLO World')
    await expect(input).toHaveValue('hello world')
  })

  test('should apply remove-space transform on typing', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "name": "localRemoveSpace",
                "type": "input/text",
                "advanced": {
                  "transform": "remove-space"
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const input = page.locator('input[name="localRemoveSpace"]')
    await input.fill(' hello world ')
    await expect(input).toHaveValue('helloworld')
  })

  test('should apply remove-accent transform on typing', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "name": "localRemoveAccent",
                "type": "input/text",
                "advanced": {
                  "transform": "remove-accent"
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const input = page.locator('input[name="localRemoveAccent"]')
    await input.fill('éåïöü')
    await expect(input).toHaveValue('eaiou')
  })

  test('should apply multiple transforms', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "name": "multiple",
                "type": "input/text",
                "advanced": {
                  "transform": ["remove-space", "uppercase", "remove-accent"]
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const input = page.locator('input[name="multiple"]')
    await input.fill(' a b ç d é f ')
    await expect(input).toHaveValue('ABCDEF')
  })

  test('should apply transforms on incoming events from other fields', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "name": "sourceField",
                "type": "input/text",
                "event": {
                  "change": [
                    {
                      "action": "value",
                      "value": {
                        "targetTransform": "{value}"
                      }
                    }
                  ]
                }
              },
              {
                "name": "targetTransform",
                "type": "input/text",
                "advanced": {
                  "transform": ["remove-space", "uppercase"]
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const source = page.locator('input[name="sourceField"]')
    const target = page.locator('input[name="targetTransform"]')

    await source.fill(' h e ll o ')
    await expect(target).toHaveValue('HELLO')
  })
})
