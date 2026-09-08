import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

/**
 * A field must never be observable holding nothing when it has been given
 * something to hold.
 *
 * `useValue` seeds the store from an effect, so an input painted on the first
 * commit renders against an empty atom and only receives its value on the
 * next one. The gap is small and entirely invisible in a settled assertion --
 * `toHaveValue` polls, and by the time it looks the value is there -- which is
 * why this is measured as a sequence rather than as a final state.
 *
 * It is not cosmetic. The field is mounted, focusable and empty for that gap,
 * so anything arriving inside it is either lost or overwritten a moment later:
 * a value typed into it is replaced by the seeding commit, and a `fill('')`
 * lands on an input that is already empty, which React's change tracking reads
 * as no change at all and reports to nobody. Measured in a consumer, that is
 * an emptied field silently refilling itself with the value it started with
 * and the user's typing landing behind it.
 */

const DEFINITION = JSON.stringify(
  {
    sections: [
      {
        fields: [
          {
            advanced: { data: { testid: 'fed' } },
            label: 'Fed',
            name: 'fed',
            type: 'input/text',
          },
          {
            advanced: { data: { testid: 'seeded' } },
            defaultValue: 'guest',
            label: 'Seeded',
            name: 'seeded',
            type: 'input/text',
          },
          {
            advanced: { data: { testid: 'blank' } },
            label: 'Blank',
            name: 'blank',
            type: 'input/text',
          },
          {
            advanced: { data: { testid: 'fedT' }, transform: 'uppercase' },
            label: 'Fed, transformed',
            name: 'fedT',
            type: 'input/text',
          },
          {
            advanced: { data: { testid: 'seededT' }, transform: 'uppercase' },
            defaultValue: 'guest',
            label: 'Seeded, transformed',
            name: 'seededT',
            type: 'input/text',
          },
        ],
      },
    ],
    value: { fed: 'Manual Trigger', fedT: 'manual trigger' },
  },
  null,
  2
)

type Paints = Record<string, string[]>

declare global {
  interface Window {
    __paints?: Paints
  }
}

/**
 * Records every distinct value each named field is seen holding, in order,
 * from before the page has run a line of its own script.
 *
 * Sampled two ways because one alone can miss the gap. A `MutationObserver`
 * catches the commits, but React can flush two of them into a single microtask
 * checkpoint and the callback would then only ever see the second. A
 * `requestAnimationFrame` loop catches whatever survives to a paint, but not a
 * state that is replaced within the same frame. Their union is what "was this
 * ever observable" honestly means here.
 *
 * Consecutive duplicates are dropped so the result is a list of transitions
 * rather than a sample count, which is what the assertions read.
 */
async function recordPaints(page: Page, names: string[]) {
  await page.addInitScript((names: string[]) => {
    const paints: Paints = {}
    for (const name of names) {
      paints[name] = []
    }
    window.__paints = paints

    function sample() {
      for (const name of names) {
        const input = document.querySelector<HTMLInputElement>(
          `[name="${name}"]`
        )
        if (!input) {
          continue
        }

        const seen = paints[name]
        if (seen && seen[seen.length - 1] !== input.value) {
          seen.push(input.value)
        }
      }
    }

    new MutationObserver(sample).observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    function frame() {
      sample()
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, names)
}

test.describe('Value first paint', { tag: ['@e2e'] }, () => {
  test('never shows a field empty before giving it the value it was fed', async ({
    page,
  }) => {
    await inject(page, DEFINITION)
    await recordPaints(page, ['fed', 'seeded', 'blank', 'fedT', 'seededT'])

    await page.goto('/reactive')

    // Settled state first, so a failure below is unambiguously about *when* the
    // value arrived and never about whether it arrives at all.
    await expect(page.getByTestId('fed')).toHaveValue('Manual Trigger')
    await expect(page.getByTestId('seeded')).toHaveValue('guest')
    await expect(page.getByTestId('blank')).toHaveValue('')
    await expect(page.getByTestId('fedT')).toHaveValue('MANUAL TRIGGER')
    await expect(page.getByTestId('seededT')).toHaveValue('GUEST')

    const paints = await page.evaluate(() => window.__paints)

    // The instrument itself, asserted before anything is read from it: an
    // observer that never fired would make every claim below vacuously true.
    expect(
      paints?.fed?.length,
      'the recorder saw nothing at all'
    ).toBeGreaterThan(0)
    expect(
      paints?.seeded?.length,
      'the recorder saw nothing at all'
    ).toBeGreaterThan(0)
    expect(
      paints?.blank?.length,
      'the recorder saw nothing at all'
    ).toBeGreaterThan(0)
    expect(
      paints?.fedT?.length,
      'the recorder saw nothing at all'
    ).toBeGreaterThan(0)
    expect(
      paints?.seededT?.length,
      'the recorder saw nothing at all'
    ).toBeGreaterThan(0)

    // The two ways a field is given a value, which reach the store through the
    // same effect and so fail the same way. Soft, all three of them, so a run
    // reports which routes are broken rather than only the first: they are one
    // property observed in three places, and knowing it held for `seeded` while
    // failing for `fed` is the whole diagnostic value of measuring both.
    expect
      .soft(paints?.fed, 'a field fed by the value prop was observable empty')
      .toEqual(['Manual Trigger'])

    expect
      .soft(
        paints?.seeded,
        'a field carrying a defaultValue was observable empty'
      )
      .toEqual(['guest'])

    // A `transform` has to be applied before the first paint rather than after
    // it, or the flash comes back as the value rewriting itself: the raw text
    // painted, the transformed text a commit later. `getInputValue` falls back
    // to a `defaultValue` on its own but hands over the raw one, so this is the
    // route that kept flashing after the one above was fixed.
    expect
      .soft(
        paints?.fedT,
        'a transformed value was painted raw before it was transformed'
      )
      .toEqual(['MANUAL TRIGGER'])

    expect
      .soft(
        paints?.seededT,
        'a transformed defaultValue was painted raw before it was transformed'
      )
      .toEqual(['GUEST'])

    // The counterweight. A field given nothing is *supposed* to read empty, so
    // this is the case the assertions above must not be able to reach by
    // accident -- if the seeding were made eager by writing something into
    // every field, this is what would catch it.
    expect
      .soft(paints?.blank, 'a field given nothing should never hold anything')
      .toEqual([''])
  })
})
