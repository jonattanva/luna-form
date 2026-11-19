import { expect, test, type Locator, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A submit that fails validation moves the focus to the first field holding an
// error, in the order of the page, as a browser does for its own validation:
// the message at the top says something is wrong, and the focus says where. A
// field kept off the screen by a collapsed section or row is opened first. A
// control that cannot take the focus itself, such as a group of buttons, hands
// it to the first one inside. A submit made while the focus is somewhere else
// on the page leaves it there.
//
// All on /, where no host holds the values.

const COLORS = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
]

function required(name: string, type = 'input/text', extra: object = {}) {
  return {
    label: name.toUpperCase(),
    name,
    required: true,
    type,
    validation: { required: `${name} is required` },
    ...extra,
  }
}

function form(sections: object[], value?: object): string {
  return JSON.stringify({ ...(value ? { value } : {}), sections })
}

async function open(
  page: Page,
  definition: string,
  ready: (page: Page) => Locator
) {
  await inject(page, definition)
  await page.goto('/')
  // Only the injected definition has this control, so the client has rendered.
  await expect(ready(page)).toBeVisible()
}

async function submitAndFail(page: Page) {
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(
    page.getByText('There were validation errors submitting the form.')
  ).toBeVisible()
}

test.describe('Focus after a failed submit', { tag: ['@e2e'] }, () => {
  test('should move the focus to the first field holding an error', async ({
    page,
  }) => {
    const names = Array.from({ length: 12 }, (_, index) => `f${index + 1}`)
    await open(
      page,
      form([{ fields: names.map((name) => required(name)) }]),
      (page) => page.locator('input[name="f1"]')
    )
    await page.locator('input[name="f1"]').fill('one')
    await page.locator('input[name="f2"]').fill('two')

    await submitAndFail(page)

    await expect(page.locator('input[name="f3"]')).toBeFocused()
  })

  test('should move the focus on a submit made with Enter', async ({
    page,
  }) => {
    await open(
      page,
      form([{ fields: [required('first'), required('last')] }]),
      (page) => page.locator('input[name="first"]')
    )
    const last = page.locator('input[name="last"]')
    await last.fill('Lovelace')
    await last.press('Enter')

    await expect(page.getByText('first is required')).toBeVisible()
    await expect(page.locator('input[name="first"]')).toBeFocused()
  })

  test('should move the focus again on every failed submit', async ({
    page,
  }) => {
    await open(
      page,
      form([{ fields: [required('first'), required('last')] }]),
      (page) => page.locator('input[name="first"]')
    )

    await submitAndFail(page)
    await expect(page.locator('input[name="first"]')).toBeFocused()

    await page.locator('input[name="first"]').fill('Ada')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('input[name="last"]')).toBeFocused()
  })

  test('should open a collapsed section to focus the field inside', async ({
    page,
  }) => {
    await open(
      page,
      form([
        { fields: [{ label: 'Name', name: 'name', type: 'input/text' }] },
        {
          advanced: { collapsible: true },
          fields: [required('token')],
          title: 'Advanced Options',
        },
      ]),
      (page) => page.locator('input[name="name"]')
    )
    await page.locator('input[name="name"]').fill('Ada')

    await submitAndFail(page)

    const token = page.locator('input[name="token"]')
    await expect(token).toBeVisible()
    await expect(token).toBeFocused()
  })

  test('should open a collapsed row to focus the field inside', async ({
    page,
  }) => {
    await open(
      page,
      form(
        [
          {
            fields: [
              {
                advanced: { collapsed: true },
                fields: [
                  { label: 'A', name: 'a', type: 'input/text' },
                  required('b'),
                ],
                label: 'Items',
                name: 'items',
                type: 'list',
              },
            ],
          },
        ],
        { items: [{ a: 'one' }] }
      ),
      (page) => page.getByRole('button', { name: 'Expand Items 1' })
    )

    await submitAndFail(page)

    const b = page.getByRole('textbox', { name: 'B' })
    await expect(b).toBeVisible()
    await expect(b).toBeFocused()
  })

  test('should focus the first button of a group of chips', async ({
    page,
  }) => {
    await open(
      page,
      form([
        {
          fields: [
            { label: 'Name', name: 'name', type: 'input/text' },
            required('colors', 'chips', { source: COLORS }),
            required('after'),
          ],
        },
      ]),
      (page) => page.locator('input[name="name"]')
    )

    await submitAndFail(page)

    await expect(page.getByRole('button', { name: 'Red' })).toBeFocused()
  })

  test('should focus a select drawn by the host', async ({ page }) => {
    await open(
      page,
      form([
        {
          fields: [
            { label: 'Name', name: 'name', type: 'input/text' },
            required('color', 'select', { source: COLORS }),
            required('after'),
          ],
        },
      ]),
      (page) => page.locator('input[name="name"]')
    )

    await submitAndFail(page)

    await expect(page.getByRole('combobox', { name: 'COLOR' })).toBeFocused()
  })

  // A component that does not forward the `id` is still reached through the
  // `aria-errormessage` the form hands it along with the error.
  test('should find a field without its id by its error message', async ({
    page,
  }) => {
    await open(
      page,
      form([{ fields: [required('first'), required('last')] }]),
      (page) => page.locator('input[name="first"]')
    )
    await page.locator('input[name="first"]').evaluate((input) => {
      input.removeAttribute('id')
    })

    await submitAndFail(page)

    const first = page.locator('input[name="first"]')
    await expect(first).toHaveAttribute('aria-errormessage', 'first-error')
    await expect(first).not.toHaveAttribute('id')
    await expect(first).toBeFocused()
  })

  test('should leave the focus outside the form where it is', async ({
    page,
  }) => {
    await open(
      page,
      form([{ fields: [required('first'), required('last')] }]),
      (page) => page.locator('input[name="first"]')
    )

    // A submit made by code, as an agent makes one, while the person is
    // working on something else on the page.
    await page.evaluate(() => {
      const outside = document.createElement('input')
      outside.id = 'outside'
      document.body.append(outside)
      outside.focus()
      const submit = Array.from(document.querySelectorAll('button')).find(
        (button) => button.textContent === 'Submit'
      )
      submit?.form?.requestSubmit(submit)
    })

    await expect(page.getByText('first is required')).toBeVisible()
    await expect(page.locator('#outside')).toBeFocused()
  })
})
