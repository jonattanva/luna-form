import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Event form', { tag: ['@e2e'] }, () => {
  const getField = (page: Page, label: string) => {
    return page
      .locator('[data-slot="field"]')
      .filter({ hasText: label })
      .getByRole('combobox')
      .first()
  }

  test('should set new source on event trigger', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": {
                                "entity": "name",
                                "options": {
                                    "label": "name",
                                    "value": "name"
                                }
                            },
                            "label": "Pokemon",
                            "name": "pokemon",
                            "type": "select",
                            "source": {
                                "url": "https://pokeapi.co/api/v2/pokemon?limit=150",
                                "namespace": "results"
                            },
                            "event": {
                                "change": [{
                                    "action": "source",
                                    "source": {
                                        "url": "{url}",
                                        "namespace": "game_indices"
                                    },
                                    "target": "game_indices"
                                }, {
                                    "action": "source",
                                    "source": {
                                        "url": "{url}",
                                        "namespace": "abilities"
                                    },
                                    "target": "abilities"
                                }]
                            }
                        },
                        {
                            "advanced": {
                                "options": {
                                    "label": "version.name",
                                    "value": "version.name"
                                }
                            },
                            "label": "Game Indexes",
                            "name": "game_indices",
                            "type": "select"
                        },
                        {
                            "advanced": {
                                "options": {
                                    "label": "ability.name",
                                    "value": "ability.name"
                                }
                            },
                            "label": "Abilities",
                            "name": "abilities",
                            "type": "select"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const pokemon = getField(page, 'Pokemon')
    await pokemon.click()

    const option = page.getByRole('option', { name: 'pikachu' })
    await option.click()

    // close the listbox
    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).toBeHidden()

    const indexes = getField(page, 'Game Indexes')
    await expect(indexes).toBeEnabled()
    await indexes.click()

    const yellow = page.getByRole('option', { name: 'yellow' })
    await yellow.click()

    // close the listbox
    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).toBeHidden()

    const abilities = getField(page, 'Abilities')
    await expect(abilities).toBeEnabled()
    await abilities.click()

    const lightningRod = page.getByRole('option', { name: 'lightning-rod' })
    await lightningRod.click()

    const form = page.locator('form')
    await expect(form).toContainText('pikachu')
    await expect(form).toContainText('yellow')
    await expect(form).toContainText('lightning-rod')
  })

  test('should set new source with body placeholder', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Pokemon",
                            "name": "pokemon",
                            "type": "select",
                            "source": [{
                                "label": "bulbasaur",
                                "value": 1
                            }, {
                                "label": "ivysaur",
                                "value": 2
                            }, {
                                "label": "venusaur",
                                "value": 3
                            }],
                            "event": {
                                "change": [{
                                    "action": "source",
                                    "source": {
                                        "url": "https://pokeapi.co/api/v2/pokemon/{value}",
                                        "namespace": "abilities"
                                    },
                                    "target": "abilities",
                                    "body": {
                                        "id": "{value}"
                                    }
                                }]
                            }
                        },
                        {
                            "advanced": {
                                "options": {
                                    "label": "ability.name",
                                    "value": "ability.name"
                                }
                            },
                            "label": "Abilities",
                            "name": "abilities",
                            "type": "select"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const pokemon = getField(page, 'Pokemon')
    await pokemon.click()

    const option = page.getByRole('option', { name: 'bulbasaur' })
    await option.click()

    const abilities = getField(page, 'Abilities')
    await abilities.click()

    const overgrow = page.getByRole('option', { name: 'overgrow' })
    await overgrow.click()

    const form = page.locator('form')
    await expect(form).toContainText('bulbasaur')
    await expect(form).toContainText('overgrow')
  })

  test('should merge data sources from two different fields', async ({
    page,
  }) => {
    await page.route('**/api/items*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ label: 'Merged Item', value: 'merged' }]),
      })
    })

    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Country",
                "name": "country",
                "type": "select",
                "source": [
                  { "label": "USA", "value": "usa" },
                  { "label": "Spain", "value": "es" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "source",
                      "target": "item",
                      "source": { "url": "/api/items?country={value}" }
                    }
                  ]
                }
              },
              {
                "label": "Category",
                "name": "category",
                "type": "select",
                "source": [
                  { "label": "Food", "value": "food" },
                  { "label": "Tech", "value": "tech" }
                ],
                "event": {
                  "change": [
                    {
                      "action": "source",
                      "target": "item",
                      "source": { "url": "/api/items?category={value}" }
                    }
                  ]
                }
              },
              {
                "label": "Item",
                "name": "item",
                "type": "select"
              }
            ]
          }
        ]
      }`
    )

    await page.goto('')

    const country = getField(page, 'Country')
    await country.click()

    const usa = page.getByRole('option', { name: 'USA' })
    await usa.click()

    await Promise.all([
      page.waitForRequest(
        (req) =>
          req.url().includes('/api/items') &&
          req.url().includes('category=tech')
      ),
      (async () => {
        const category = getField(page, 'Category')
        await category.click()

        const option = page.getByRole('option', { name: 'Tech' })
        await option.click()
      })(),
    ])

    const item = getField(page, 'Item')
    await item.click()

    const option = page.getByRole('option', { name: 'Merged Item' })
    await expect(option).toBeVisible()
  })

  test('should set new source from input text', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "Pokemon Name",
                            "name": "pokemon",
                            "type": "input/text",
                            "event": {
                                "change": [{
                                    "action": "source",
                                    "source": {
                                        "url": "https://pokeapi.co/api/v2/pokemon/{value}",
                                        "namespace": "abilities"
                                    },
                                    "target": "abilities"
                                }]
                            }
                        },
                        {
                            "advanced": {
                                "options": {
                                    "label": "ability.name",
                                    "value": "ability.name"
                                }
                            },
                            "label": "Abilities",
                            "name": "abilities",
                            "type": "select"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const input = page.locator('input[name="pokemon"]')
    await input.fill('charmander')
    await input.blur()

    const abilities = getField(page, 'Abilities')
    await abilities.click()

    const blaze = page.getByRole('option', { name: 'blaze' })
    await expect(blaze).toBeVisible()
  })

  test('should set new value on event trigger', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "First Name",
                            "name": "first_name",
                            "type": "input/text",
                            "event": {
                                "change": [{
                                    "action": "value",
                                    "value": {
                                        "full_name": "{value} Doe"
                                    }
                                }]
                            }
                        },
                        {
                            "label": "Full Name",
                            "name": "full_name",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const firstName = page.locator('input[name="first_name"]')
    await firstName.fill('John')
    await firstName.blur()

    const fullName = page.locator('input[name="full_name"]')
    await expect(fullName).toHaveValue('John Doe')
  })

  test('should set new value with selected placeholder', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "advanced": {
                                "entity": "name",
                                "options": {
                                    "label": "name",
                                    "value": "name"
                                }
                            },
                            "label": "Pokemon",
                            "name": "pokemon",
                            "type": "select",
                            "source": {
                                "url": "https://pokeapi.co/api/v2/pokemon?limit=150",
                                "namespace": "results"
                            },
                            "event": {
                                "change": [{
                                    "action": "value",
                                    "value": {
                                        "selected_pokemon": "{name} is selected"
                                    }
                                }]
                            }
                        },
                        {
                            "label": "Selected Pokemon",
                            "name": "selected_pokemon",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const pokemon = getField(page, 'Pokemon')
    await pokemon.click()

    const option = page.getByRole('option', { name: 'charizard' })
    await option.click()

    const selectedPokemon = page.locator('input[name="selected_pokemon"]')
    await expect(selectedPokemon).toHaveValue('charizard is selected')
  })

  test('should set new value from input text', async ({ page }) => {
    await inject(
      page,
      `{
            "sections": [
                {
                    "fields": [
                        {
                            "label": "First Name",
                            "name": "first_name",
                            "type": "input/text",
                            "event": {
                                "change": [{
                                    "action": "value",
                                    "value": {
                                        "greeting": "Hello, {value}!"
                                    }
                                }]
                            }
                        },
                        {
                            "label": "Greeting",
                            "name": "greeting",
                            "type": "input/text"
                        }
                    ]
                }
            ]
        }`
    )

    await page.goto('')

    const firstName = page.locator('input[name="first_name"]')
    await firstName.fill('Jane')
    await firstName.blur()

    const greeting = page.locator('input[name="greeting"]')
    await expect(greeting).toHaveValue('Hello, Jane!')
  })

  test('should handle source, value, and state events in a single form', async ({
    page,
  }) => {
    await page.route('**/api/countries*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { label: 'United States', value: 'us' },
          { label: 'Spain', value: 'es' },
        ]),
      })
    })

    await inject(
      page,
      `{
        "sections": [{
          "fields": [
            {
              "label": "Document Type",
              "name": "document_type",
              "type": "select",
              "source": [
                { "label": "Passport", "value": "passport" },
                { "label": "DNI", "value": "dni" }
              ],
              "event": {
                "change": [
                  {
                    "action": "source",
                    "target": "country",
                    "source": { "url": "/api/countries?type={value}" }
                  },
                  {
                    "action": "value",
                    "value": {
                      "document_label": "{label} selected"
                    }
                  },
                  {
                    "action": "state",
                    "target": "passport_number",
                    "state": { "hidden": false },
                    "when": "passport"
                  }
                ]
              }
            },
            {
              "label": "Country",
              "name": "country",
              "type": "select"
            },
            {
              "label": "Document Label",
              "name": "document_label",
              "type": "input/text"
            },
            {
              "label": "Passport Number",
              "name": "passport_number",
              "type": "input/text",
              "hidden": true
            }
          ]
        }]
      }`
    )

    await page.goto('')

    const passportNumber = page.locator('input[name="passport_number"]')
    await expect(passportNumber).toBeHidden()

    const documentType = getField(page, 'Document Type')
    await documentType.click()

    const passport = page.getByRole('option', { name: 'Passport' })
    await passport.click()

    // unfocus to close the listbox
    await page.mouse.click(10, 10)
    await expect(page.getByRole('listbox')).toBeHidden()

    // VALUE: document_label populated with interpolated value
    const documentLabel = page.locator('input[name="document_label"]')
    await expect(documentLabel).toHaveValue('Passport selected')

    // STATE: passport_number revealed when "passport" is selected
    await expect(passportNumber).toBeVisible()

    // SOURCE: country select populated from mocked API
    const country = getField(page, 'Country')
    await expect(country).toBeEnabled()
    await country.click()

    const spain = page.getByRole('option', { name: 'Spain' })
    await expect(spain).toBeVisible()

    // Verify state reverts when selecting a different option - unfocus to close the listbox
    await page.mouse.click(10, 10)
    await expect(page.getByRole('listbox')).toBeHidden()

    await documentType.click()
    const dni = page.getByRole('option', { name: 'DNI' })
    await dni.click()

    // unfocus to close the listbox
    await page.mouse.click(10, 10)
    await expect(page.getByRole('listbox')).toBeHidden()

    await expect(documentLabel).toHaveValue('DNI selected')
    await expect(passportNumber).toBeHidden()
  })
})
