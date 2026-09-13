import type { Page } from '@playwright/test'
import { inject } from './inject'

/**
 * The read side of the render instrument: what `benchmark/render/probes.ts`
 * writes to `globalThis.__luna`, read from the page the way the harness in its
 * README does, and the definitions the budgets are measured on.
 *
 * A count only means something on a probed production build. Development
 * StrictMode doubles `render` and `schema`, and an unprobed build counts
 * nothing at all: `render-budget.spec.ts` checks for both before it trusts a
 * number.
 */

export type Counters = Record<string, number>

type Harness = {
  counters: () => Counters
  familySizes: () => number[]
  reset: () => void
  settle: () => Promise<void>
  type: (name: string, keystrokes: number, warmup: number) => Promise<Counters>
}

declare global {
  interface Window {
    __render: Harness
  }
}

// Runs inside the page, installed ahead of its own scripts so that it survives
// the reload an injected definition needs. Nothing in here may close over
// anything on the Node side.
function install() {
  const g = globalThis as typeof globalThis & {
    __luna?: Counters
    __lunaFamilies?: Array<{ getParams: () => Iterable<unknown> }>
  }

  // One macrotask hop; resolves with how long the thread was busy before it.
  const hop = () =>
    new Promise<number>((resolve) => {
      const started = performance.now()
      const channel = new MessageChannel()
      channel.port1.onmessage = () => resolve(performance.now() - started)
      channel.port2.postMessage(0)
    })

  const harness: Harness = {
    counters: () => ({ ...(g.__luna ?? {}) }),

    familySizes: () =>
      (g.__lunaFamilies ?? []).map((family) => [...family.getParams()].length),

    reset: () => {
      g.__luna = {}
    },

    // Until the main thread comes back free three hops running.
    settle: async () => {
      let idle = 0
      for (let i = 0; i < 300 && idle < 3; i++) {
        idle = (await hop()) < 1.5 ? idle + 1 : 0
      }
    },

    // One character at a time into input[name]. Everything between one
    // keystroke and the next is charged to the first, the first `warmup` are
    // dropped, and each counter comes back as its median per keystroke.
    type: async (name, keystrokes, warmup) => {
      const input = document.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )
      const setValue = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      )?.set
      if (!input || !setValue) {
        throw new Error(`no input named ${name}`)
      }

      const deltas: Counters[] = []
      for (let i = 0; i < keystrokes; i++) {
        await harness.settle()
        const before = harness.counters()
        setValue.call(input, `${input.value}a`)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        await harness.settle()
        await new Promise((resolve) => setTimeout(resolve, 40))
        const after = harness.counters()
        if (i >= warmup) {
          deltas.push(
            Object.fromEntries(
              Object.keys(after).map((key) => [
                key,
                after[key] - (before[key] ?? 0),
              ])
            )
          )
        }
      }

      const median = (values: number[]) =>
        [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
      const keys = [...new Set(deltas.flatMap((delta) => Object.keys(delta)))]
      return Object.fromEntries(
        keys.map((key) => [key, median(deltas.map((delta) => delta[key] ?? 0))])
      )
    },
  }

  window.__render = harness
}

/**
 * Loads `definition` into the editor at `route` with the harness installed,
 * and returns once the form is on screen and the thread is idle.
 *
 * `/reactive` is a controlled host: it hands `value` back on every change,
 * which is the case the render path is written for. `/` never does, so a
 * keystroke there renders no fields -- right for isolating a subscription,
 * wrong for measuring what a controlled host pays.
 */
export async function openScenario(
  page: Page,
  definition: object,
  route: '/' | '/reactive'
) {
  await page.addInitScript(install)
  await inject(page, JSON.stringify(definition))
  await page.goto(route)
  await page.locator('input[name]').first().waitFor()
  await settle(page)

  // Every scenario mounts fields, so a probed build has counted renders by
  // now. None means the probes are not in this build, and each budget would
  // read a zero that measured nothing and ask for it to be recorded.
  const mounted = await readCounters(page)
  if (!mounted.render) {
    throw new Error(
      'No render was counted on mount: this build has no probes. ' +
        'Run `pnpm benchmark:probes --strict`, then build and start it.'
    )
  }
}

