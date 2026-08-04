import { expect, test } from '@playwright/test'
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
