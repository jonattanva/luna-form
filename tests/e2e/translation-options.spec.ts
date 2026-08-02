import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const SELECT_FIXTURE = `{
  "lang": "es",
  "translations": {
    "es": {
      "fruit_label": "Fruta",
      "fruit_apple": "Manzana",
      "fruit_banana": "Plátano"
    }
  },
  "sections": [
    {
      "fields": [
        {
          "label": "fruit_label",
          "name": "fruit",
          "type": "select",
          "source": [
            { "value": "apple", "label": "fruit_apple" },
            { "value": "banana", "label": "fruit_banana" }
          ]
        }
      ]
    }
  ]
}`

test.describe('Option translation with array source', { tag: ['@e2e'] }, () => {
  test('should translate the option labels of a select', async ({ page }) => {
    await inject(page, SELECT_FIXTURE)
    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(page.getByRole('option', { name: 'Manzana' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'Plátano' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'fruit_apple' })).toHaveCount(
      0
    )
  })

  test('should translate the label and description of a radio', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "translations": {
          "es": {
            "plan_free": "Gratuito",
            "plan_free_help": "Hasta tres formularios",
            "plan_pro": "Profesional"
          }
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Plan",
                "name": "plan",
                "type": "radio",
                "source": [
                  {
                    "value": "free",
                    "label": "plan_free",
                    "description": "plan_free_help"
                  },
                  { "value": "pro", "label": "plan_pro" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByLabel('Gratuito')).toBeVisible()
    await expect(page.getByLabel('Profesional')).toBeVisible()
    await expect(
      page.getByText('Hasta tres formularios', { exact: true })
    ).toBeVisible()
  })

  test('should translate the option labels of chips', async ({ page }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "translations": {
          "es": { "tag_urgent": "Urgente", "tag_normal": "Normal" }
        },
        "sections": [
          {
            "fields": [
              {
                "label": "Prioridad",
                "name": "priority",
                "type": "chips",
                "source": [
                  { "value": "urgent", "label": "tag_urgent" },
                  { "value": "normal", "label": "tag_normal" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await expect(page.getByRole('button', { name: 'Urgente' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Normal' })).toBeVisible()
  })

  test('should fall back to the key when the translation is missing', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "translations": { "es": { "fruit_apple": "Manzana" } },
        "sections": [
          {
            "fields": [
              {
                "label": "Fruta",
                "name": "fruit",
                "type": "select",
                "source": [
                  { "value": "apple", "label": "fruit_apple" },
                  { "value": "banana", "label": "fruit_banana" }
                ]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(page.getByRole('option', { name: 'Manzana' })).toBeVisible()
    await expect(
      page.getByRole('option', { name: 'fruit_banana' })
    ).toBeVisible()
  })

  test('should submit the raw value, not the translated label', async ({
    page,
  }) => {
    await inject(page, SELECT_FIXTURE)
    await page.goto('')

    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Manzana' }).click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText('"fruit"')
    await expect(page.locator('pre code')).toContainText('"apple"')
    await expect(page.locator('pre code')).not.toContainText('Manzana')
  })

  test('should not translate labels coming from a remote source', async ({
    page,
  }) => {
    await page.route('**/api/fruits*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ label: 'fruit_apple', value: 'apple' }]),
      })
    })

    await inject(
      page,
      `{
        "lang": "es",
        "translations": { "es": { "fruit_apple": "Manzana" } },
        "sections": [
          {
            "fields": [
              {
                "label": "Fruta",
                "name": "fruit",
                "type": "select",
                "source": { "url": "/api/fruits" }
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(
      page.getByRole('option', { name: 'fruit_apple' })
    ).toBeVisible()
    await expect(page.getByRole('option', { name: 'Manzana' })).toHaveCount(0)
  })

  test('should translate the label resolved through advanced.options', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "translations": { "es": { "status_active": "Activo" } },
        "sections": [
          {
            "fields": [
              {
                "advanced": { "options": { "label": "name", "value": "id" } },
                "label": "Estado",
                "name": "status",
                "type": "select",
                "source": [{ "id": "active", "name": "status_active" }]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(page.getByRole('option', { name: 'Activo' })).toBeVisible()
  })

  test('should translate the option label shown in a collapsed list preview', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "translations": { "es": { "status_active": "Activo" } },
        "sections": [
          {
            "fields": [
              {
                "label": "Turnos",
                "name": "schedule",
                "type": "list",
                "advanced": {
                  "collapsed": true,
                  "preview": { "label": "title", "tags": ["status"] }
                },
                "fields": [
                  { "name": "title", "label": "Título", "type": "input/text" },
                  {
                    "name": "status",
                    "label": "Estado",
                    "type": "select",
                    "source": [
                      { "value": "active", "label": "status_active" }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "value": {
          "schedule": [{ "title": "Turno mañana", "status": "active" }]
        }
      }`
    )

    await page.goto('')

    await expect(page.getByText('Activo', { exact: true })).toBeVisible()
    await expect(page.getByText('status_active', { exact: true })).toHaveCount(
      0
    )
  })

  test('should leave options untouched when no language is configured', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Fruta",
                "name": "fruit",
                "type": "select",
                "source": [{ "value": "apple", "label": "fruit_apple" }]
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    await page.getByRole('combobox').click()

    await expect(
      page.getByRole('option', { name: 'fruit_apple' })
    ).toBeVisible()
  })

  test.describe('specialized selectors stay out of the dictionary', () => {
    test('should not translate the built-in options of select/month', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "lang": "es",
          "translations": { "es": { "January": "Enero" } },
          "sections": [
            {
              "fields": [
                { "label": "Mes", "name": "month", "type": "select/month" }
              ]
            }
          ]
        }`
      )

      await page.goto('')

      await page.getByRole('combobox').click()

      await expect(page.getByRole('option', { name: 'Enero' })).toHaveCount(0)
    })

    test('should not translate select/active without a source', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "lang": "es",
          "translations": { "es": { "Yes": "Sí", "No": "No" } },
          "sections": [
            {
              "fields": [
                { "label": "Activo", "name": "active", "type": "select/active" }
              ]
            }
          ]
        }`
      )

      await page.goto('')

      await page.getByRole('combobox').click()

      await expect(page.getByRole('option', { name: 'Yes' })).toBeVisible()
      await expect(page.getByRole('option', { name: 'Sí' })).toHaveCount(0)
    })

    test('should translate select/active when the schema declares a source', async ({
      page,
    }) => {
      await inject(
        page,
        `{
          "lang": "es",
          "translations": { "es": { "active_yes": "Sí", "active_no": "No" } },
          "sections": [
            {
              "fields": [
                {
                  "label": "Activo",
                  "name": "active",
                  "type": "select/active",
                  "source": [
                    { "value": "true", "label": "active_yes" },
                    { "value": "false", "label": "active_no" }
                  ]
                }
              ]
            }
          ]
        }`
      )

      await page.goto('')

      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: 'Sí' }).click()

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Form submitted successfully')).toBeVisible()
      // select/active coerces the selection to a boolean, so the payload keeps
      // the schema value and never the translated label.
      await expect(page.locator('pre code')).toContainText('"active": true')
      await expect(page.locator('pre code')).not.toContainText('Sí')
    })
  })
})
