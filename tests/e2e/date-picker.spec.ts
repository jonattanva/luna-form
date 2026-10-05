import { expect, test } from '@playwright/test'
import { inject } from './support/inject'
import { captureValueChanges, lastEventFor } from './support/value-changes'

// A stay that opens on October 5 and closes on October 20, 2026.
const BOUNDED = `{
  "sections": [{
    "fields": [{
      "advanced": { "length": { "min": "2026-10-05", "max": "2026-10-20" } },
      "label": "Check-in",
      "name": "check_in",
      "type": "input/date",
      "validation": {
        "length": { "min": "We open on October 5", "max": "We close on October 20" }
      }
    }]
  }]
}`

// Christmas Eve and Christmas are booked. The host holds a day in December, so
// the calendar opens there whatever day the test runs.
const RESERVED = `{
  "value": { "night": "2026-12-20" },
  "sections": [{
    "fields": [{
      "advanced": { "reserved": ["2026-12-24", "2026-12-25"] },
      "label": "Night",
      "name": "night",
      "type": "input/date",
      "validation": { "reserved": "That night is taken" }
    }]
  }]
}`

// A stay in October 2026, with the night of the 10th already booked. The
// bounds keep the calendar on October whatever day the test runs.
const STAY = (value?: [string, string]) =>
  JSON.stringify({
    ...(value && { value: { stay: value } }),
    sections: [
      {
        fields: [
          {
            advanced: {
              mode: 'range',
              length: { min: '2026-10-01', max: '2026-10-31' },
              reserved: ['2026-10-10'],
            },
            label: 'Stay',
            name: 'stay',
            type: 'input/date',
            validation: {
              range: 'Pick the first and the last night',
              reserved: 'A night in it is taken',
            },
          },
        ],
      },
    ],
  })

