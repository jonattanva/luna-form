# Render instrumentation

What a keystroke costs the form, counted rather than timed.

Wall time on the demo editor is dominated by the editor's own work and moves
from run to run. How many fields rendered, how many schemas were built, how many
effects ran -- those do not, and they are what a change to the form actually
moves. Time is still reported, as a second reading.

Two halves:

- `probes.ts` patches counters into the library source of whatever commit is
  checked out.
- The harness below runs in the browser console and reads them.

## What it counts

| counter  | incremented when                                                     |
| -------- | -------------------------------------------------------------------- |
| `render` | the inner `Field` component renders                                  |
| `schema` | a field's Zod schema is built -- the `useMemo` factory in `useInput` |
| `effect` | `useValue`'s value effect runs                                       |
| `lookup` | `useInputCore`'s `getField` is called                                |

It also registers every `atomFamily` as it is created, so the harness can count
what each one has cached.

Every probe patches one anchor and is skipped when that anchor is not in the
commit. That is what lets one script measure any commit in the history, and it
is also the thing to watch: a skipped probe counts nothing, and the zero it
leaves is not a measurement. The script prints both lists.

## Measuring

1. Patch the counters in:

   ```bash
   pnpm benchmark:probes
   ```

2. Build, then serve -- in that order, because the build empties `dist` under a
   running server. `pnpm start` serves the production build instead.

   ```bash
   pnpm run build
   pnpm run serve
   ```

3. Open **`/reactive`**, not `/`. See below.

4. Paste the harness into the console, load a definition with
   `__h.inject(...)`, paste the harness again after the reload, and run a
   scenario.

5. Revert, and rebuild before trusting `dist` again:

   ```bash
   git checkout -- packages
   ```

## What will fool you

- **`/` is an uncontrolled host.** It never feeds `value` back into the form, so
  a keystroke renders no fields at all, on every commit, and any change reads
  as "no change". `/reactive` holds the form's value in state and hands it back
  on every change, which is the case the render path is written for.
- **Development doubles two of the counts.** StrictMode renders every component
  twice and runs every `useMemo` factory twice, so `render` and `schema` are
  doubled under `pnpm run serve`. Effects are not: StrictMode doubles them on
  mount only.
- **Check that a production run is one.** `next start` in the server log, and
  `__h.counters().render` right after loading equal to the number of fields --
  in development it is twice that.
- **Count first, then time.** A timing that disagrees with a count is usually
  the host's own work rather than the form's.
- **Nothing that builds while measuring.** `pnpm run typescript` rebuilds
  `luna-react` through `^build`, from whatever source is checked out -- after a
  revert, without the probes -- and the next reload serves that. The counters
  then read zero, and a zero reads like a result.
- **A probe that applied can still count nothing.** Before trusting a zero,
  check the counters are alive: `__h.counters().render` is above zero right
  after loading, and `__h.familyKeys()` is not empty.

## Harness

