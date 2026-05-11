import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

const FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "label": "Schedule",
          "name": "schedule",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "collapsed": true,
            "preview": {
              "label": "title",
              "tags": ["status", "days"]
            }
          },
          "fields": [
            { "name": "title", "label": "Title", "type": "input/text" },
            {
              "name": "status",
              "label": "Status",
              "type": "select",
              "source": [
                { "value": "active", "label": "Activo" },
                { "value": "inactive", "label": "Inactivo" }
              ]
            },
            { "name": "days", "label": "Days", "type": "chips/day" }
          ]
        }
      ]
    }
  ],
  "value": {
    "schedule": [
      {
        "title": "Morning shift",
        "status": "active",
        "days": ["1", "3"]
      },
      {
        "title": "Empty shift",
        "status": "",
        "days": []
      }
    ]
  }
}`

const CUSTOM_OPTIONS_FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "name": "field",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "collapsed": true,
            "preview": {
              "badge": "required",
              "label": "label",
              "tags": ["type", "name"]
            }
          },
          "fields": [
            { "name": "label", "label": "Label", "type": "input/text" },
            {
              "name": "required",
              "label": "Required?",
              "type": "select",
              "source": [
                { "value": true, "label": "Yes" },
                { "value": false, "label": "No" }
              ]
            },
            {
              "name": "type",
              "type": "chips",
              "advanced": {
                "multiple": false,
                "options": { "description": "description", "label": "name", "value": "id" }
              },
              "source": [
                { "id": "text", "name": "Text", "description": "Names" },
                { "id": "number", "name": "Number", "description": "Quantities" },
                { "id": "email", "name": "Email", "description": "Email" }
              ]
            },
            { "name": "name", "label": "Technical key", "type": "input/text" }
          ]
        }
      ]
    }
  ],
  "value": {
    "field": [
      { "label": "First Name", "required": true, "type": ["text"], "name": "firstName" }
    ]
  }
}`

const RADIO_FIXTURE = `{
  "sections": [
    {
      "fields": [
        {
          "name": "perms",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "collapsed": true,
            "preview": {
              "label": "name",
              "tags": ["security"]
            }
          },
          "fields": [
            { "name": "name", "label": "Name", "type": "input/text" },
            {
              "name": "security",
              "type": "radio",
              "advanced": {
                "options": { "description": "description", "label": "name", "value": "id" }
              },
              "source": [
                { "id": "open", "name": "Open", "description": "Anyone" },
                { "id": "with-secret-key", "name": "With secret key", "description": "Token" }
              ]
            }
          ]
        }
      ]
    }
  ],
  "value": {
    "perms": [
      { "name": "Webhook A", "security": "with-secret-key" }
    ]
  }
}`