test.describe('Date calendar picker interaction', { tag: ['@e2e'] }, () => {
  test('should open calendar when clicking the calendar button', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [{
            "fields": [{
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
  })

  test('should update input to MMMM d, yyyy after calendar selection', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "June 15, 2024" },
          "sections": [{
            "fields": [{
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()

    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      'June 20, 2024'
    )
  })

  test('should submit yyyy-MM-dd after calendar selection (MMMM d, yyyy display)', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "June 15, 2024" },
          "sections": [{
            "fields": [{
              "label": "Birth Date",
              "name": "birth_date",
              "required": true,
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"birth_date": "2024-06-20"'
    )
  })

  test('should update input to MM/dd/yyyy after calendar selection', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "06/15/2024" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "MM/dd/yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()

    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      '06/20/2024'
    )
  })

  test('should update input to dd/MM/yyyy after calendar selection', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "15/06/2024" },
          "sections": [{
            "fields": [{
              "advanced": { "format": "dd/MM/yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()

    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      '20/06/2024'
    )
  })

  // The component runs the form's blur as well as its own, so a date is checked
  // when the user leaves it, like any other field. It used to run only its own.
  test('should validate a required date when the user leaves it', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [{
            "fields": [{
              "label": "Birth Date",
              "name": "birth_date",
              "required": true,
              "type": "input/date",
              "validation": { "required": "This field is required" }
            }]
          }]
        }`
    )
    await page.goto('')

    const input = page.locator('input[name="birth_date"]')
    await input.fill('')
    await input.blur()

    await expect(
      page.getByText('This field is required', { exact: true })
    ).toBeVisible()
  })

  // A year is four digits: one half typed is text the field keeps as typed,
  // and the form says it is no day, rather than read the year 2 into it.
  test('should keep a year that is not four digits as typed and reject it', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "sections": [{
            "fields": [{
              "advanced": { "format": "dd/MM/yyyy" },
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date",
              "validation": { "date": "Not a day" }
            }]
          }]
        }`
    )
    await page.goto('')

    const input = page.locator('input[name="birth_date"]')
    await input.fill('15/06/2')
    await input.blur()

    await expect(input).toHaveValue('15/06/2')
    await expect(page.getByText('Not a day', { exact: true })).toBeVisible()
  })

  // The bounds reach the calendar as `min` and `max`. It opens on the month of
  // the minimum, so this does not depend on the day it runs, and neither a day
  // outside them nor a month outside them can be reached.
  test('should not let a day outside the bounds be picked', async ({
    page,
  }) => {
    await inject(page, BOUNDED)
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    const calendar = page.locator('[data-slot="calendar"]')

    await expect(
      calendar.locator('td[data-day="2026-10-04"] button')
    ).toBeDisabled()
    await expect(
      calendar.locator('td[data-day="2026-10-05"] button')
    ).toBeEnabled()
    await expect(
      calendar.locator('td[data-day="2026-10-20"] button')
    ).toBeEnabled()
    await expect(
      calendar.locator('td[data-day="2026-10-21"] button')
    ).toBeDisabled()
    await expect(
      calendar.getByRole('button', { name: 'Go to the Next Month' })
    ).toHaveAttribute('aria-disabled', 'true')
  })

  // What the calendar disables, a person can still type. The schema checks the
  // same bounds, so the day is held back all the same.
  test('should hold back a typed day outside the bounds', async ({ page }) => {
    await inject(page, BOUNDED)
    await page.goto('')

    const input = page.locator('input[name="check_in"]')
    await input.fill('2026-10-04')
    await input.blur()
    await expect(
      page.getByText('We open on October 5', { exact: true })
    ).toBeVisible()

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeHidden()
  })

  // The library keeps no clock: the host passes today in `context`, and the
  // field reads its minimum from there.
  test('should take its minimum from the context the host passes', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "context": { "today": "2026-10-05" },
          "sections": [{
            "fields": [{
              "advanced": { "length": { "min": { "$ref": "#/context/today" } } },
              "label": "Check-in",
              "name": "check_in",
              "type": "input/date",
              "validation": { "length": { "min": "Pick today or a later day" } }
            }]
          }]
        }`
    )
    await page.goto('')

    const input = page.locator('input[name="check_in"]')
    await input.fill('2026-10-04')
    await input.blur()
    await expect(
      page.getByText('Pick today or a later day', { exact: true })
    ).toBeVisible()

    await input.fill('2026-10-05')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"check_in": "2026-10-05"'
    )
  })

  // The reserved days reach the calendar as `data-reserved`: it neither lets
  // one be picked nor hides why, striking it through.
  test('should not let a reserved day be picked', async ({ page }) => {
    await inject(page, RESERVED)
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    const calendar = page.locator('[data-slot="calendar"]')

    await expect(
      calendar.locator('td[data-day="2026-12-24"] button')
    ).toBeDisabled()
    await expect(
      calendar.locator('td[data-day="2026-12-25"] button')
    ).toBeDisabled()
    await expect(calendar.locator('td[data-day="2026-12-24"]')).toHaveClass(
      /line-through/
    )
    await expect(
      calendar.locator('td[data-day="2026-12-23"] button')
    ).toBeEnabled()
  })

  test('should hold back a typed reserved day', async ({ page }) => {
    await inject(page, RESERVED)
    await page.goto('')

    const input = page.locator('input[name="night"]')
    await input.fill('2026-12-24')
    await input.blur()
    await expect(
      page.getByText('That night is taken', { exact: true })
    ).toBeVisible()

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeHidden()
  })

  // What is booked is the host's to know: it passes the list in `context`.
  test('should take its reserved days from the context the host passes', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "context": { "booked": ["2026-12-24"] },
          "sections": [{
            "fields": [{
              "advanced": { "reserved": { "$ref": "#/context/booked" } },
              "label": "Night",
              "name": "night",
              "type": "input/date",
              "validation": { "reserved": "That night is taken" }
            }]
          }]
        }`
    )
    await page.goto('')

    const input = page.locator('input[name="night"]')
    await input.fill('2026-12-24')
    await input.blur()
    await expect(
      page.getByText('That night is taken', { exact: true })
    ).toBeVisible()

    await input.fill('2026-12-23')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    await expect(page.locator('pre code')).toContainText(
      '"night": "2026-12-23"'
    )
  })

  // A range is two days the form submits itself, whatever the component shows.
  test('should submit the two days of a range picked in the calendar', async ({
    page,
  }) => {
    await inject(page, STAY())
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    const calendar = page.locator('[data-slot="calendar"]')
    await calendar.locator('td[data-day="2026-10-03"] button').click()
    await calendar.locator('td[data-day="2026-10-06"] button').click()

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    expect(JSON.parse(await page.locator('pre code').innerText())).toEqual({
      stay: ['2026-10-03', '2026-10-06'],
    })
  })

  // A range cannot hold a booked night: the calendar starts over from the day
  // picked last, and half a range is held back.
  test('should not let a range run over a reserved day', async ({ page }) => {
    await inject(page, STAY())
    await page.goto('')

    await page.getByRole('button', { name: 'Select date' }).click()
    const calendar = page.locator('[data-slot="calendar"]')
    await calendar.locator('td[data-day="2026-10-08"] button').click()
    await calendar.locator('td[data-day="2026-10-12"] button').click()
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(
      page
        .getByText('Pick the first and the last night', { exact: true })
        .first()
    ).toBeVisible()
    await expect(page.getByText('Form submitted successfully')).toBeHidden()
  })

  // A range the host holds never went through the calendar: the form checks it.
  test('should hold back a host range that runs over a reserved day', async ({
    page,
  }) => {
    await inject(page, STAY(['2026-10-08', '2026-10-12']))
    await page.goto('')

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(
      page.getByText('A night in it is taken', { exact: true }).first()
    ).toBeVisible()
    await expect(page.getByText('Form submitted successfully')).toBeHidden()
  })

  // What a range hands its change events is the pair it holds, at mount as on a
  // click: a range copied into another one at mount arrives whole.
  test('should hand a range to its change events as the pair it holds', async ({
    page,
  }) => {
    await inject(
      page,
      JSON.stringify({
        value: { stay: ['2026-10-03', '2026-10-06'] },
        sections: [
          {
            fields: [
              {
                advanced: { mode: 'range' },
                event: {
                  change: [{ action: 'value', value: { copy: '{value}' } }],
                },
                label: 'Stay',
                name: 'stay',
                type: 'input/date',
              },
              {
                advanced: { mode: 'range' },
                label: 'Copy',
                name: 'copy',
                type: 'input/date',
              },
            ],
          },
        ],
      })
    )
    await page.goto('')

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Form submitted successfully')).toBeVisible()
    expect(JSON.parse(await page.locator('pre code').innerText())).toEqual({
      copy: ['2026-10-03', '2026-10-06'],
      stay: ['2026-10-03', '2026-10-06'],
    })
  })

  // The form sends a range itself, so its control has no name to send under,
  // disabled or not.
  test('should give the control of a disabled range no name', async ({
    page,
  }) => {
    await inject(
      page,
      JSON.stringify({
        sections: [
          {
            fields: [
              {
                defaultValue: 'yes',
                event: {
                  change: [
                    {
                      action: 'state',
                      target: 'stay',
                      state: { disabled: true },
                    },
                  ],
                },
                label: 'Lock',
                name: 'lock',
                type: 'input/text',
              },
              {
                advanced: { mode: 'range' },
                label: 'Stay',
                name: 'stay',
                type: 'input/date',
              },
            ],
          },
        ],
      })
    )
    await page.goto('')

    const box = page.locator('input[data-mode="range"]')
    await expect(box).toBeDisabled()
    expect(await box.getAttribute('name')).toBeNull()
  })

  // The host is told the day as `yyyy-MM-dd`, the shape it can hand back: on
  // `/reactive` it does, and the field still shows the day in its format.
  test('should report the picked day to the host as yyyy-MM-dd', async ({
    page,
  }) => {
    await inject(
      page,
      `{
          "value": { "birth_date": "June 15, 2024" },
          "sections": [{
            "fields": [{
              "label": "Birth Date",
              "name": "birth_date",
              "type": "input/date"
            }]
          }]
        }`
    )
    const events = captureValueChanges(page)
    await page.goto('/reactive')

    await page.getByRole('button', { name: 'Select date' }).click()
    await page
      .locator('[data-slot="calendar"] button')
      .filter({ hasText: /^20$/ })
      .click()

    await expect
      .poll(() => lastEventFor(events, 'birth_date'))
      .toMatchObject({ name: 'birth_date', value: '2024-06-20' })
    await expect(page.locator('input[name="birth_date"]')).toHaveValue(
      'June 20, 2024'
    )
  })

  // A calendar names its months in the language of the form, which it reads
  // from the standard `lang` attribute the form puts on its props.
  test('should name the month in the language of the form', async ({
    page,
  }) => {
    await inject(
      page,
      `{
        "lang": "es",
        "value": { "night": "2026-10-02" },
        "sections": [{
          "fields": [{ "label": "Night", "name": "night", "type": "input/date" }]
        }]
      }`
    )
    await page.goto('')

    await expect(page.locator('input[name="night"]')).toHaveValue(
      'octubre 2, 2026'
    )
    await page.getByRole('button', { name: 'Select date' }).click()
    await expect(page.locator('[data-slot="calendar"]')).toContainText(
      'octubre 2026'
    )
  })
})
