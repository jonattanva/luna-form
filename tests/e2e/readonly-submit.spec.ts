import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// A read-only field is locked, not left out: `docs/fields/input.md` says its
// value "is locked and cannot be modified by the user", and a locked value is
// still the form's. The browser leaves out what it does not send -- a disabled
// control, a radio nobody picked -- and neither may cost the submit a value or
// hold it back.
//
// Every kind of field the editor registers is read-only once, with a default,
// and has to reach the action as that default. All on /, where no host holds
// the values: what reaches the action can only have come from the form.

const COLORS = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
]

type Default = string | number | boolean | string[]

// Each kind with the default it declares and what the action has to receive
// for it: the same value, except that a date is declared the way it is
// displayed and travels as `yyyy-MM-dd` (see `docs/forms/submit.md`). A
// timezone travels as its id and a checkbox as a boolean.
const CASES: Array<{ type: string; value: Default; sent?: Default }> = [
  { type: 'input/text', value: 'ABC-1' },
  { type: 'input/number', value: 5 },
  { type: 'input/date', value: 'September 15, 2026', sent: '2026-09-15' },
  { type: 'textarea', value: 'A note' },
  { type: 'select', value: 'blue' },
  { type: 'select/timezone', value: 'Europe/Madrid' },
  { type: 'chips', value: ['blue'] },
  { type: 'chips/day', value: ['1'] },
  { type: 'radio', value: 'blue' },
  { type: 'checkbox', value: true },
  { type: 'checkbox/switch', value: true },
]
const WITH_OPTIONS = new Set(['select', 'chips', 'radio'])

/** A form holding a plain text field, then `fields`. */
async function open(page: Page, fields: object[]) {
  await inject(
    page,
    JSON.stringify({
      sections: [
        {
          fields: [
            { label: 'Name', name: 'name', type: 'input/text' },
            ...fields,
          ],
        },
      ],
    })
  )
  await page.goto('/')
  // Only the injected definition has this field, so the client has rendered.
  await expect(page.locator('input[name="name"]')).toBeVisible()
}

/** What reached the action. */
async function submit(page: Page): Promise<Record<string, unknown>> {
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('Form submitted successfully')).toBeVisible()
  return JSON.parse(await page.locator('pre code').innerText())
}

test.describe('What the browser does not send', { tag: ['@e2e'] }, () => {
  test.describe('a read-only field with a default', () => {
    for (const { type, value, sent = value } of CASES) {
      test(`should submit its value: ${type}`, async ({ page }) => {
        await open(page, [
          {
            label: 'Target',
            name: 'target',
            type,
            readonly: true,
            defaultValue: value,
            ...(WITH_OPTIONS.has(type) ? { source: COLORS } : {}),
          },
        ])

        const payload = await submit(page)

        expect(payload.target).toEqual(sent)
      })
    }
  })

  // A row names its fields by the row's stable id, and the value has to travel
  // under that name all the same.
  test('should submit a read-only field inside a list row', async ({
    page,
  }) => {
    await open(page, [
      {
        label: 'Items',
        name: 'items',
        type: 'list',
        fields: [
          {
            label: 'Code',
            name: 'code',
            type: 'input/text',
            readonly: true,
            defaultValue: 'ROW-1',
          },
        ],
      },
    ])

    const payload = await submit(page)

    expect(payload.items).toEqual([{ code: 'ROW-1' }])
  })

  test('should not hold the submit back on an optional radio nobody picked', async ({
    page,
  }) => {
    await open(page, [
      { label: 'Plan', name: 'plan', type: 'radio', source: COLORS },
    ])

    expect(await submit(page)).toEqual({ name: '' })
  })
})
