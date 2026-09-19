import { expect, test, type Page } from '@playwright/test'
import {
  UNUSED_DEFINITION,
  cachedAtoms,
  countPerKeystroke,
  flat,
  nestedGroups,
  openScenario,
  plainAndList,
  readCounters,
  resetCounters,
  sectionsWithToggle,
  settle,
  swap,
  timezoneToggle,
  type Counters,
} from './support/render-counters'

/**
 * Render budgets: what a keystroke, a state change or a churned list costs the
 * form, counted rather than timed, on a probed production build.
 *
 *   pnpm benchmark:probes --strict
 *   pnpm run build
 *   pnpm start
 *   pnpm test:render
 *
 * Each budget records the counts the current code produces and fails when they
 * move either way. Up is a regression. Down is an improvement that has to be
 * written down: the PR that makes something cheaper lowers its numbers here,
 * so the budget fails until the change is in -- the failing test first, the
 * fix second. `target` is where the audit of main at 14a90c2 says a count
 * should end up. It is printed when a budget fails and never asserted.
 *
 * The ids are that audit's findings. Every count below was measured on
 * Chromium against `pnpm start`, and repeats exactly between runs.
 */

type Budget = Readonly<{
  id: string
  title: string
  counts: Counters
  target: Counters
  measure: (page: Page) => Promise<Counters>
}>

// A missing counter did not fire, which for a budget is a count of zero.
function pick(from: Counters, keys: string[]): Counters {
  return Object.fromEntries(keys.map((key) => [key, from[key] ?? 0]))
}

async function churnRows(page: Page) {
  for (let i = 0; i < 10; i++) {
    await page.getByRole('button', { name: 'Add item' }).last().click()
    await settle(page)
  }
  for (let i = 0; i < 10; i++) {
    await page.getByRole('button', { name: 'Remove Groups item 2' }).click()
    await settle(page)
  }
}

const BUDGETS: Budget[] = [
  {
    id: 'REN-1',
    title: 'fields filled in earlier stay out of a keystroke',
    // What a field is handed is the array the store holds, so a field the user
    // has touched matches its memo like any other.
    counts: { render: 0 },
    target: { render: 0 },
    measure: async (page) => {
      await openScenario(page, flat(30), '/reactive')
      for (let i = 1; i <= 10; i++) {
        await page.locator(`input[name="field_${i}"]`).fill('x')
      }
      return countPerKeystroke(page, 'field_30')
    },
  },
  {
    id: 'REN-2',
    title: 'the two wrappers around every field render on every keystroke',
    // `withState(withError(memo(Field)))`: the memo is the innermost layer.
    counts: { wrapper: 200 },
    target: { wrapper: 0 },
    measure: async (page) => {
      await openScenario(page, flat(100), '/reactive')
      return countPerKeystroke(page, 'field_2')
    },
  },
  {
    id: 'REN-3',
    title: 'a definition re-renders every field and rebuilds its schema',
    // `prepare` resolves $refs into new objects on every render.
    counts: { render: 30, schema: 30 },
    target: { render: 0, schema: 0 },
    measure: async (page) => {
      await openScenario(page, flat(30, UNUSED_DEFINITION), '/reactive')
      return countPerKeystroke(page, 'field_30')
    },
  },
  {
    id: 'REN-3',
    title: 'a definition runs the list hand-off on every keystroke',
    counts: { handoff: 1 },
    target: { handoff: 0 },
    measure: async (page) => {
      await openScenario(page, plainAndList(5, UNUSED_DEFINITION), '/reactive')
      return countPerKeystroke(page, 'plain')
    },
  },
  {
    id: 'REN-4',
    title: 'a keystroke outside a list leaves its rows alone',
    // On the uncontrolled route, so only a row's own subscription could render
    // it. This list declares no preview, so no row has a condition to answer
    // and none of them subscribes at all.
    counts: { rowPreview: 0, liveScan: 0 },
    target: { rowPreview: 0, liveScan: 0 },
    measure: async (page) => {
      await openScenario(page, plainAndList(30), '/')
      return countPerKeystroke(page, 'plain')
    },
  },
  {
    id: 'REN-5',
    title: 'one state change renders only the guard it concerns',
    counts: { guard: 1 },
    target: { guard: 1 },
    measure: async (page) => {
      await openScenario(page, sectionsWithToggle(20), '/')
      await resetCounters(page)
      await page.getByRole('checkbox', { name: /Toggle/ }).click()
      // Wait for the last section to go, so the one render counted is the one
      // that hides it rather than a count taken before anything happened.
      await page.locator('input[name="f20"]').waitFor({ state: 'detached' })
      await settle(page)
      return readCounters(page)
    },
  },
  {
    id: 'REN-6',
    title: 'the timezone list is rebuilt when its field re-renders',
    // 406 zones and two Intl formatters each: about 63 ms a build in Node.
    counts: { tz: 1 },
    target: { tz: 0 },
    measure: async (page) => {
      await openScenario(page, timezoneToggle, '/')
      await resetCounters(page)
      await page.getByRole('checkbox', { name: /Toggle/ }).click()
      await settle(page)
      return readCounters(page)
    },
  },
  {
    id: 'SOB-1',
    title: 'cached atoms grow with every definition the form has shown',
    // Ten definitions of ten fields each: `hostEntryAtom` is never released.
    counts: { atoms: 100 },
    target: { atoms: 0 },
    measure: async (page) => {
      await openScenario(page, flat(10, {}, 's0'), '/')
      const before = await cachedAtoms(page)
      for (let s = 1; s <= 10; s++) {
        await swap(page, flat(10, {}, `s${s}`))
        await page.locator(`input[name="s${s}_1"]`).waitFor()
        await settle(page)
      }
      return { atoms: (await cachedAtoms(page)) - before }
    },
  },
  {
    id: 'SOB-1',
    title: 'cached atoms grow with every row a nested list has held',
    // Two more rounds of adding and removing ten rows, after a first one has
    // reached every position: what is left is growth by stable id.
    counts: { atoms: 40 },
    target: { atoms: 0 },
    measure: async (page) => {
      await openScenario(page, nestedGroups, '/')
      await churnRows(page)
      const afterFirstRound = await cachedAtoms(page)
      await churnRows(page)
      await churnRows(page)
      return { atoms: (await cachedAtoms(page)) - afterFirstRound }
    },
  },
]

test.describe('Render budgets', { tag: ['@render'] }, () => {
  // A budget read off the wrong build passes or fails for the wrong reason:
  // no probes counts nothing, and development doubles `render` and `schema`.
  test('counts come from a probed production build', async ({ page }) => {
    await openScenario(page, flat(30), '/reactive')
    const counters = await readCounters(page)
    expect(
      counters.render,
      'one inner Field render per field on mount: 0 is an unprobed build, 60 is development'
    ).toBe(30)

    const alive = pick(counters, ['schema', 'wrapper', 'prepare', 'guard'])
    expect(
      Object.values(alive).every((count) => count > 0),
      `every counter that fires on mount has to be alive: ${JSON.stringify(alive)}`
    ).toBe(true)
    expect(await cachedAtoms(page)).toBeGreaterThan(0)
  })

  for (const budget of BUDGETS) {
    test(`${budget.id}: ${budget.title}`, async ({ page }) => {
      const measured = pick(
        await budget.measure(page),
        Object.keys(budget.counts)
      )
      expect(
        measured,
        `${budget.id} moved. Lower: record the new counts in this budget ` +
          `(target ${JSON.stringify(budget.target)}). Higher: a regression.`
      ).toEqual(budget.counts)
    })
  }
})
