import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

// A description's markdown links are read from what the author wrote, before
// `{value}` is resolved, so whatever a person types, the host hands over or an
// agent fills is shown as text and never becomes a link inside the form.

function form(description: string) {
  return JSON.stringify({
    sections: [
      {
        fields: [
          { label: 'Name', name: 'name', type: 'input/text' },
          {
            description,
            label: 'Code',
            name: 'code',
            type: 'input/text',
          },
        ],
      },
    ],
  })
}

const TYPED = '[Verify your account](https://attacker.example/login)'

test.describe('A value in a description', { tag: ['@e2e'] }, () => {
  test('is shown as text, not as a link', async ({ page }) => {
    await inject(page, form('You entered: {value}'))
    await page.goto('/')
    // Only the injected definition has this field, so the client has rendered.
    await expect(page.locator('input[name="name"]')).toBeVisible()

    await page.locator('input[name="code"]').fill(TYPED)

    await expect(page.getByText(`You entered: ${TYPED}`)).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Verify your account' })
    ).toHaveCount(0)
  })

  test('leaves the links the author wrote working', async ({ page }) => {
    await inject(
      page,
      form('See [the guide](https://docs.example.com) for {value}')
    )
    await page.goto('/')
    await expect(page.locator('input[name="name"]')).toBeVisible()

    await page.locator('input[name="code"]').fill(TYPED)

    const guide = page.getByRole('link', { name: 'the guide' })
    await expect(guide).toHaveAttribute('href', 'https://docs.example.com')
    await expect(page.getByText(`for ${TYPED}`)).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Verify your account' })
    ).toHaveCount(0)
  })
})
