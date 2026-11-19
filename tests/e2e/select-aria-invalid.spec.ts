import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

// The form hands every input `aria-invalid` and `aria-errormessage` once its
// value is rejected. The editor's select passes them to the select's root
// rather than to the button that takes focus, so the control a screen reader
// lands on never says it is invalid.

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
      ],
    },
  ],
})

test.describe('A required select left empty', { tag: ['@e2e'] }, () => {
  // Audit U-01: the combobox carries neither attribute. Drop .fail once fixed.
  test.fail('says it is invalid and where its message is', async ({ page }) => {
    await inject(page, FORM)
    await page.goto('/')
    // Only the injected definition has this field, so the client has rendered.
    await expect(page.locator('input[name="name"]')).toBeVisible()

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('#color-error')).toBeVisible()

    const combobox = page.getByRole('combobox', { name: /Color/ })
    await expect(combobox).toHaveAttribute('aria-invalid', 'true')
    await expect(combobox).toHaveAttribute('aria-errormessage', 'color-error')
  })
})
