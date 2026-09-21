import { execFileSync } from 'node:child_process'
import { expect, test } from '@playwright/test'

// The README offers `react-luna-form/server` as an entry "usable under the
// `react-server` condition", and both examples import it from a Server
// Component. It stopped loading there when the shared tree started rendering
// pieces that read state: React's `react-server` build exports `use`,
// `useMemo` and `useCallback` and nothing else, so an import of `createContext`
// or `useState` -- jotai reaches for the first as it loads -- fails while the
// module is linked, before a single component renders.
//
// Node is the whole test: the condition is a resolver flag, and the entry
// either links under it or it does not. The e2e job builds `dist` before it
// runs, which is what this imports.
test.describe('Server entry', { tag: ['@e2e'] }, () => {
  test('should load under the react-server condition', () => {
    const run = () =>
      execFileSync(
        process.execPath,
        [
          '--conditions=react-server',
          '--input-type=module',
          '-e',
          "await import('react-luna-form/server')",
        ],
        { cwd: 'apps/react-luna-editor', stdio: 'pipe' }
      )

    expect(run).not.toThrow()
  })

  // And that it renders: `/server` in the editor is a Server Component with
  // nothing above it saying "use client", so Next resolves the entry under the
  // condition and renders the form before any JavaScript runs. Read from the
  // response body rather than from the page, because that is the half a browser
  // cannot tell apart from hydration.
  test('should render the fields from a Server Component', async ({
    page,
    request,
  }) => {
    const html = await (await request.get('/server')).text()

    expect(html).toContain('name="name"')
    expect(html).toContain('name="email"')
    expect(html).toContain('Server rendered')

    await page.goto('/server')

    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })
})
