import { expect, test, type Locator } from '@playwright/test'
import { inject } from './support/inject'
import { captureValueChanges, lastEventFor } from './support/value-changes'

// Types `text` with the caret at `position`. The caret is put there directly,
// because `End` does not reach the end of a text input in every engine (WebKit
// on macOS), and the text goes through the keyboard, because
// `pressSequentially` moves the caret to the start of an input it focuses.
async function typeAt(input: Locator, position: number, text: string) {
  await input.focus()
  await input.evaluate(
    (element: HTMLInputElement, at) => element.setSelectionRange(at, at),
    position
  )
  await input.page().keyboard.type(text)
}

// A list of keys copied from a payload: the transform rewrites what is typed
// into a key, and a key stored in camelCase has to survive it.
function keysList(keys: string[]) {
  return JSON.stringify({
    value: { keys: keys.map((key) => ({ key })) },
    sections: [
      {
        fields: [
          {
            label: 'Keys',
            name: 'keys',
            type: 'list',
            advanced: { action: 'Add key' },
            fields: [
              {
                name: 'key',
                type: 'input/text',
                advanced: {
                  transform: ['remove-space', 'lowercase', 'remove-accent'],
                },
              },
            ],
          },
        ],
      },
    ],
  })
}

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

  // A transform rewrites what the user types and what a `value` event writes.
  // A value the form receives was written by its host, as it is meant to be
  // stored: it is shown the way it arrives, and what the user types into it is
  // rewritten while the rest stays as it came.
  test('should keep an initial value from JSON as it arrives, and rewrite only what the user types', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "localUppercase": "hello world"
        },
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
    await expect(input).toHaveValue('hello world')
    await typeAt(input, 'hello world'.length, 'x')
    await expect(input).toHaveValue('hello worldX')
  })

  // Judged by what the form sends: a field shows its `defaultValue` as declared
  // until it holds a value of its own, so the screen alone proves nothing.
  test('should keep a defaultValue as the definition declares it', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "defaultValue": "hello world",
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

    await expect(page.locator('input[name="localUppercase"]')).toHaveValue(
      'hello world'
    )
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"localUppercase": "hello world"'
    )
  })

  // Typing into a stored value rewrites what the user types and leaves the rest
  // as it was. The caret stays where they typed, so the next key lands next to
  // the last one and not at the end.
  test('should keep the caret where the user types into a stored value', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "key": "customerEmail"
        },
        "sections": [
          {
            "fields": [
              {
                "name": "key",
                "type": "input/text",
                "advanced": {
                  "transform": ["remove-space", "lowercase", "remove-accent"]
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const input = page.locator('input[name="key"]')
    await expect(input).toHaveValue('customerEmail')
    await typeAt(input, 'customer'.length, 'Primary')
    await expect(input).toHaveValue('customerprimaryEmail')
  })

  // A key the host stored in camelCase, touched without changing it: a letter
  // typed and erased. Rewriting the whole text would store `customeremail`,
  // which no longer matches what the other app sends.
  test('should keep a stored value as it was once a letter is typed and erased', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "value": {
          "key": "customerEmail"
        },
        "sections": [
          {
            "fields": [
              {
                "name": "key",
                "type": "input/text",
                "advanced": {
                  "transform": ["remove-space", "lowercase", "remove-accent"]
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const input = page.locator('input[name="key"]')
    await typeAt(input, 'customerEmail'.length, 'X')
    await expect(input).toHaveValue('customerEmailx')
    await page.keyboard.press('Backspace')
    await expect(input).toHaveValue('customerEmail')

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"key": "customerEmail"'
    )
  })

  // A `defaultValue` is the text the field shows, so what the user types into
  // it is rewritten and the declared text is not.
  test('should rewrite only what the user types after a defaultValue', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "defaultValue": "hello world",
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
    await typeAt(input, 'hello world'.length, 'x')
    await expect(input).toHaveValue('hello worldX')
  })

  test('should keep the caret in place when the transform drops what was typed', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "name": "key",
                "type": "input/text",
                "advanced": {
                  "transform": ["remove-space", "lowercase"]
                }
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const input = page.locator('input[name="key"]')
    await input.fill('customeremail')
    await typeAt(input, 'customer'.length, ' X')
    await expect(input).toHaveValue('customerxemail')
  })

  // A list reports every row it holds when one is added or removed. A row the
  // host stored in a shape the transform would rewrite, such as the camelCase
  // key of a payload, has to reach the host as it was stored, not rewritten.
  test('should keep a stored list row as it is when another row is added', async ({
    page,
  }) => {
    const events = captureValueChanges(page)
    await inject(page, keysList(['customerEmail']))
    await page.goto('')

    await expect(page.locator('input[name="keys.0.key"]')).toHaveValue(
      'customerEmail'
    )
    await page.getByRole('button', { name: 'Add key' }).click()

    await expect
      .poll(() => lastEventFor(events, 'keys')?.value)
      .toEqual([{ key: 'customerEmail' }, {}])
    await expect(page.locator('input[name="keys.0.key"]')).toHaveValue(
      'customerEmail'
    )
  })

  // Removing also reports each row left by its position, and a host that feeds
  // every report back, as `/reactive` does, hands each one in again.
  test('should keep a stored list row as it is when another row is removed', async ({
    page,
  }) => {
    const events = captureValueChanges(page)
    await inject(page, keysList(['firstName', 'customerEmail']))
    await page.goto('/reactive')

    await expect(page.locator('input[name="keys.1.key"]')).toHaveValue(
      'customerEmail'
    )
    await page.getByRole('button', { name: 'Remove Keys item 1' }).click()

    await expect
      .poll(() => lastEventFor(events, 'keys')?.value)
      .toEqual([{ key: 'customerEmail' }])
    await expect
      .poll(() => lastEventFor(events, 'keys.0.key')?.value)
      .toBe('customerEmail')
    await expect(page.locator('input[name="keys.1.key"]')).toHaveValue(
      'customerEmail'
    )
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