```js
// Paste into the browser console on /reactive. Reads what probes.ts writes.
// A reload takes it with it: paste it again after `__h.inject(...)`.
window.__h = {
  definitions: {
    // `count` plain text inputs.
    flat: (count) => ({
      sections: [
        {
          fields: Array.from({ length: count }, (_, i) => ({
            label: `Field ${i + 1}`,
            name: `field_${i + 1}`,
            type: 'input/text',
          })),
        },
      ],
    }),
    // A plain field beside a list of `rows` rows by two leaves, seeded.
    plainAndList: (rows) => ({
      value: {
        items: Array.from({ length: rows }, (_, n) => ({
          a: String(n),
          b: String(n),
        })),
      },
      sections: [
        {
          fields: [
            { label: 'Plain', name: 'plain', type: 'input/text' },
            {
              label: 'Items',
              name: 'items',
              type: 'list',
              fields: [
                { label: 'A', name: 'a', type: 'input/text' },
                { label: 'B', name: 'b', type: 'input/text' },
              ],
            },
          ],
        },
      ],
    }),
    // A one-leaf list, unseeded, so it starts with one row.
    churnList: () => ({
      sections: [
        {
          fields: [
            {
              label: 'Items',
              name: 'items',
              type: 'list',
              fields: [{ label: 'Value', name: 'value', type: 'input/text' }],
            },
          ],
        },
      ],
    }),
    // The two ways to say "hide" in tests/e2e/hidden-clear.spec.ts.
    hiddenClear: (mode) => {
      const hidden = mode === 'revert' ? { hidden: true } : {}
      return {
        sections: [
          {
            fields: [
              {
                label: 'Visibility',
                name: 'visibility',
                type: 'select',
                source: [
                  { label: 'Show', value: 'show' },
                  { label: 'Hide', value: 'hide' },
                ],
                event: {
                  change: [
                    {
                      action: 'state',
                      target: ['note', 'items'],
                      state: { hidden: mode !== 'revert' },
                      when: mode === 'revert' ? 'show' : 'hide',
                    },
                  ],
                },
              },
              { label: 'Note', name: 'note', type: 'input/text', ...hidden },
              {
                label: 'Items',
                name: 'items',
                type: 'list',
                advanced: { length: { min: 1 } },
                fields: [{ label: 'Value', name: 'value', type: 'input/text' }],
                ...hidden,
              },
            ],
          },
        ],
      }
    },
  },

  inject(definition) {
    localStorage.setItem(
      'luna-editor:code',
      JSON.stringify(JSON.stringify(definition))
    )
    location.reload()
  },

  // One macrotask hop; resolves with how long the thread was busy before it.
  hop() {
    return new Promise((resolve) => {
      const start = performance.now()
      const channel = new MessageChannel()
      channel.port1.onmessage = () => resolve(performance.now() - start)
      channel.port2.postMessage(0)
    })
  },

  // Until the main thread comes back free three hops running.
  async settle() {
    let idle = 0
    for (let i = 0; i < 300 && idle < 3; i++) {
      idle = (await this.hop()) < 1.5 ? idle + 1 : 0
    }
  },

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  counters() {
    return { ...(globalThis.__luna ?? {}) }
  },

  reset() {
    globalThis.__luna = {}
  },

  // Types into input[name] one character at a time, settling after each.
  // Everything between one keystroke and the next is charged to the first,
  // and the first `warmup` keystrokes are dropped.
  async type(name, keystrokes = 12, warmup = 2) {
    const input = document.querySelector(`input[name="${name}"]`)
    if (!input) throw new Error(`no input named ${name}`)
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    ).set

    await this.settle()
    this.reset()
    const snapshots = []
    const times = []
    for (let i = 0; i < keystrokes; i++) {
      await this.settle()
      snapshots.push(this.counters())
      const start = performance.now()
      setValue.call(input, `${input.value}a`)
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await this.settle()
      times.push(performance.now() - start)
      await this.wait(40)
    }
    await this.settle()
    snapshots.push(this.counters())

    const keys = Object.keys(snapshots[snapshots.length - 1])
    const kept = times.slice(warmup).map((ms, i) => {
      const before = snapshots[warmup + i]
      const after = snapshots[warmup + i + 1]
      return Object.fromEntries([
        ['ms', ms],
        ...keys.map((key) => [key, (after[key] ?? 0) - (before[key] ?? 0)]),
      ])
    })
    const at = (values, q) =>
      [...values].sort((a, b) => a - b)[Math.floor(values.length * q)]
    const ms = kept.map((k) => k.ms)
    return {
      medianMs: +at(ms, 0.5).toFixed(2),
      p90Ms: +at(ms, 0.9).toFixed(2),
      perKeystroke: Object.fromEntries(
        keys.map((key) => [
          key,
          at(
            kept.map((k) => k[key]),
            0.5
          ),
        ])
      ),
      total: Object.fromEntries(
        keys.map((key) => [key, kept.reduce((n, k) => n + k[key], 0)])
      ),
    }
  },

  // A Radix Select, driven the way a mouse does. Radix opens on pointerdown
  // and swallows the first pointerup after opening, so one is spent on the
  // document before the option gets its own.
  async choose(label, option) {
    const field = [...document.querySelectorAll('[data-slot="field"]')].find(
      (el) => el.textContent.includes(label)
    )
    const trigger = field?.querySelector('[role="combobox"]')
    if (!trigger) throw new Error(`no select labelled ${label}`)
    const at = (el) => {
      const rect = el.getBoundingClientRect()
      return {
        bubbles: true,
        cancelable: true,
        composed: true,
        button: 0,
        buttons: 1,
        pointerType: 'mouse',
        pointerId: 1,
        isPrimary: true,
        clientX: rect.x + 5,
        clientY: rect.y + 5,
      }
    }
    trigger.dispatchEvent(new PointerEvent('pointerdown', at(trigger)))
    await this.wait(150)
    document.dispatchEvent(new PointerEvent('pointerup', at(trigger)))
    await this.wait(50)
    const item = [...document.querySelectorAll('[role="option"]')].find(
      (el) => el.textContent.trim() === option
    )
    if (!item) throw new Error(`no option ${option}`)
    item.dispatchEvent(new PointerEvent('pointerdown', at(item)))
    item.dispatchEvent(new PointerEvent('pointerup', at(item)))
    await this.settle()
    await this.wait(200)
  },

  // Sets a value the way typing does, without touching the counters.
  async fill(name, text) {
    const input = document.querySelector(`input[name="${name}"]`)
    if (!input) throw new Error(`no input named ${name}`)
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    ).set.call(input, text)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await this.settle()
    await this.wait(100)
  },

  // Fill both fields, hide them, show them again, on `hiddenClear(mode)`.
  // `hidden` and `cleared` say the sequence ran the way the spec expects it to.
  async hideAndShow(mode) {
    await this.settle()
    this.reset()
    if (mode === 'revert') await this.choose('Visibility', 'Show')
    await this.fill('note', 'written by hand')
    await this.fill('items.0.value', 'a row value')
    await this.choose('Visibility', 'Hide')
    const hidden = !document.querySelector('input[name="note"]')
    await this.choose('Visibility', 'Show')
    return {
      lookups: this.counters().lookup ?? 0,
      hidden,
      cleared: document.querySelector('input[name="note"]')?.value === '',
    }
  },

  // Cached atoms, in total and per family in creation order.
  atoms() {
    const keys = (globalThis.__lunaFamilies ?? []).map((family) => [
      ...family.getParams(),
    ])
    return {
      total: keys.reduce((n, k) => n + k.length, 0),
      perFamily: keys.map((k) => k.length).join(' '),
    }
  },

  // The last two keys of each family: enough to tell stable ids from positions.
  familyKeys() {
    return (globalThis.__lunaFamilies ?? []).map((family) =>
      [...family.getParams()].slice(-2)
    )
  },

  // Rows of `churnList()`, one input each.
  rows() {
    return document.querySelectorAll('input[name^="items."]').length
  },

  async addRows(count) {
    for (let i = 0; i < count; i++) {
      const button = [...document.querySelectorAll('button')].find(
        (b) =>
          /^Add item/.test(b.getAttribute('aria-label') ?? '') ||
          /^Add item/.test(b.textContent.trim())
      )
      if (!button) throw new Error('no add button')
      button.click()
      await this.settle()
    }
  },

  // 1-based, as the button's label reads.
  async removeRow(index, label = 'Items') {
    const button = document.querySelector(
      `button[aria-label="Remove ${label} item ${index}"]`
    )
    if (!button) throw new Error(`no remove button for item ${index}`)
    button.click()
    await this.settle()
  },

  // 1 -> 20 -> 14 -> 20 rows on `churnList()`. Removals take item 2, so the
  // rows behind it shift down.
  async churn() {
    const steps = []
    const snapshot = async (step) => {
      await this.settle()
      await this.wait(300)
      steps.push({ step, rows: this.rows(), ...this.atoms() })
    }
    await snapshot('start')
    await this.addRows(19)
    await snapshot('added 19')
    for (let i = 0; i < 6; i++) await this.removeRow(2)
    await snapshot('removed item 2, six times')
    await this.addRows(6)
    await snapshot('added 6')
    return steps
  },
}
```

