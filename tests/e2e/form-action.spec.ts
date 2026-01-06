import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Form action handling', { tag: ['@e2e'] }, () => {
  test('should show success toast when validation passes', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Name",
                            "name": "name",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await page.getByLabel('Name').fill('John Doe')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByText('Your form has been processed.')).toBeVisible()
  })
})