export function settle(page: Page) {
  return page.evaluate(() => window.__render.settle())
}

export function resetCounters(page: Page) {
  return page.evaluate(() => window.__render.reset())
}

export function readCounters(page: Page) {
  return page.evaluate(() => window.__render.counters())
}

/** Atoms cached across every `atomFamily`, the whole page's worth. */
export async function cachedAtoms(page: Page) {
  const sizes = await page.evaluate(() => window.__render.familySizes())
  return sizes.reduce((total, size) => total + size, 0)
}

/** The median of each counter per keystroke typed into `input[name]`. */
export function countPerKeystroke(
  page: Page,
  name: string,
  keystrokes = 8,
  warmup = 2
) {
  return page.evaluate(
    (args) => window.__render.type(args.name, args.keystrokes, args.warmup),
    { name, keystrokes, warmup }
  )
}

/**
 * Replaces the definition without a reload, the way the editor does when its
 * JSON changes: `atomWithStorage` listens for `storage` events.
 */
export async function swap(page: Page, definition: object) {
  await page.evaluate((code) => {
    const newValue = JSON.stringify(code)
    window.localStorage.setItem('luna-editor:code', newValue)
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'luna-editor:code',
        newValue,
        storageArea: window.localStorage,
      })
    )
  }, JSON.stringify(definition))
}

/** A definition the form never references: enough to make `prepare` resolve. */
export const UNUSED_DEFINITION = { definition: { unused: { label: 'x' } } }

/** `count` plain text inputs, named `<prefix>_1` to `<prefix>_<count>`. */
export function flat(count: number, extra: object = {}, prefix = 'field') {
  return {
    ...extra,
    sections: [
      {
        fields: Array.from({ length: count }, (_, i) => ({
          label: `${prefix} ${i + 1}`,
          name: `${prefix}_${i + 1}`,
          type: 'input/text',
        })),
      },
    ],
  }
}

/** A plain field beside a list of `rows` seeded rows, two leaves each. */
export function plainAndList(rows: number, extra: object = {}) {
  return {
    ...extra,
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
  }
}

/** A checkbox that hides the only field of the last of `count` sections. */
export function sectionsWithToggle(count: number) {
  return {
    sections: [
      {
        fields: [
          {
            name: 'toggle',
            label: 'Toggle',
            type: 'checkbox',
            event: {
              change: [
                {
                  action: 'state',
                  target: `f${count}`,
                  state: { hidden: true },
                  when: true,
                },
              ],
            },
          },
        ],
      },
      ...Array.from({ length: count }, (_, i) => ({
        title: `S${i + 1}`,
        fields: [{ name: `f${i + 1}`, label: `F${i + 1}`, type: 'input/text' }],
      })),
    ],
  }
}

/** A checkbox that disables a `select/timezone`, which re-renders the field. */
export const timezoneToggle = {
  sections: [
    {
      fields: [
        { name: 'note', label: 'Note', type: 'input/text' },
        {
          name: 'toggle',
          label: 'Toggle',
          type: 'checkbox',
          event: {
            change: [
              {
                action: 'state',
                target: 'tz',
                state: { disabled: true },
                when: true,
              },
            ],
          },
        },
        { name: 'tz', label: 'Timezone', type: 'select/timezone' },
      ],
    },
  ],
}

/** A list of groups, each row holding a list of its own. */
export const nestedGroups = {
  sections: [
    {
      fields: [
        {
          name: 'groups',
          label: 'Groups',
          type: 'list',
          fields: [
            { name: 'label', label: 'Label', type: 'input/text' },
            {
              name: 'checks',
              label: 'Checks',
              type: 'list',
              fields: [{ name: 'v', label: 'V', type: 'input/text' }],
            },
          ],
        },
      ],
    },
  ],
}
