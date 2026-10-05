import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

/**
 * A form speaks the language it is given as `lang`: its labels, its
 * descriptions and its change events format with it, the way its translations
 * and its month names already did. `config.env.locale` used to decide the
 * filters on its own, so the same form could name its months in one language
 * and write its money in another.
 */
test.describe(
  'Format filters in the language of the form',
  { tag: ['@e2e'] },
  () => {
    const form = (top: string) => `{
    ${top}
    "env": { "amount": 1234.56 },
    "sections": [
      {
        "fields": [
          {
            "label": "Total {env.amount | currency:EUR}",
            "name": "total",
            "type": "input/text",
            "description": "Also {env.amount | currency:EUR}"
          }
        ]
      }
    ]
  }`

    test('should format a label in the language of the form', async ({
      page,
    }) => {
      await inject(page, form('"lang": "es-ES",'))
      await page.goto('/reactive')

      const label = page.locator('[data-slot="field-label"]')
      await expect(label).toContainText('1234,56')
      await expect(label).not.toContainText('1,234.56')
    })

    test('should format a description in the language of the form', async ({
      page,
    }) => {
      await inject(page, form('"lang": "es-ES",'))
      await page.goto('/reactive')

      const description = page.locator('p', { hasText: 'Also' })
      await expect(description).toContainText('1234,56')
      await expect(description).not.toContainText('1,234.56')
    })

    // `env.locale` formats nothing any more: without `lang` the form speaks
    // English, whatever language the browser speaks.
    test.describe('without a language', () => {
      test.use({ locale: 'de-DE' })

      test('should write money in English, and leave env.locale unread', async ({
        page,
      }) => {
        await inject(
          page,
          form('').replace('"env": {', '"env": { "locale": "es-ES",')
        )
        await page.goto('/reactive')

        await expect(page.locator('[data-slot="field-label"]')).toContainText(
          '€1,234.56'
        )
      })
    })

    // A horizontal field shows its description beside the label, from another
    // component, and it formats in the same language.
    test('should format a horizontal description in the language of the form', async ({
      page,
    }) => {
      await inject(
        page,
        form('"lang": "es-ES",').replace(
          '"type": "input/text",',
          '"type": "input/text",\n            "advanced": { "horizontal": true },'
        )
      )
      await page.goto('/reactive')

      const description = page.locator('p', { hasText: 'Also' })
      await expect(description).toContainText('1234,56')
      await expect(description).not.toContainText('1,234.56')
    })

    test('should format a change event in the language of the form', async ({
      page,
    }) => {
      await inject(
        page,
        `{
        "lang": "de",
        "sections": [{
          "fields": [
            {
              "label": "Size",
              "name": "size",
              "type": "select",
              "source": [{ "label": "Big", "value": "1234.5" }],
              "event": {
                "change": [{ "action": "value", "value": { "shown": "{value | number}" } }]
              }
            },
            { "label": "Shown", "name": "shown", "type": "input/text" }
          ]
        }]
      }`
      )
      await page.goto('/reactive')

      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: 'Big' }).click()

      await expect(page.locator('input[name="shown"]')).toHaveValue('1.234,5')
    })
  }
)
