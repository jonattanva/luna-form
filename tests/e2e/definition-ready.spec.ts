import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// The editor reads the definition a test injects from `localStorage`, which
// the server cannot see. A Submit the page offers before it has read the
// definition sends a form with no fields, and succeeds: the test then waits
// for a message that was never going to come. No Submit may be clickable
// before the definition it submits.
//
// The page clicks Submit itself, in the first moment one is there to click:
// right after the React commit that first shows a hydrated Submit, before the
// effects of that commit run. That is the earliest a person or a test could
// reach it, made deterministic instead of left to timing.

const REQUIRED = 'Name is required'
const SUCCESS = 'Form submitted successfully'

const DEFINITION = JSON.stringify({
  sections: [
    {
      fields: [
        {
          label: 'Name',
          name: 'name',
          type: 'input/text',
          required: true,
          validation: { required: REQUIRED },
        },
      ],
    },
  ],
})

/**
 * Clicks Submit once, from inside the page, after the first React commit that
 * holds a hydrated Submit. React calls the devtools hook on every commit, in
 * development and production builds alike, before it runs that commit's
 * passive effects; a microtask runs before them too.
 */
async function clickOnFirstCommit(page: Page) {
  await page.addInitScript(() => {
    const isHydrated = (element: Element) =>
      Object.keys(element).some((key) => key.startsWith('__reactProps$'))

    let clicked = false
    const clickSubmit = () => {
      if (clicked) {
        return
      }
      const submit = Array.from(
        document.querySelectorAll('button[type="submit"]')
      ).find((button) => button.textContent === 'Submit' && isHydrated(button))
      if (submit instanceof HTMLButtonElement) {
        clicked = true
        document.documentElement.dataset.clickedOnCommit = 'true'
        submit.click()
      }
    }

    const renderers = new Map<number, object>()
    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      configurable: true,
      value: {
        renderers,
        supportsFiber: true,
        isDisabled: false,
        inject(renderer: object) {
          const id = renderers.size + 1
          renderers.set(id, renderer)
          return id
        },
        checkDCE() {},
        onScheduleFiberRoot() {},
        onCommitFiberRoot() {
          queueMicrotask(clickSubmit)
        },
        onCommitFiberUnmount() {},
        onPostCommitFiberRoot() {},
      },
    })
  })
}

test.describe('The definition a test injects', { tag: ['@e2e'] }, () => {
  for (const route of ['/', '/reactive']) {
    test(`is read before Submit can be clicked on ${route}`, async ({
      page,
    }) => {
      await inject(page, DEFINITION)
      await clickOnFirstCommit(page)
      await page.goto(route)

      await expect(page.locator('html')).toHaveAttribute(
        'data-clicked-on-commit',
        'true'
      )
      const required = page.getByText(REQUIRED, { exact: true })
      // Whichever comes first, so the empty submit fails here, not on a timeout.
      await expect(required.or(page.getByText(SUCCESS))).toBeVisible()
      await expect(page.getByText(SUCCESS)).toHaveCount(0)
      await expect(required).toBeVisible()
    })
  }
})
