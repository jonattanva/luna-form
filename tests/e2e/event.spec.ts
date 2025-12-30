import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Event form', { tag: ['@e2e'] }, () => {
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

    const pokemon = page.getByRole('combobox', { name: 'Pokemon (Optional)' })
    await pokemon.click()

    const option = page.getByRole('option', { name: 'pikachu' })
    await option.click()

    const indexes = page.getByRole('combobox', {
      name: 'Game Indexes (Optional)',
    })
    await indexes.click()

    const yellow = page.getByRole('option', { name: 'yellow' })
    await yellow.click()

    const abilities = page.getByRole('combobox', {
      name: 'Abilities (Optional)',
    })
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

    const pokemon = page.getByRole('combobox', { name: 'Pokemon (Optional)' })
    await pokemon.click()

    const option = page.getByRole('option', { name: 'bulbasaur' })
    await option.click()

    const abilities = page.getByRole('combobox', {
      name: 'Abilities (Optional)',
    })
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

    const country = page.getByRole('combobox', { name: 'Country (Optional)' })
    await country.click()

    const usa = page.getByRole('option', { name: 'USA' })
    await usa.click()

    await Promise.all([
      page.waitForRequest(
        (req) =>
          req.url().includes('/api/items') &&
          req.url().includes('country=usa') &&
          req.url().includes('category=tech')
      ),
      (async () => {
        const category = page.getByRole('combobox', {
          name: 'Category (Optional)',
        })
        await category.click()

        const option = page.getByRole('option', { name: 'Tech' })
        await option.click()
      })(),
    ])

    const item = page.getByRole('combobox', { name: 'Item (Optional)' })
    await item.click()

    const option = page.getByRole('option', { name: 'Merged Item' })
    await expect(option).toBeVisible()
  })
})
