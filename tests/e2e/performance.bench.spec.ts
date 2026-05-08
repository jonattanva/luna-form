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

test.describe('E2E Benchmark', { tag: ['@benchmark', '@perf'] }, () => {
  test('benchmark: form performance (50 fields)', async ({ page }) => {
    const fields = generateFields(50)

    await inject(
      page,
      JSON.stringify({
        sections: [{ fields }],
      })
    )

    // Measure Load Time
    const startTime = Date.now()
    await page.goto('')
    await page.locator('input[name="field_1"]').waitFor()
    const loadTime = Date.now() - startTime

    // Measure Interaction Time (10 fields)
    const interactionStart = Date.now()
    for (let i = 1; i <= 10; i++) {
      const input = page.locator(`input[name="field_${i}"]`)
      await input.fill(`value ${i}`)
      await input.blur()
    }
    const interactionTime = Date.now() - interactionStart

    const allInputs = page.locator('input[type="text"]')
    await expect(allInputs).toHaveCount(50)

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

    // Update the benchmark output file
    const outputPath = 'benchmark-e2e-output.json'

    // Write results directly to file, replacing previous content
    writeFileSync(outputPath, JSON.stringify(benchmarkResult, null, 2) + '\n')
  })
})