test.describe('List Preview Tags - Option-bearing fields', { tag: ['@e2e'] }, () => {
  test.describe('Built-in options and inline source', () => {
    test.beforeEach(async ({ page }) => {
      await inject(page, FIXTURE)
      await page.goto('')
    })

    test('select field renders the option label, not the raw value', async ({
      page,
    }) => {
      const firstCard = page.locator('[data-slot="list-item-card"]').first()
      await expect(firstCard).toContainText('Activo')
      await expect(firstCard).not.toContainText('active')
    })

    test('chips field expands into separate labels for each selected value', async ({
      page,
    }) => {
      const firstCard = page.locator('[data-slot="list-item-card"]').first()
      const weekdayNames = Array.from({ length: 7 }, (_, i) =>
        new Date(2000, 0, 2 + i).toLocaleString('default', { weekday: 'long' })
      )
      await expect(firstCard).toContainText(weekdayNames[1])
      await expect(firstCard).toContainText(weekdayNames[3])
      await expect(firstCard).not.toContainText(weekdayNames[0])
    })

    test('empty chips selection emits no tag entries for that field', async ({
      page,
    }) => {
      const secondCard = page.locator('[data-slot="list-item-card"]').nth(1)
      const weekdayNames = Array.from({ length: 7 }, (_, i) =>
        new Date(2000, 0, 2 + i).toLocaleString('default', { weekday: 'long' })
      )
      for (const name of weekdayNames) {
        await expect(secondCard).not.toContainText(name)
      }
    })

  })

  test.describe('Required badge with boolean source', () => {
    const REQUIRED_FIXTURE_TRUE = `{
      "sections": [{
        "fields": [{
          "name": "field",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "collapsed": true,
            "preview": { "badge": "required", "label": "label" }
          },
          "fields": [
            { "name": "label", "type": "input/text" },
            { "name": "required", "type": "select", "source": [
              { "value": true, "label": "Yes" },
              { "value": false, "label": "No" }
            ]}
          ]
        }]
      }],
      "value": { "field": [{ "label": "A", "required": true }] }
    }`

    const REQUIRED_FIXTURE_FALSE = `{
      "sections": [{
        "fields": [{
          "name": "field",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "collapsed": true,
            "preview": { "badge": "required", "label": "label" }
          },
          "fields": [
            { "name": "label", "type": "input/text" },
            { "name": "required", "type": "select", "source": [
              { "value": true, "label": "Yes" },
              { "value": false, "label": "No" }
            ]}
          ]
        }]
      }],
      "value": { "field": [{ "label": "A", "required": false }] }
    }`

    const REQUIRED_FIXTURE_EMPTY = `{
      "sections": [{
        "fields": [{
          "name": "field",
          "type": "list",
          "advanced": {
            "collapsible": true,
            "collapsed": true,
            "preview": { "badge": "required", "label": "label" }
          },
          "fields": [
            { "name": "label", "type": "input/text" },
            { "name": "required", "type": "select", "source": [
              { "value": true, "label": "Yes" },
              { "value": false, "label": "No" }
            ]}
          ]
        }]
      }]
    }`

    test('required:true (boolean) resolves to "Yes" in badge', async ({
      page,
    }) => {
      await inject(page, REQUIRED_FIXTURE_TRUE)
      await page.goto('')
      const badge = page.getByText('Yes', { exact: true })
      await expect(badge).toBeVisible()
      await expect(badge).toHaveClass(/bg-primary/)
    })

    test('required:false (boolean) resolves to "No" in badge', async ({
      page,
    }) => {
      await inject(page, REQUIRED_FIXTURE_FALSE)
      await page.goto('')
      const badge = page.getByText('No', { exact: true })
      await expect(badge).toBeVisible()
      await expect(badge).toHaveClass(/bg-primary/)
    })

    test('no initial value: badge slot is empty (no Yes/No shown)', async ({
      page,
    }) => {
      await inject(page, REQUIRED_FIXTURE_EMPTY)
      await page.goto('')
      // Wait for the form header to render.
      await expect(
        page.getByRole('button', { name: /Expand field 1/ })
      ).toBeVisible()
      // No badge text should be shown.
      await expect(page.getByText('Yes', { exact: true })).toHaveCount(0)
      await expect(page.getByText('No', { exact: true })).toHaveCount(0)
    })
  })

  test.describe('Reactivity', () => {
    const REACTIVITY_FIXTURE = `{
      "sections": [
        {
          "fields": [
            {
              "label": "Schedule",
              "name": "schedule",
              "type": "list",
              "advanced": {
                "length": { "min": 1, "max": 1 },
                "collapsible": true,
                "collapsed": true,
                "preview": { "label": "title", "tags": ["status"] }
              },
              "fields": [
                { "name": "title", "label": "Title", "type": "input/text" },
                {
                  "name": "status",
                  "label": "Status",
                  "type": "select",
                  "source": [
                    { "value": "active", "label": "Activo" },
                    { "value": "inactive", "label": "Inactivo" }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "value": {
        "schedule": [
          { "title": "Shift", "status": "active" }
        ]
      }
    }`

    test('select edit then collapse: preview reactively reflects new option label', async ({
      page,
    }) => {
      await inject(page, REACTIVITY_FIXTURE)
      await page.goto('')

      const header = page.getByRole('button', { name: /Expand Schedule 1/ })
      await expect(header).toContainText('Activo')

      await header.click()

      const statusSelect = page.locator('select[name="schedule.0.status"]')
      await statusSelect.selectOption('inactive')

      await page.getByRole('button', { name: /Collapse Schedule 1/ }).click()

      await expect(header).toContainText('Inactivo')
      await expect(header).not.toContainText('Activo')
    })
  })

  test.describe('Custom advanced.options mapping (id/name keys)', () => {
    test.beforeEach(async ({ page }) => {
      await inject(page, CUSTOM_OPTIONS_FIXTURE)
      await page.goto('')
    })

    test('chips with advanced.options mapping resolves to the mapped label', async ({
      page,
    }) => {
      const card = page.locator('[data-slot="list-item-card"]').first()
      await expect(card).toContainText('Text')
      await expect(card).not.toContainText(/\btext\b/)
    })

    test('text field as preview tag still renders its raw value', async ({
      page,
    }) => {
      const card = page.locator('[data-slot="list-item-card"]').first()
      await expect(card).toContainText('firstName')
    })

    test('select with boolean source values resolves to the label (Yes/No)', async ({
      page,
    }) => {
      const card = page.locator('[data-slot="list-item-card"]').first()
      const badge = card.getByText('Yes', { exact: true })
      await expect(badge).toBeVisible()
      await expect(badge).toHaveClass(/bg-primary/)
    })

    test('preview label shows the input/text value', async ({ page }) => {
      const card = page.locator('[data-slot="list-item-card"]').first()
      await expect(card).toContainText('First Name')
    })

  })

  test.describe('Radio with advanced.options mapping', () => {
    test.beforeEach(async ({ page }) => {
      await inject(page, RADIO_FIXTURE)
      await page.goto('')
    })

    test('radio field renders the option label, not the raw value', async ({
      page,
    }) => {
      const card = page.locator('[data-slot="list-item-card"]').first()
      await expect(card).toContainText('With secret key')
      await expect(card).not.toContainText('with-secret-key')
    })
  })
})
