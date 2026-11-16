import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A form can be filled from the outside. Whether it can be EMPTIED from the
// outside is what this settles, and the two answers are deliberately different:
// a value that names a field and holds nothing in it empties it, a value that
// never mentions the field leaves it alone.
//
// The difference matters to any host that owns the object it passes and can put
// it back the way it was — an undo, a record swapped underneath the form, a
// discard. Reverting does not empty a key, it removes it, so without the first
// rule the input would go on showing text that no longer exists anywhere else;
// and without the second, a host passing a partial object would watch fields it
// never mentioned clear themselves.
//
// Driven from /reactive, which holds the values a host would hold and offers a
// Reset that puts them back to what the form declared.

/** Builds a form of one text field, around whatever the host starts holding. */
function formWith(value: string, extra = ''): string {
  return `{
    "value": ${value},
    "sections": [
      {
        "fields": [
          {
            "advanced": {
              "data": {
                "testid": "name"
              }
            },
            "label": "Name",
            "name": "name",
            "type": "input/text"${extra}
          }
        ]
      }
    ]
  }`
}

test.describe('Emptying a field from the value prop', { tag: ['@e2e'] }, () => {
  test('should empty a field the value names and holds nothing in', async ({
    page,
  }) => {
    await inject(page, formWith(`{ "name": "" }`))
    await page.goto('/reactive')

    const name = page.getByTestId('name')
    await name.fill('John Doe')
    await expect(name).toHaveValue('John Doe')

    await page.getByRole('button', { name: 'Reset values' }).click()

    await expect(name).toHaveValue('')
  })

  test('should leave a field the value never mentions alone', async ({
    page,
  }) => {
    await inject(page, formWith(`{}`))
    await page.goto('/reactive')

    const name = page.getByTestId('name')
    await name.fill('John Doe')
    await expect(name).toHaveValue('John Doe')

    await page.getByRole('button', { name: 'Reset values' }).click()

    // Deliberate, and the reason `withDeclaredFields` exists: a host that
    // passes a partial object is saying nothing about this field, not saying it
    // is empty.
    await expect(name).toHaveValue('John Doe')
  })

  // Emptying a field that declares a default is a return to that default, which
  // is what remounting the form has always done.
  test('should return a field with a default to its default', async ({
    page,
  }) => {
    await inject(
      page,
      formWith(`{ "name": "" }`, `,\n            "defaultValue": "Anonymous"`)
    )
    await page.goto('/reactive')

    const name = page.getByTestId('name')
    await expect(name).toHaveValue('Anonymous')

    await name.fill('John Doe')
    await expect(name).toHaveValue('John Doe')

    await page.getByRole('button', { name: 'Reset values' }).click()

    await expect(name).toHaveValue('Anonymous')
  })
})

type ValueChange = { name: string; value: unknown }

// The same two rules inside a list's rows, for a host that keeps the shape the
// form declares -- `field` an array of row objects -- and drops a key when the
// field under it is reported empty, which is what a store that only holds what
// was written does. Such a host passes its record through `withDeclaredFields`,
// and that has to reach every row, including a field a row takes from
// `definition` through a `$ref`. See `writeNested` in the /reactive page.
function rowsWith(value: string): string {
  return `{
    "host": { "nested": true, "declared": true },
    "value": ${value},
    "definition": {
      "key": { "label": "Key", "name": "key", "type": "input/text" }
    },
    "sections": [
      {
        "fields": [
          {
            "label": "Field",
            "name": "field",
            "type": "list",
            "advanced": { "action": "Add field" },
            "fields": [
              { "label": "Label", "name": "label", "type": "input/text" },
              { "$ref": "#/definition/key" },
              { "label": "Note", "name": "note", "type": "input/text" }
            ]
          }
        ]
      }
    ]
  }`
}

/** Every `field` row array the form reports to the host, in order. */
function captureRows(page: Page): unknown[][] {
  const reports: unknown[][] = []
  page.on('console', (message: ConsoleMessage) => {
    if (!message.text().startsWith('Form values changed:')) {
      return
    }
    message
      .args()[1]
      ?.jsonValue()
      .then((change: ValueChange) => {
        if (change.name === 'field' && Array.isArray(change.value)) {
          reports.push(change.value)
        }
      })
      .catch(() => {})
  })
  return reports
}

/** The non-empty `key` of each reported row. */
function keysOf(rows: unknown[] | undefined): string[] {
  return (rows ?? []).flatMap((row) => {
    const key =
      typeof row === 'object' && row !== null ? Reflect.get(row, 'key') : null
    return typeof key === 'string' && key !== '' ? [key] : []
  })
}

test.describe(
  'Emptying a list row from the value prop',
  { tag: ['@e2e'] },
  () => {
    // Removing a row that is not the last moves every row below it up, and each
    // moved row reads its new position in the record the host still holds from
    // before the removal: the row it replaced. The host's answer has to name the
    // fields the moved row does not have, or nothing takes that value back.
    test('should keep a row empty when a row above it is removed', async ({
      page,
    }) => {
      const reports = captureRows(page)
      await inject(
        page,
        rowsWith(`{
        "field": [
          { "label": "First", "key": "first" },
          { "label": "Second", "key": "second" }
        ]
      }`)
      )
      await page.goto('/reactive')

      const labels = page.locator('input[name^="field."][name$=".label"]')
      const keys = page.locator('input[name^="field."][name$=".key"]')
      await expect(labels).toHaveCount(2)

      await page.getByRole('button', { name: 'Add field' }).click()
      await expect(labels).toHaveCount(3)

      await page.getByRole('button', { name: 'Remove Field item 1' }).click()
      await expect(labels).toHaveCount(2)
      await expect(labels.nth(0)).toHaveValue('Second')
      await expect(keys.nth(0)).toHaveValue('second')
      await expect(labels.nth(1)).toHaveValue('')
      await expect(keys.nth(1)).toHaveValue('')

      // Read again after the next add, which reports the rows with what the
      // moved row holds: a value it took from the row it replaced shows up by
      // then, and would be stored twice.
      await page.getByRole('button', { name: 'Add field' }).click()
      await expect(labels).toHaveCount(3)
      await expect(labels.nth(1)).toHaveValue('')
      await expect(keys.nth(1)).toHaveValue('')
      await expect.poll(() => keysOf(reports.at(-1))).toEqual(['second'])
    })

    // An undo, the same way: the host puts back a row that never had the fields
    // typed into it since, and they are gone from it rather than empty.
    test('should empty the fields of a row the host reverts', async ({
      page,
    }) => {
      await inject(page, rowsWith(`{ "field": [{ "label": "First" }] }`))
      await page.goto('/reactive')

      const key = page.locator('input[name^="field."][name$=".key"]').first()
      const note = page.locator('input[name^="field."][name$=".note"]').first()
      await key.fill('first')
      await note.fill('Typed after')
      await expect(key).toHaveValue('first')
      await expect(note).toHaveValue('Typed after')

      await page.getByRole('button', { name: 'Reset values' }).click()

      await expect(key).toHaveValue('')
      await expect(note).toHaveValue('')
    })
  }
)
