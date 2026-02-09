import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Form translation', { tag: ['@e2e'] }, () => {
  test('should translate labels and validation messages to Spanish', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "es",
            "translations": {
                "es": {
                    "email_label": "Correo electrónico",
                    "email_req": "El correo es obligatorio",
                    "email_desc": "Ingresa tu correo personal",
                    "email_place": "ejemplo@correo.com"
                }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "email_label",
                            "name": "email",
                            "type": "input/email",
                            "required": true,
                            "description": "email_desc",
                            "placeholder": "email_place",
                            "validation": {
                                "required": "email_req"
                            }
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    // Check translated label
    await expect(
      page.getByLabel('Correo electrónico', { exact: false })
    ).toBeVisible()

    // Check translated description
    await expect(page.getByText('Ingresa tu correo personal')).toBeVisible()

    // Check translated placeholder
    const input = page.locator('input[name="email"]')
    await expect(input).toHaveAttribute('placeholder', 'ejemplo@correo.com')

    // Trigger validation
    await input.fill('')
    await input.blur()

    // Check translated validation message
    await expect(page.getByText('El correo es obligatorio')).toBeVisible()
  })

  test('should fallback to key if translation is missing', async ({ page }) => {
    await inject(
      page,
      `{
            "lang": "fr",
            "translations": {
                "es": {
                    "email_label": "Correo electrónico"
                }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "email_label",
                            "name": "email",
                            "type": "input/email"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    // Should show the key because "fr" is not defined or key is not in "fr"
    await expect(page.getByLabel('email_label', { exact: false })).toBeVisible()
  })

  test('should translate custom validation messages', async ({ page }) => {
    await inject(
      page,
      `{
            "lang": "es",
            "translations": {
                "es": {
                    "pass_label": "Contraseña",
                    "confirm_label": "Confirmar contraseña",
                    "match_error": "Las contraseñas no coinciden"
                }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "pass_label",
                            "name": "password",
                            "type": "input/password"
                        },
                        {
                            "label": "confirm_label",
                            "name": "confirm",
                            "type": "input/password",
                            "validation": {
                                "custom": {
                                    "field": "password",
                                    "message": "match_error",
                                    "operator": "eq"
                                }
                            }
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const passwordInput = page.locator('input[name="password"]')
    const confirmInput = page.locator('input[name="confirm"]')

    await passwordInput.fill('password123')
    await confirmInput.fill('password456')
    await confirmInput.blur()

    const message = page.getByText('Las contraseñas no coinciden', {
      exact: true,
    })
    await expect(message).toBeVisible()

    await confirmInput.fill('password123')
    await confirmInput.blur()
    await expect(message).toBeHidden()
  })
})
