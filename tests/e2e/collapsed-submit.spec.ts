import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// What sits in a collapsed container is still part of the form. Collapsing
// hides it and does nothing else: its fields keep their values, they still
// validate and they are still submitted, as docs/structure/sections.md
// promises. A collapsible section is one such container and a list row is the
// other -- one that starts collapsed, or one the user closed -- with a list
// inside the row collapsed along with the rest of it. Each test below submits
// something that lives in one.
//
// A submit held back by a field nobody can see does not say where to look, so
// the tests that fail validation also check that the error comes into view.
//
// All on /, where no host holds the values: what reaches the action can only
// have come from the form itself.

const TOKEN = { label: 'Secret Token', name: 'token', type: 'input/text' }
const A = { label: 'A', name: 'a', type: 'input/text' }
const B = { label: 'B', name: 'b', type: 'input/text' }

/** A plain section, then a collapsible one holding `field`. */
function advancedSection(field: object): string {
  return JSON.stringify({
    sections: [
      {
        title: 'Basic',
        fields: [{ label: 'Name', name: 'name', type: 'input/text' }],
      },
      {
        title: 'Advanced Options',
        advanced: { collapsible: true },
        fields: [field],
      },
    ],
  })
}

/** A form holding one list, opened on `value` when there is one. */
function listForm(list: object, value?: object): string {
  return JSON.stringify({
    ...(value ? { value } : {}),
    sections: [{ fields: [{ type: 'list', ...list }] }],
  })
}

async function open(page: Page, definition: string, ready: string) {
  await inject(page, definition)
  await page.goto('/')
  // Only the injected definition has this button, so the client has rendered.
  await expect(page.getByRole('button', { name: ready })).toBeVisible()
}

/** What reached the action. */
async function submit(page: Page): Promise<unknown> {
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('Form submitted successfully')).toBeVisible()
  return JSON.parse(await page.locator('pre code').innerText())
}

async function submitAndFail(page: Page) {
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(
    page.getByText('There were validation errors submitting the form.')
  ).toBeVisible()
}

test.describe('Collapsed content', { tag: ['@e2e'] }, () => {
  test('should submit a value typed in a section closed again', async ({
    page,
  }) => {
    await open(page, advancedSection(TOKEN), 'Advanced Options')
    await page.locator('input[name="name"]').fill('Ada')

    const toggle = page.getByRole('button', { name: 'Advanced Options' })
    const token = page.locator('input[name="token"]')
    await toggle.click()
    await token.fill('luna-secret-123')
    await toggle.click()
    await expect(token).toBeHidden()

    expect(await submit(page)).toEqual({
      name: 'Ada',
      token: 'luna-secret-123',
    })
  })

  test('should hold the submit on a required field in a section never opened', async ({
    page,
  }) => {
    await open(
      page,
      advancedSection({
        ...TOKEN,
        required: true,
        validation: { required: 'Secret Token is required' },
      }),
      'Advanced Options'
    )
    await page.locator('input[name="name"]').fill('Ada')

    await submitAndFail(page)

    await expect(
      page.getByText('Secret Token is required', { exact: true })
    ).toBeVisible()
  })

  test('should submit the rows of a list that starts collapsed', async ({
    page,
  }) => {
    await open(
      page,
      listForm(
        {
          name: 'items',
          label: 'Items',
          advanced: { collapsed: true },
          fields: [A, B],
        },
        { items: [{ a: 'one', b: 'two' }] }
      ),
      'Expand Items 1'
    )

    expect(await submit(page)).toEqual({ items: [{ a: 'one', b: 'two' }] })
  })

  test('should submit a row the user closed', async ({ page }) => {
    await open(
      page,
      listForm({ name: 'items', label: 'Items', fields: [A, B] }),
      'Collapse Items 1'
    )

    const a = page.locator('input[name="items.0.a"]')
    await a.fill('one')
    await page.locator('input[name="items.0.b"]').fill('two')
    await page.getByRole('button', { name: 'Collapse Items 1' }).click()
    await expect(a).toBeHidden()

    expect(await submit(page)).toEqual({ items: [{ a: 'one', b: 'two' }] })
  })

  test('should submit a list inside a collapsed row', async ({ page }) => {
    const groups = [{ label: 'G1', checks: [{ v: 'a' }, { v: 'b' }] }]
    await open(
      page,
      listForm(
        {
          name: 'groups',
          label: 'Groups',
          advanced: { collapsed: true },
          fields: [
            { label: 'Label', name: 'label', type: 'input/text' },
            {
              label: 'Checks',
              name: 'checks',
              type: 'list',
              fields: [{ label: 'V', name: 'v', type: 'input/text' }],
            },
          ],
        },
        { groups }
      ),
      'Expand Groups 1'
    )

    expect(await submit(page)).toEqual({ groups })
  })

  test('should hold the submit on a required field in a collapsed row', async ({
    page,
  }) => {
    await open(
      page,
      listForm(
        {
          name: 'items',
          label: 'Items',
          advanced: { collapsed: true },
          fields: [
            A,
            { ...B, required: true, validation: { required: 'B is required' } },
          ],
        },
        { items: [{ a: 'one' }] }
      ),
      'Expand Items 1'
    )

    await submitAndFail(page)

    await expect(page.getByText('B is required', { exact: true })).toBeVisible()
  })
})
