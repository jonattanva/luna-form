import type { ConsoleMessage, Page } from '@playwright/test'

export type ValueChange = { name: string; value: unknown }

/**
 * Everything the form has told the consumer, in order.
 *
 * Read off the console because that is where the harness puts it: both preview
 * pages log `onValueChange` before doing anything with it, so this is the
 * consumer's side of the contract observed from outside, without reaching into
 * the page.
 *
 * Call it *before* `page.goto` -- the listener has to be attached in time for
 * the changes a form fires while it mounts.
 */
export function captureValueChanges(page: Page): ValueChange[] {
  const events: ValueChange[] = []

  page.on('console', (message: ConsoleMessage) => {
    if (!message.text().startsWith('Form values changed:')) {
      return
    }

    const arg = message.args()[1]
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

/** The most recent change reported for `name`, or `undefined` if there was none. */
export function lastEventFor(
  events: ValueChange[],
  name: string
): ValueChange | undefined {
  for (let index = events.length - 1; index >= 0; index--) {
    if (events[index]?.name === name) {
      return events[index]
    }
  }
}
