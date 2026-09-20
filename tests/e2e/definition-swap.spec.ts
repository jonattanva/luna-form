import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'
import { swap } from './support/render-counters'

// A definition replaced without a remount -- the editor swapping its JSON, a
// host changing `sections` -- has to be the one the form validates, submits and
// applies, not the one each field had when it appeared. The field on screen
// always followed the new definition; what the submit checked and what an event
// read about its target did not.
//
// A placeholder marks each definition, and each test waits for it: "Initial"
// before the swap, so the first definition has rendered -- and registered --
// before it is replaced, and "Swapped" after it, so the new one has rendered
// before anything else happens. Swapping before the first render only hands the
// form the new definition from the start.
test.describe('Definition swap', { tag: ['@e2e'] }, () => {
  const form = (fields: object[]) => ({ sections: [{ fields }] })

  const email = (extra: object = {}) => ({
    name: 'email',
    label: 'Email',
    type: 'input/text',
    ...extra,
  })

  async function open(page: Page, definition: object, name: string) {
    await inject(page, JSON.stringify(definition))
    await page.goto('')
    await expect(page.locator(`[name="${name}"]`)).toHaveAttribute(
      'placeholder',
      'Initial'
    )
  }

  async function swapTo(page: Page, definition: object, name: string) {
    await swap(page, definition)
    await expect(page.locator(`[name="${name}"]`)).toHaveAttribute(
      'placeholder',
      'Swapped'
    )
  }

  async function submit(page: Page) {
    await page.getByRole('button', { name: 'Submit' }).click()
  }

  // What the submit decided, not what a field shows: a field checks its own
  // value against the schema it renders with as the value changes, so its
  // error can be on screen while the submit validates something older.
  async function expectSubmitHeldBack(page: Page) {
    await expect(
      page.getByText('There were validation errors submitting the form.')
    ).toBeVisible()
  }

  test('should require a field made required in place', async ({ page }) => {
    await open(page, form([email({ placeholder: 'Initial' })]), 'email')

    await swapTo(
      page,
      form([email({ required: true, placeholder: 'Swapped' })]),
      'email'
    )
    await expect(page.getByText('(Optional)')).toHaveCount(0)

    await submit(page)
    await expectSubmitHeldBack(page)
    await expect(page.locator('[id="email-error"]')).toBeVisible()
  })

  test('should not require a field made optional in place', async ({
    page,
  }) => {
    await open(
      page,
      form([email({ required: true, placeholder: 'Initial' })]),
      'email'
    )

    await swapTo(page, form([email({ placeholder: 'Swapped' })]), 'email')
    await expect(page.getByText('(Optional)')).toBeVisible()

    await submit(page)
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
  })

  // A new definition registers the field again, and that is all it does: what
  // takes a field out, and its value with it, is the field going, not its
  // definition changing.
  test('should keep what was typed through a swap', async ({ page }) => {
    await open(page, form([email({ placeholder: 'Initial' })]), 'email')
    await page.locator('input[name="email"]').fill('kept@example.com')

    await swapTo(
      page,
      form([email({ required: true, placeholder: 'Swapped' })]),
      'email'
    )
    await expect(page.locator('input[name="email"]')).toHaveValue(
      'kept@example.com'
    )

    await submit(page)
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"email": "kept@example.com"'
    )
  })

  test('should validate a field that becomes an email in place as one', async ({
    page,
  }) => {
    await open(page, form([email({ placeholder: 'Initial' })]), 'email')

    await swapTo(
      page,
      form([email({ type: 'input/email', placeholder: 'Swapped' })]),
      'email'
    )
    await page.locator('input[name="email"]').fill('abc')

    await submit(page)
    await expectSubmitHeldBack(page)
    await expect(page.locator('[id="email-error"]')).toBeVisible()
  })

  test('should check a pattern added in place', async ({ page }) => {
    await open(page, form([email({ placeholder: 'Initial' })]), 'email')

    await swapTo(
      page,
      form([
        email({
          placeholder: 'Swapped',
          validation: {
            pattern: { regex: '^[0-9]+$', message: 'Digits only' },
          },
        }),
      ]),
      'email'
    )
    await page.locator('input[name="email"]').fill('abc')

    await submit(page)
    await expectSubmitHeldBack(page)
    await expect(page.getByText('Digits only', { exact: true })).toBeVisible()
  })

  test('should require a field in a list row made required in place', async ({
    page,
  }) => {
    const items = (extra: object) =>
      form([
        {
          name: 'items',
          label: 'Items',
          type: 'list',
          fields: [
            { name: 'code', label: 'Code', type: 'input/text', ...extra },
          ],
        },
      ])

    await open(page, items({ placeholder: 'Initial' }), 'items.0.code')

    await swapTo(
      page,
      items({ required: true, placeholder: 'Swapped' }),
      'items.0.code'
    )

    await submit(page)
    await expectSubmitHeldBack(page)
    await expect(page.locator('[id="items.0.code-error"]')).toBeVisible()
  })

  test('should transform an auto-filled value the way its target now declares', async ({
    page,
  }) => {
    const source = {
      name: 'source',
      label: 'Source',
      type: 'input/text',
      event: {
        change: [{ action: 'value', value: { 'field/target': '{value}' } }],
      },
    }
    const target = (extra: object) => ({
      name: 'target',
      label: 'Target',
      type: 'input/text',
      ...extra,
    })

    await open(
      page,
      form([source, target({ placeholder: 'Initial' })]),
      'target'
    )

    await swapTo(
      page,
      form([
        source,
        target({
          placeholder: 'Swapped',
          advanced: { transform: 'uppercase' },
        }),
      ]),
      'target'
    )
    await page.locator('input[name="source"]').fill('abc')

    await expect(page.locator('input[name="target"]')).toHaveValue('ABC')
  })

  // A definition that puts another list where one was must not hand the new
  // one the rows of the old. `SlotBase` keyed its slots by position, so React
  // reused the instance and everything `useFieldList` keeps in state came with
  // it: the rows, the counter that hands out their ids, and which of them are
  // open. A list only initialises that state when it mounts.
  test('should start a list swapped for another with its own rows', async ({
    page,
  }) => {
    const list = (name: string, rows: number, placeholder: string) => ({
      value: {
        [name]: Array.from({ length: rows }, (_, index) => ({
          v: String(index),
        })),
      },
      sections: [
        {
          fields: [
            {
              name,
              label: name,
              type: 'list',
              fields: [
                { name: 'v', label: 'V', type: 'input/text', placeholder },
              ],
            },
          ],
        },
      ],
    })

    await inject(page, JSON.stringify(list('alpha', 3, 'Initial')))
    await page.goto('')
    await expect(page.locator('input[name^="alpha."]')).toHaveCount(3)

    await swap(page, list('beta', 1, 'Swapped'))

    await expect(page.locator('input[name^="beta."]')).toHaveCount(1)
  })
})
