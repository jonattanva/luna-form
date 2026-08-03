import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import { inject } from './support/inject'

type ValueChange = { name: string; value: unknown }

// The schema the report is about: typing in `label` auto-fills `name`, which
// carries a transform pipeline, and `onlyIfTargetEmpty` is the flag the buggy
// path used to misread.
//
// `echo` adds a second target the source writes to unconditionally, so a test
// can tell that the debounced batch has run without asking about `name` -- the
// field under test, and whose value at that exact instant is the whole subject
// of the last three.
//
// `rows` crowds the list. Every row reads the whole value record to keep its
// preview live (`useLiveItemValue`), so one auto-filled field re-renders all of
// them: that is what a consumer looks like from the library's side -- in the app
// it is an editor panel re-rendering on `onValueChange` -- and it is what makes
// a copy in flight observable at all. On a one-row form the decision and the
// paint are too close together for anything to slip between them.
//
// `seeded` gives the form a `value` of its own, which only the tests on
// `/reactive` want. That harness feeds every `onValueChange` back in as `value`,
// and a changed `value` prop makes the field re-run its change events on the
// spot, so there the copy lands about 17ms after the source is typed -- long
// before anyone could reach the target. On `/` the only thing that delivers it
// is the 300ms debounce in `input-textable`, which is wide enough to click into
// a field.
function autoFillList({
  echo = false,
  rows = 1,
  seeded = false,
}: { echo?: boolean; rows?: number; seeded?: boolean } = {}) {
  const copyToName = {
    action: 'value',
    onlyIfTargetEmpty: true,
    value: { 'field/name': '{value}' },
  }
  const copyToEcho = { action: 'value', value: { 'field/echo': '{value}' } }

  return JSON.stringify({
    sections: [
      {
        title: 'Field',
        fields: [
          {
            label: 'Field',
            name: 'field',
            type: 'list',
            advanced: {
              action: 'Add another field',
              length: { min: rows },
              preview: { label: 'label', tags: ['name'] },
            },
            fields: [
              {
                label: 'Name that users will see',
                name: 'label',
                type: 'input/text',
                event: {
                  change: echo ? [copyToName, copyToEcho] : [copyToName],
                },
              },
              {
                label: 'Technical key',
                name: 'name',
                type: 'input/text',
                advanced: {
                  transform: ['remove-space', 'lowercase', 'remove-accent'],
                },
              },
              ...(echo
                ? [{ label: 'Echo', name: 'echo', type: 'input/text' }]
                : []),
            ],
          },
        ],
      },
    ],
    ...(seeded ? { value: { field: [{}] } } : {}),
  })
}

const AUTOFILL_LIST = autoFillList({ seeded: true })
const AUTOFILL_LIST_WITH_ECHO = autoFillList({ echo: true })

function captureValueChanges(page: Page): ValueChange[] {
  const events: ValueChange[] = []
  page.on('console', (msg: ConsoleMessage) => {
    if (!msg.text().startsWith('Form values changed:')) {
      return
    }
    const arg = msg.args()[1]
    if (!arg) {
      return
    }
    arg
      .jsonValue()
      .then((value) => {
        events.push(value as ValueChange)
      })
      .catch(() => {})
  })
  return events
}

function lastEventFor(
  events: ValueChange[],
  name: string
): ValueChange | undefined {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i]?.name === name) {
      return events[i]
    }
  }
  return undefined
}

