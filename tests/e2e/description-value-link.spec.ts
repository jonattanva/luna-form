import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

// A description is interpolated before its markdown links are read, so a value
// in it is read as markdown too: whatever a person types, the host hands over
// or an agent fills shows up as a live link inside the form.

const FORM = JSON.stringify({
  sections: [
    {
      fields: [
        { label: 'Name', name: 'name', type: 'input/text' },
        {
          description: 'You entered: {value}',
          label: 'Code',
          name: 'code',
          type: 'input/text',
        },
      ],
    },
  ],
})

const TYPED = '[Verify your account](https://attacker.example/login)'

test.describe('A value in a description', { tag: ['@e2e'] }, () => {
  // Audit SEC-01: the typed value renders as an `<a href>` to the attacker's
  // url. Drop .fail once fixed.
  test.fail('is shown as text, not as a link', async ({ page }) => {
    await inject(page, FORM)
    await page.goto('/')
    // Only the injected definition has this field, so the client has rendered.
    await expect(page.locator('input[name="name"]')).toBeVisible()

    await page.locator('input[name="code"]').fill(TYPED)

    await expect(page.getByText(`You entered: ${TYPED}`)).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Verify your account' })
    ).toHaveCount(0)
  })
})
