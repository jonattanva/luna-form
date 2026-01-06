import type { Page } from '@playwright/test'

const STORAGE_KEY = 'luna-editor:code'

export async function inject(page: Page, value: string) {
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, JSON.stringify(value))
    },
    { key: STORAGE_KEY, value }
  )
}
