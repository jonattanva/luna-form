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
})