test.describe(
  'Value-event auto-fill (label -> name with transforms)',
  { tag: ['@e2e'] },
  () => {
    test('Bug A: target keeps mirroring source while user has not edited it', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST)
      captureValueChanges(page)
      await page.goto('/reactive')

      const labelInput = page.locator('input[name="field.0.label"]')
      const nameInput = page.locator('input[name="field.0.name"]')

      // Type "Name" character-by-character — pre-fix this would freeze the
      // target at "n" because `onlyIfTargetEmpty && !isEmpty("n")` short-
      // circuits subsequent keystrokes.
      await labelInput.click()
      for (const ch of ['N', 'Na', 'Nam', 'Name']) {
        await labelInput.fill(ch)
      }

      await expect(nameInput).toHaveValue('name')
    })

    test('Bug B: consumer receives an onValueChange for the auto-filled target', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST)
      const events = captureValueChanges(page)
      await page.goto('/reactive')

      await page.locator('input[name="field.0.label"]').fill('Name')

      await expect
        .poll(() => lastEventFor(events, 'field.0.name'))
        .toMatchObject({ name: 'field.0.name', value: 'name' })

      // The source event must also have fired.
      await expect
        .poll(() => lastEventFor(events, 'field.0.label'))
        .toMatchObject({ name: 'field.0.label', value: 'Name' })
    })

    test('stop on user edit: manual edits to the target lock it from further auto-fills', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST)
      captureValueChanges(page)
      await page.goto('/reactive')

      const labelInput = page.locator('input[name="field.0.label"]')
      const nameInput = page.locator('input[name="field.0.name"]')

      await labelInput.fill('Name')
      await expect(nameInput).toHaveValue('name')

      // User overrides the auto-filled value manually.
      await nameInput.fill('custom_key')
      await expect(nameInput).toHaveValue('custom_key')

      // Subsequent edits to the source must not clobber the user's value.
      await labelInput.fill('Nombre')
      await expect(nameInput).toHaveValue('custom_key')
    })

    test('persistence: auto-filled value survives a re-render with the parent value', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST)
      captureValueChanges(page)
      await page.goto('/reactive')

      await page.locator('input[name="field.0.label"]').fill('Name')

      // The reactive harness echoes onValueChange back into the value prop on
      // every emit. An add-another-field click forces the form to re-render
      // and re-hydrate from the parent's value — if Bug B were still present,
      // `name` would not be in `value` and the input would clear.
      await page
        .getByRole('button', { name: /Add another field/ })
        .first()
        .click()

      await expect(page.locator('input[name="field.0.name"]')).toHaveValue(
        'name'
      )
    })

    // The tests above all wait for the auto-fill to land before touching the
    // target, which is what hid the next two: the copy is debounced by 300ms,
    // so anyone who reaches the still-empty target inside that window has it
    // delivered under their caret. Writing a controlled input's value while it
    // is focused collapses the selection to the end of the new text, and
    // everything typed afterwards lands behind it -- the report was
    // `customeremailcustomer_email`.
    //
    // Nothing here is timing-dependent. The click lands well inside the 300ms,
    // and the copy is then awaited through `echo` rather than raced, so by the
    // first keystroke the target is provably focused and the batch has provably
    // run. Before the fix this failed 18 times out of 18, on all three
    // browsers, with exactly the reported value.
    test('a target the user is already in keeps what the user typed', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST_WITH_ECHO)
      await page.goto('/')

      const labelInput = page.locator('input[name="field.0.label"]')
      const nameInput = page.locator('input[name="field.0.name"]')
      const echoInput = page.locator('input[name="field.0.echo"]')

      await labelInput.fill('Customer Email')

      // Into the empty key before the copy is due.
      await nameInput.click()

      // `echo` is written by the same batch, so this is the copy landing.
      await expect(echoInput).toHaveValue('Customer Email')

      await nameInput.pressSequentially('customer_email')

      await expect(nameInput).toHaveValue('customer_email')
    })

    // The cheap way to satisfy the test above is to throw the copy away
    // whenever the target has focus, which would strand anyone who clicks into
    // the key to look at it and leaves without typing: they would keep the
    // empty required field the auto-fill exists to spare them. It is postponed,
    // not dropped.
    test('a target the user leaves untouched still receives the auto-fill', async ({
      page,
    }) => {
      await inject(page, AUTOFILL_LIST_WITH_ECHO)
      await page.goto('/')

      const labelInput = page.locator('input[name="field.0.label"]')
      const nameInput = page.locator('input[name="field.0.name"]')
      const echoInput = page.locator('input[name="field.0.echo"]')

      await labelInput.fill('Customer Email')
      await nameInput.click()
      await expect(echoInput).toHaveValue('Customer Email')

      // Away without typing a thing.
      await echoInput.click()

      await expect(nameInput).toHaveValue('customeremail')
    })

    // The two above ask about a copy decided while the caret is already in the
    // target. What was left over is the copy decided a moment *before* that,
    // with the caret still in the source: the focus test says the target is
    // free, which it is, and by the time the write is painted it no longer is.
    // Deciding and painting have to be one instant for that answer to still
    // hold when it is acted on, which is what `applyAutoFill` flushes for.
    //
    // The timeline runs inside the page: every step of it fits in less time
    // than one round trip to the driver. It is what `fill` does, spelled out --
    // type into the source, then focus the target and select what is there to
    // replace -- and the two halves have to share a task, because a `select()`
    // arriving after the paint repairs the very thing under test.
    //
    // Four rows rather than one because the window is only open while React is
    // still working: each row is an independent sample, and one of them being
    // swallowed by a busy machine does not take the test with it. Every sample
    // reproduced the report before the fix, on all three browsers.
    test('a copy still in flight does not land under a caret that arrived first', async ({
      page,
    }) => {
      await inject(page, autoFillList({ echo: true, rows: 400 }))
      await page.goto('/')

      await expect(page.locator('input[name="field.0.name"]')).toHaveValue('')

      for (const row of [0, 1, 2, 3]) {
        const key = page.locator(`input[name="field.${row}.name"]`)

        const valueWhenCaretArrived = await page.evaluate(async (row) => {
          const setValue = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          )?.set
          const label = document.querySelector<HTMLInputElement>(
            `input[name="field.${row}.label"]`
          )
          const name = document.querySelector<HTMLInputElement>(
            `input[name="field.${row}.name"]`
          )

          if (!setValue || !label || !name) {
            throw new Error(`The form did not render row ${row}`)
          }

          // Typed into without being focused: the caret has to be elsewhere
          // when the copy is decided, or this is the previous test.
          setValue.call(label, 'Customer Email')
          label.dispatchEvent(new Event('input', { bubbles: true }))

          // Past the 300ms debounce in `input-textable`, so the copy has been
          // decided by now -- and, before the fix, not yet painted.
          await new Promise((resolve) => setTimeout(resolve, 305))

          const seen = name.value
          name.focus()
          name.select()

          // Wait for the copy to actually be in the field before typing. It is
          // what keeps the assertion about *where* the copy landed, and never
          // about it having quietly not happened.
          await new Promise<void>((resolve, reject) => {
            if (name.value !== '') {
              resolve()
              return
            }

            const deadline = performance.now() + 5000
            const id = setInterval(() => {
              if (name.value !== '') {
                clearInterval(id)
                resolve()
              } else if (performance.now() > deadline) {
                clearInterval(id)
                reject(new Error('the copy never arrived'))
              }
            }, 2)
          })

          return seen
        }, row)

        // The copy was decided before the caret moved, so it has to have been
        // painted before the caret moved too. Anything else means it is still
        // in flight, and it lands on top of whatever is typed next.
        expect(valueWhenCaretArrived).toBe('customeremail')

        await page.keyboard.insertText('customer_email')

        await expect(key).toHaveValue('customer_email')
      }
    })
  }
)
