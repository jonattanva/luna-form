import { expect, test } from '@playwright/test'

// Temporary: fails on its first attempt and passes on retry, to prove the
// e2e-report job lists a flaky case. Removed before the change is merged.
test.describe('Flaky repro', { tag: ['@e2e'] }, () => {
  test('should pass only on retry', ({}, testInfo) => {
    expect(testInfo.retry).toBeGreaterThan(0)
  })
})