## Scenarios

The definitions behind the results below. Load one with
`__h.inject(__h.definitions.<name>(...))`, paste the harness again, then run it.

| question                    | definition                                         | run                               | read                              |
| --------------------------- | -------------------------------------------------- | --------------------------------- | --------------------------------- |
| keystroke cost              | `flat(15)`, `flat(100)`                            | `await __h.type('field_2')`       | `perKeystroke.render`, `medianMs` |
| schema builds               | `flat(10)`                                         | `await __h.type('field_2', 5, 0)` | `total.schema`                    |
| schema builds beside a list | `plainAndList(4)`                                  | `await __h.type('plain', 5, 0)`   | `total.schema`                    |
| `useValue` effect runs      | `plainAndList(30)`                                 | `await __h.type('plain', 5, 0)`   | `total.effect`                    |
| field lookups               | `hiddenClear('revert')`, `hiddenClear('explicit')` | `await __h.hideAndShow(mode)`     | `lookups`                         |
| cached atoms                | `churnList()`                                      | `await __h.churn()`               | `total`, `perFamily`              |

`perFamily` is in creation order, and that order moves when a commit changes the
order modules load. Tell the families apart with `__h.familyKeys()` instead:
keys by stable id keep climbing with every row ever added, keys by position stop
at the widest the list has been.

