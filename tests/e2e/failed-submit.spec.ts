import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A submit that fails validation leaves the values where they are: in the
// store, on screen next to the errors, and in the host's hands. It must not
// hand its FormData back to the form as if the host had passed it -- flat,
// keyed by the stable ids of list rows, with a scalar where a chips field keeps
// an array -- and it must not reset the form. React resets a form after every
// action it runs, whatever the action returned, and a control that restores
// itself on reset -- a checkbox, a switch, a radio group, a select -- drops
// what the user picked. Each test below is one way either shows.
//
// The host's case runs on /reactive, which holds the value a host would hold
// and offers a Reset that puts it back the way the form declared it. The rest
// run on /, where no host passes a value at all: whatever reaches the form
// there can only have come from the failed submit.

const COLORS = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
]

/** A form whose submit fails the same way every time: `must` is left empty. */
function failingForm(fields: object[], value?: object): string {
  return JSON.stringify({
    ...(value ? { value } : {}),
    sections: [
      {
        fields: [
          {
            label: 'Must',
            name: 'must',
            type: 'input/text',
            required: true,
            validation: { required: 'Must is required' },
          },
          ...fields,
        ],
      },
    ],
  })
}

async function open(page: Page, route: '/' | '/reactive', definition: string) {
  await inject(page, definition)
  await page.goto(route)
  // Only the injected definition has this field, so the client has rendered.
  await expect(page.locator('input[name="must"]')).toBeVisible()
}

async function submitAndFail(page: Page) {
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(
    page.getByText('Must is required', { exact: true })
  ).toBeVisible()
}

// What the form holds once everything the failed submit set off has run. A
// check on screen can pass in the moment before that; what reaches the action
// cannot.
async function submitAgain(page: Page) {
  await page.locator('input[name="must"]').fill('x')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('Form submitted successfully')).toBeVisible()
  return page.locator('pre code')
}

test.describe('A failed submit', { tag: ['@e2e'] }, () => {
  test('should leave the host able to put its value back', async ({ page }) => {
    await open(
      page,
      '/reactive',
      failingForm([{ label: 'Name', name: 'name', type: 'input/text' }], {
        name: 'initial',
      })
    )

    const name = page.locator('input[name="name"]')
    await expect(name).toHaveValue('initial')
    await name.fill('typed')

    await submitAndFail(page)

    // The typing stays on screen next to the error.
    await expect(name).toHaveValue('typed')

    await page.getByRole('button', { name: 'Reset values' }).click()

    await expect(name).toHaveValue('initial')
  })

  test('should keep every row its own value', async ({ page }) => {
    await open(
      page,
      '/',
      failingForm([
        {
          label: 'Items',
          name: 'items',
          type: 'list',
          fields: [{ label: 'Value', name: 'value', type: 'input/text' }],
        },
      ])
    )

    const add = page.getByRole('button', { name: 'Add item' })
    await add.click()
    await add.click()
    await page.locator('input[name="items.0.value"]').fill('A')
    await page.locator('input[name="items.1.value"]').fill('B')
    await page.locator('input[name="items.2.value"]').fill('C')

    // Removing a row that is not the last parts each survivor's stable id from
    // its position: B is row 1 at position 0, C is row 2 at position 1.
    await page.getByRole('button', { name: 'Remove Items item 1' }).click()
    const second = page.locator('input[name="items.1.value"]')
    const third = page.locator('input[name="items.2.value"]')
    await expect(second).toHaveValue('B')
    await expect(third).toHaveValue('C')

    await submitAndFail(page)

    await expect(second).toHaveValue('B')
    await expect(third).toHaveValue('C')

    const payload = await submitAgain(page)
    await expect(payload).toContainText('"C"')
  })

  test('should keep a single chips selection', async ({ page }) => {
    await open(
      page,
      '/',
      failingForm([
        { label: 'Colors', name: 'colors', type: 'chips', source: COLORS },
      ])
    )

    // The chips control submits one hidden input per selection.
    const selected = page.locator('input[type="hidden"][name="colors"]')
    await page.getByRole('button', { name: 'Red', exact: true }).click()
    await expect(selected).toHaveCount(1)

    await submitAndFail(page)

    // One selection reaches the FormData as a scalar, and a chips value is an
    // array: it has to come back as `['red']`, not as nothing.
    await expect(selected).toHaveCount(1)
    await expect(selected).toHaveValue('red')

    const payload = await submitAgain(page)
    await expect(payload).toContainText('"red"')
  })

  test('should leave a checkbox, a switch and a radio as they were', async ({
    page,
  }) => {
    await open(
      page,
      '/',
      failingForm([
        { label: 'Agree', name: 'agree', type: 'checkbox' },
        { label: 'Notify', name: 'notify', type: 'checkbox/switch' },
        { label: 'Color', name: 'color', type: 'radio', source: COLORS },
      ])
    )

    // Each of these restores its first state when its form is reset.
    const agree = page.getByRole('checkbox', { name: 'Agree' })
    const notify = page.getByRole('switch', { name: 'Notify' })
    const blue = page.getByRole('radio', { name: 'Blue' })
    await agree.click()
    await notify.click()
    await blue.click()

    await submitAndFail(page)

    await expect(agree).toBeChecked()
    await expect(notify).toBeChecked()
    await expect(blue).toBeChecked()

    const payload = await submitAgain(page)
    await expect(payload).toContainText('"agree": true')
    await expect(payload).toContainText('"notify": true')
    await expect(payload).toContainText('"color": "blue"')
  })

  test('should submit the option a select shows', async ({ page }) => {
    await open(
      page,
      '/',
      failingForm([
        { label: 'Shade', name: 'shade', type: 'select', source: COLORS },
      ])
    )

    const shade = page.getByRole('combobox')
    await shade.click()
    await page.getByRole('option', { name: 'Blue' }).click()
    await expect(shade).toHaveText('Blue')

    await submitAndFail(page)

    // The trigger and the native select behind it have to agree: a reset
    // moves the second back to the first option and leaves the first alone.
    await expect(shade).toHaveText('Blue')

    const payload = await submitAgain(page)
    await expect(payload).toContainText('"shade": "blue"')
  })
})
