import { writeFileSync } from 'fs'
import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

function generateFields(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    label: `Field ${i + 1}`,
    name: `field_${i + 1}`,
    type: 'input/text',
  }))
}

test.describe('Performance', { tag: ['@e2e', '@perf'] }, () => {
  test('should handle form with 50 fields efficiently', async ({ page }) => {
    const fields = generateFields(50)

    await inject(
      page,
      JSON.stringify({
        sections: [{ fields }],
      })
    )

    const startTime = Date.now()
    await page.goto('')
    await page.locator('input[name="field_1"]').waitFor()
    const loadTime = Date.now() - startTime

    const interactionStart = Date.now()
    for (let i = 1; i <= 10; i++) {
      const input = page.locator(`input[name="field_${i}"]`)
      await input.fill(`value ${i}`)
      await input.blur()
    }
    const interactionTime = Date.now() - interactionStart

    const allInputs = page.locator('input[type="text"]')
    await expect(allInputs).toHaveCount(50)

    expect(loadTime).toBeLessThan(5000)
    expect(interactionTime).toBeLessThan(3000)

    writeFileSync(
      'benchmark-e2e-output.json',
      JSON.stringify(
        [
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
        ],
        null,
        2
      ) + '\n'
    )
  })
})