## Results

Measured 2026-09-10 on `/reactive`. `main` is `a82b6a0`; "after" is the value
once the change is in, measured on the commit in the last column. Counts are
exact and repeat between runs. Milliseconds are medians of 10 keystrokes and
move by a few between runs of the same tree, so each time here is paired with
one taken in the same sitting.

| PR      | what                  | scenario                             | `main`         | after                   | measured on |
| ------- | --------------------- | ------------------------------------ | -------------- | ----------------------- | ----------- |
| #73     | schema builds         | `flat(10)`, 5 keystrokes             | 100            | **0**                   | `22d2e64`   |
| #73     | schema builds         | `plainAndList(4)`, 5 keystrokes      | 90             | **0**                   | `2af28de`   |
| #73     | schema builds         | `plainAndList(30)`, 5 keystrokes     | 610            | **0**                   | `2af28de`   |
| #73     | field lookups         | `hiddenClear('revert')`              | 7              | **5**                   | `dda80c3`   |
| #73     | field lookups         | `hiddenClear('explicit')`            | 12             | 12                      | `dda80c3`   |
| #74     | effect runs           | `plainAndList(30)`, 5 keystrokes     | 305            | **5**                   | `1167310`   |
| #75     | cached atoms          | `churnList()` at 1, 20, 14, 20 rows  | 6, 82, 82, 106 | 7, 102, **78**, **102** | `ffd8f5b`   |
| #73-#75 | renders per keystroke | `flat(100)`, dev                     | 200            | 200                     | each tip    |
| #73-#75 | ms per keystroke      | `flat(100)`, dev                     | 83.8           | 83.5, 83.7, 76.0        | each tip    |
| #76     | renders per keystroke | `flat(15)` / `flat(100)`, dev        | 30 / 200       | **2 / 2**               | `291713e`   |
| #76     | ms per keystroke      | `flat(15)` / `flat(100)`, dev        | 30.6 / 85.9    | **14.9 / 26.9**         | `291713e`   |
| #76     | renders per keystroke | `flat(15)` / `flat(100)`, production | 15 / 100       | **1 / 1**               | `291713e`   |
| #76     | ms per keystroke      | `flat(15)` / `flat(100)`, production | 13.7 / 34.2    | **5.6 / 13.1**          | `291713e`   |

Reading it:

- On `main` every keystroke renders every field, rebuilds every field's schema
  and runs every field's value effect -- at 100 fields in production, 100 of
  each per keystroke.
- #73 and #74 remove work that rode along with every render, and #75 removes
  memory, but none of them removes the renders themselves. The time per
  keystroke does not move until #76; 76.0ms is inside the spread, not a
  speed-up.
- The atom row gains 20 on its first 20-row screen: that is `hostEntryAtom`,
  which #74 adds and which holds one key per position the list has reached.
  What #75 removes is the leak -- on `main` the same 20-row screen holds 24
  atoms more the second time; after #75 it holds none.
- The final tip, `291713e`, reproduces the lookup row (5) and the atom row (7,
  102, 78, 102).
- For the size of the spread: `main` in production measured 13.7 and 9.6ms at
  15 fields and 34.2 and 37.2 at 100 across two runs; the memo in development
  measured 26.9 and 29.7 at 100.

The harness was checked against these rows before it was committed: `flat(10)`
on `main` gives 100 schema builds, 100 renders and 50 effect runs, and
`hiddenClear('revert')` and `churnList()` on `291713e` give 5 and 7, 102, 78, 102.

Development counts are doubled by StrictMode, as above.
