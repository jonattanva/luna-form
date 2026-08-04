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
    await expect(
      page.getByText('Ingresa tu correo personal', { exact: true })
    ).toBeVisible()

    // Check translated placeholder
    const input = page.locator('input[name="email"]')
    await expect(input).toHaveAttribute('placeholder', 'ejemplo@correo.com')

    // Trigger validation
    await input.fill('')
    await input.blur()

    // Check translated validation message
    await expect(
      page.getByText('El correo es obligatorio', { exact: true })
    ).toBeVisible()
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

  test('should translate the title and description of a default section', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "es",
            "translations": {
                "es": {
                    "section_title": "Datos personales",
                    "section_desc": "Completa tu información básica",
                    "name_label": "Nombre"
                }
            },
            "sections": [
                {
                    "title": "section_title",
                    "description": "section_desc",
                    "fields": [
                        {
                            "label": "name_label",
                            "name": "name",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('/reactive')

    const fieldset = page.locator('[data-slot="field-set"]')

    await expect(fieldset.locator('legend')).toHaveText('Datos personales')
    await expect(
      fieldset.getByText('Completa tu información básica', { exact: true })
    ).toBeVisible()
  })

  test('should translate the title and description of an advanced section', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "es",
            "translations": {
                "es": {
                    "advanced_title": "Opciones avanzadas",
                    "advanced_desc": "Ajustes para usuarios expertos",
                    "debug_label": "Modo depuración"
                }
            },
            "sections": [
                {
                    "advanced": { "collapsible": true },
                    "title": "advanced_title",
                    "description": "advanced_desc",
                    "fields": [
                        {
                            "label": "debug_label",
                            "name": "debug",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('/reactive')

    const fieldset = page.locator('[data-advanced="true"]')
    await expect(fieldset).toHaveAttribute('data-expanded', 'false')

    const toggle = fieldset.getByRole('button', { name: 'Opciones avanzadas' })
    await expect(toggle).toBeVisible()

    await toggle.click()
    await expect(fieldset).toHaveAttribute('data-expanded', 'true')

    await expect(
      fieldset.getByText('Ajustes para usuarios expertos', { exact: true })
    ).toBeVisible()
  })

  test('should fallback to the key when the section translation is missing', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "fr",
            "translations": {
                "es": {
                    "section_title": "Datos personales"
                }
            },
            "sections": [
                {
                    "title": "section_title",
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

    await page.goto('/reactive')

    const fieldset = page.locator('[data-slot="field-set"]')
    await expect(fieldset.locator('legend')).toHaveText('section_title')
  })
})

test.describe('List translation', { tag: ['@e2e'] }, () => {
  test('should translate the label and description of a list', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "es",
            "translations": {
                "es": {
                    "list_label": "¿Qué contiene cada elemento?",
                    "list_desc": "Define la información que esperas para cada elemento",
                    "title_label": "Título"
                }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "description": "list_desc",
                            "label": "list_label",
                            "name": "properties",
                            "type": "list",
                            "fields": [
                                {
                                    "label": "title_label",
                                    "name": "title",
                                    "type": "input/text"
                                }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('/reactive')

    const fieldset = page.locator('#properties')

    await expect(fieldset.locator('legend')).toHaveText(
      '¿Qué contiene cada elemento?'
    )
    await expect(
      fieldset.getByText(
        'Define la información que esperas para cada elemento',
        { exact: true }
      )
    ).toBeVisible()
  })

  test('should fall back to the key when the list translation is missing', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "es",
            "translations": {
                "es": { "title_label": "Título" }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "description": "list_desc",
                            "label": "list_label",
                            "name": "properties",
                            "type": "list",
                            "fields": [
                                {
                                    "label": "title_label",
                                    "name": "title",
                                    "type": "input/text"
                                }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('/reactive')

    const fieldset = page.locator('#properties')

    await expect(fieldset.locator('legend')).toHaveText('list_label')
    await expect(fieldset.getByText('list_desc', { exact: true })).toBeVisible()
  })

  test('should translate the custom action of the add button', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "es",
            "translations": {
                "es": { "action_add": "Añadir propiedad" }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": { "action": "action_add" },
                            "label": "Propiedades",
                            "name": "properties",
                            "type": "list",
                            "fields": [
                                {
                                    "label": "Título",
                                    "name": "title",
                                    "type": "input/text"
                                }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('/reactive')

    await expect(
      page.getByRole('button', { name: 'Añadir propiedad' })
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'action_add' })).toHaveCount(
      0
    )
  })

  test('should translate the built-in label of the add button', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "es",
            "translations": {
                "es": { "Add item": "Añadir elemento" }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Propiedades",
                            "name": "properties",
                            "type": "list",
                            "fields": [
                                {
                                    "label": "Título",
                                    "name": "title",
                                    "type": "input/text"
                                }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('/reactive')

    await expect(
      page.getByRole('button', { name: 'Añadir elemento' })
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add item' })).toHaveCount(0)
  })

  // `fr` on purpose: the library ships no built-in dictionary for it, so this
  // exercises the bare fallback to the English source text.
  test('should keep the built-in add button label when nothing translates it', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "fr",
            "translations": {
                "fr": { "list_label": "Propriétés" }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "list_label",
                            "name": "properties",
                            "type": "list",
                            "fields": [
                                {
                                    "label": "Título",
                                    "name": "title",
                                    "type": "input/text"
                                }
                            ]
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('/reactive')

    await expect(page.getByRole('button', { name: 'Add item' })).toBeVisible()
  })

  test('should translate the accessible names of a list item', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "fr",
            "translations": {
                "fr": {
                    "Collapse {label} {index}": "Réduire {label} {index}",
                    "Expand {label} {index}": "Développer {label} {index}",
                    "Remove {label} item {index}": "Supprimer {label} {index}",
                    "contact_label": "Contact"
                }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "contact_label",
                            "name": "contacts",
                            "type": "list",
                            "fields": [
                                {
                                    "label": "Nombre",
                                    "name": "name",
                                    "type": "input/text"
                                },
                                {
                                    "label": "Correo",
                                    "name": "email",
                                    "type": "input/email"
                                }
                            ]
                        }
                    ]
                }
            ],
            "value": {
                "contacts": [{ "name": "Ana" }, { "name": "Luis" }]
            }
        }`
    )

    await page.goto('/reactive')

    // The item's visible caption falls back to the list label, so it is
    // translated together with the accessible name.
    await expect(page.getByText('Contact 1', { exact: true })).toBeVisible()

    // The template drops the English "item" filler rather than carrying it
    // over as a word the translation has to place somewhere.
    const toggle = page.getByRole('button', { name: 'Réduire Contact 1' })
    await expect(toggle).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Supprimer Contact 1' })
    ).toBeVisible()

    await toggle.click()
    await expect(
      page.getByRole('button', { name: 'Développer Contact 1' })
    ).toBeVisible()
  })

  test('should keep the built-in accessible names when nothing translates them', async ({
    page,
  }) => {
    await inject(
      page,
      `{
            "lang": "fr",
            "translations": {
                "fr": { "contact_label": "Contact" }
            },
            "sections": [
                {
                    "fields": [
                        {
                            "label": "contact_label",
                            "name": "contacts",
                            "type": "list",
                            "fields": [
                                {
                                    "label": "Nombre",
                                    "name": "name",
                                    "type": "input/text"
                                },
                                {
                                    "label": "Correo",
                                    "name": "email",
                                    "type": "input/email"
                                }
                            ]
                        }
                    ]
                }
            ],
            "value": {
                "contacts": [{ "name": "Ana" }, { "name": "Luis" }]
            }
        }`
    )

    await page.goto('/reactive')

    await expect(
      page.getByRole('button', { name: 'Collapse Contact 1' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Remove Contact item 1' })
    ).toBeVisible()
  })
})

test.describe('Built-in Spanish dictionary', { tag: ['@e2e'] }, () => {
  const LIST = `{
      "lang": "es",
      "sections": [
          {
              "fields": [
                  {
                      "label": "Contacto",
                      "name": "contacts",
                      "type": "list",
                      "fields": [
                          {
                              "label": "Nombre",
                              "name": "name",
                              "type": "input/text"
                          },
                          {
                              "label": "Correo",
                              "name": "email",
                              "type": "input/email"
                          }
                      ]
                  }
              ]
          }
      ],
      "value": { "contacts": [{ "name": "Ana" }, { "name": "Luis" }] }
  }`

  test('should localize the library copy from lang alone', async ({ page }) => {
    await inject(page, LIST)
    await page.goto('/reactive')

    // No `translations` block at all: `lang` is the only signal.
    await expect(
      page.getByRole('button', { name: 'Añadir elemento' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Contraer Contacto 1' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Eliminar Contacto 1' })
    ).toBeVisible()
    await expect(page.getByText('(Opcional)').first()).toBeVisible()
  })

  test('should localize the built-in select/active options from lang alone', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "lang": "es",
          "sections": [
              {
                  "fields": [
                      {
                          "label": "Activo",
                          "name": "active",
                          "type": "select/active"
                      }
                  ]
              }
          ]
      }`
    )

    await page.goto('')
    await page.getByRole('combobox').click()

    await expect(page.getByRole('option', { name: 'Sí' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'Yes' })).toHaveCount(0)
  })

  test('should apply the defaults to a regional tag', async ({ page }) => {
    await inject(page, LIST.replace('"lang": "es"', '"lang": "es-MX"'))
    await page.goto('/reactive')

    await expect(
      page.getByRole('button', { name: 'Añadir elemento' })
    ).toBeVisible()
  })

  test('should let the form override a built-in default', async ({ page }) => {
    await inject(
      page,
      LIST.replace(
        '"lang": "es",',
        '"lang": "es", "translations": { "es": { "Add item": "Agregar contacto" } },'
      )
    )

    await page.goto('/reactive')

    await expect(
      page.getByRole('button', { name: 'Agregar contacto' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Añadir elemento' })
    ).toHaveCount(0)

    // Keys the form did not override still come from the built-in dictionary.
    await expect(
      page.getByRole('button', { name: 'Contraer Contacto 1' })
    ).toBeVisible()
  })

  test('should leave a language without a built-in dictionary in English', async ({
    page,
  }) => {
    await inject(page, LIST.replace('"lang": "es"', '"lang": "ja"'))
    await page.goto('/reactive')

    await expect(page.getByRole('button', { name: 'Add item' })).toBeVisible()
  })

  // The submit summary is the only built-in copy that needs a failed submit to
  // render, so it gets its own form: a single required field left empty.
  const REQUIRED = `{
      "lang": "es",
      "sections": [
          {
              "fields": [
                  {
                      "label": "Nombre",
                      "name": "name",
                      "type": "input/text",
                      "required": true,
                      "validation": { "required": "El nombre es obligatorio" }
                  }
              ]
          }
      ]
  }`

  test('should localize the submit error summary from lang alone', async ({
    page,
  }) => {
    await inject(page, REQUIRED)
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(
      page.getByText(
        'Se encontraron errores de validación al enviar el formulario.'
      )
    ).toBeVisible()
    await expect(
      page.getByText('Corrige los errores e inténtalo de nuevo.')
    ).toBeVisible()
    await expect(
      page.getByText('There were validation errors submitting the form.')
    ).toHaveCount(0)
  })

  test('should let the form override the submit error summary', async ({
    page,
  }) => {
    await inject(
      page,
      REQUIRED.replace(
        '"lang": "es",',
        `"lang": "es", "translations": { "es": { "There were validation errors submitting the form.": "Revisa el formulario" } },`
      )
    )

    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Revisa el formulario')).toBeVisible()

    // The key the form left alone still comes from the built-in dictionary.
    await expect(
      page.getByText('Corrige los errores e inténtalo de nuevo.')
    ).toBeVisible()
  })

  test('should leave the submit error summary in English without a built-in dictionary', async ({
    page,
  }) => {
    await inject(page, REQUIRED.replace('"lang": "es"', '"lang": "ja"'))
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(
      page.getByText('There were validation errors submitting the form.')
    ).toBeVisible()
  })

  test('should leave a form without lang in English', async ({ page }) => {
    await inject(page, LIST.replace('"lang": "es",', ''))
    await page.goto('/reactive')

    await expect(page.getByRole('button', { name: 'Add item' })).toBeVisible()
  })
})
