import { writeFileSync } from 'fs'
import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

/**
 * Browser benchmarks, stored on gh-pages by `performance.yml` and alerted on
 * at 2x, so a number here has to repeat between runs on a shared runner.
 *
 * Both are timed inside the page with `performance.now()`, never across
 * Playwright round trips, and each is the median of several samples taken
 * after warm-up runs. The interaction is measured once the editor has booted
 * and the main thread is idle: Monaco loads from a CDN, and a sample that
 * overlaps its start-up times the network rather than the form.
 */

const FIELDS = 50
const INTERACTION_FIELDS = 10
const LOAD = { warmup: 1, samples: 7 }
const INTERACTION = { warmup: 3, samples: 15 }

declare global {
  interface Window {
    __bench: {
      loaded?: number
      settle: () => Promise<void>
      interact: (fields: number, round: number) => Promise<number>
    }
  }
}

function generateFields(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    label: `Field ${i + 1}`,
    name: `field_${i + 1}`,
    type: 'input/text',
  }))
}

// Runs inside the page ahead of its own scripts, on every navigation. Nothing
// in here may close over anything on the Node side.
function install() {
  // One macrotask hop; resolves with how long the thread was busy before it.
  const hop = () =>
    new Promise<number>((resolve) => {
      const started = performance.now()
      const channel = new MessageChannel()
      channel.port1.onmessage = () => resolve(performance.now() - started)
      channel.port2.postMessage(0)
    })

  // Until the thread comes back free three hops running.
  const settle = async () => {
    let idle = 0
    for (let i = 0; i < 300 && idle < 3; i++) {
      idle = (await hop()) < 1.5 ? idle + 1 : 0
    }
  }

  const bench: Window['__bench'] = {
    settle,

    // Fills `fields` inputs the way a user does, one task per field, and
    // returns the time until the thread is first idle again: the work the
    // form deferred past the event is charged too.
    interact: async (fields, round) => {
      const setValue = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      )?.set
      if (!setValue) {
        throw new Error('no value setter on HTMLInputElement')
      }

      const started = performance.now()
      for (let i = 1; i <= fields; i++) {
        const input = document.querySelector<HTMLInputElement>(
          `input[name="field_${i}"]`
        )
        if (!input) {
          throw new Error(`no input named field_${i}`)
        }
        input.focus()
        setValue.call(input, `value ${i} round ${round}`)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.blur()
        await hop()
      }

      for (let i = 0; i < 300; i++) {
        const before = performance.now()
        if ((await hop()) < 1.5) {
          return before - started
        }
      }
      return performance.now() - started
    },
  }
  window.__bench = bench

  // The moment the first field is in the document, from navigation start.
  const observer = new MutationObserver(() => {
    if (document.querySelector('input[name="field_1"]')) {
      bench.loaded = performance.now()
      observer.disconnect()
    }
  })
  observer.observe(document, { childList: true, subtree: true })
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2
}

async function measureLoad(page: Page) {
  await page.goto('')
  await page.locator('input[name="field_1"]').waitFor()
  const loaded = await page.evaluate(() => window.__bench.loaded)
  if (loaded === undefined) {
    throw new Error('the first field was never observed')
  }
  return loaded
}

async function sample(
  { warmup, samples }: { warmup: number; samples: number },
  measure: (round: number) => Promise<number>
) {
  const values: number[] = []
  for (let round = 0; round < warmup + samples; round++) {
    const value = await measure(round)
    if (round >= warmup) {
      values.push(value)
    }
  }
  return Math.round(median(values) * 10) / 10
}

test.describe('E2E Benchmark', { tag: ['@benchmark', '@perf'] }, () => {
  test('benchmark: form performance (50 fields)', async ({ page }) => {
    test.setTimeout(120000)

    await page.addInitScript(install)
    await inject(
      page,
      JSON.stringify({
        sections: [{ fields: generateFields(FIELDS) }],
      })
    )

    const loadTime = await sample(LOAD, () => measureLoad(page))

    await expect(page.locator('input[type="text"]')).toHaveCount(FIELDS)
    await page.locator('.monaco-editor').first().waitFor()
    await page.evaluate(() => window.__bench.settle())

    const interactionTime = await sample(INTERACTION, (round) =>
      page.evaluate(
        (args) => window.__bench.interact(args.fields, args.round),
        { fields: INTERACTION_FIELDS, round }
      )
    )

    await expect(page.locator('input[name="field_1"]')).toHaveValue(
      `value 1 round ${INTERACTION.warmup + INTERACTION.samples - 1}`
    )

    const benchmarkResult = [
      {
        name: 'browser: form load time (50 fields)',
        unit: 'ms',
        value: loadTime,
      },
      {
        name: 'browser: interaction time (10 fields)',
        unit: 'ms',
        value: interactionTime,
      },
    ]

    console.log('Benchmark Results:', JSON.stringify(benchmarkResult, null, 2))

    // Replaces the previous content: the workflow reads this file as is.
    writeFileSync(
      'benchmark-e2e-output.json',
      JSON.stringify(benchmarkResult, null, 2) + '\n'
    )
  })
})
