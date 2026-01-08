import { expect, test } from '@playwright/test'

test.describe('Minimal test', { tag: ['@e2e'] }, () => {
  test('should navigate to the editor and see the title', async ({ page }) => {
    await page.goto('')
    await expect(page).toHaveTitle(/Luna | Editor/)
  })
})
