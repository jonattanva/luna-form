import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Form action handling', { tag: ['@e2e'] }, () => {
  test('should submit successfully with text and checkbox', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Full Name",
                            "name": "name",
                            "type": "input/text",
                            "required": true
                        },
                        {
                            "label": "Accept Terms",
                            "name": "terms",
                            "type": "checkbox",
                            "required": true
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await page.getByLabel('Full Name').fill('Jane Doe')
    await page.getByLabel('Accept Terms').click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      name: 'Jane Doe',
      terms: 'on',
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )
  })

  test('should submit with radio group', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Gender",
                            "name": "gender",
                            "type": "radio",
                            "source": [
                                { "label": "Male", "value": "m" },
                                { "label": "Female", "value": "f" }
                            ],
                            "required": true
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await page.getByText('Female').click()
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      gender: 'f',
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )
  })

  test('should submit a multi-field form and validate toast content', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Email",
                            "name": "email",
                            "type": "input/email",
                            "required": true
                        },
                        {
                            "label": "Message",
                            "name": "content",
                            "type": "textarea",
                            "required": true
                        },
                        {
                            "label": "Accept Terms",
                            "name": "terms",
                            "type": "checkbox",
                            "required": true
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Message').fill('Hello World')
    await page.getByLabel('Accept Terms').click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()

    const submittedData = {
      email: 'test@example.com',
      content: 'Hello World',
      terms: 'on',
    }

    await expect(page.locator('pre code')).toContainText(
      JSON.stringify(submittedData, null, 2)
    )
  })
})
