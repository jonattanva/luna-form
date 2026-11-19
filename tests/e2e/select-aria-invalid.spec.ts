import { expect, test, type Locator, type Page } from '@playwright/test'
import { inject } from './support/inject'

// The form hands every input `aria-invalid` and `aria-errormessage` once its
// value is rejected. A control drawn by a UI library has to pass them on to the
// element that takes focus -- the select's button, the time zone's input, the
// chips' group -- or the control a screen reader lands on never says it is
// invalid, and no test can check its error state.

const FORM = JSON.stringify({
  sections: [
    {
      fields: [
        { label: 'Name', name: 'name', type: 'input/text' },
        {
          label: 'Color',
          name: 'color',
          required: true,
          source: [
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue' },
          ],
          type: 'select',
        },
        {
          label: 'Zone',
          name: 'zone',
          required: true,
          type: 'select/timezone',
        },
        {
          label: 'Priority',
          name: 'priority',
          required: true,
          source: [
            { label: 'Low', value: 'low' },
            { label: 'High', value: 'high' },
          ],
          type: 'chips',
        },
      ],
    },
  ],
})

async function submitEmpty(page: Page) {
  await inject(page, FORM)
  await page.goto('/')
  // Only the injected definition has this field, so the client has rendered.
  await expect(page.locator('input[name="name"]')).toBeVisible()

  await page.getByRole('button', { name: 'Submit' }).click()
}

async function expectInvalid(control: Locator, name: string) {
  await expect(control).toHaveAttribute('aria-invalid', 'true')
  await expect(control).toHaveAttribute('aria-errormessage', `${name}-error`)
}

test.describe('Required controls left empty', { tag: ['@e2e'] }, () => {
  test('the select says it is invalid and where its message is', async ({
    page,
  }) => {
    await submitEmpty(page)
    await expect(page.locator('#color-error')).toBeVisible()

    await expectInvalid(page.getByRole('combobox', { name: /Color/ }), 'color')
  })

  test('the time zone says it is invalid and where its message is', async ({
    page,
  }) => {
    await submitEmpty(page)
    await expect(page.locator('#zone-error')).toBeVisible()

    await expectInvalid(page.getByRole('combobox', { name: /Zone/ }), 'zone')
  })

  test('the chips say they are invalid and where their message is', async ({
    page,
  }) => {
    await submitEmpty(page)
    await expect(page.locator('#priority-error')).toBeVisible()

    await expectInvalid(
      page.getByRole('group', { name: /Priority/ }),
      'priority'
    )
  })
})
