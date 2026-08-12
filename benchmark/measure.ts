export type BenchmarkResult = {
  name: string
  unit: string
  value: number
}

const WARMUP_ITERATIONS = 5000
const MEASURED_ITERATIONS = 50000

/**
 * Times one operation, in milliseconds per call.
 *
 * Shared by every benchmark in this folder on purpose: the warm-up and the
 * iteration count are what make two numbers comparable, and a second copy of
 * them drifts the moment one file is tuned and the other is not.
 */
export function measure(label: string, fn: () => void): BenchmarkResult {
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    fn()
  }

  const start = performance.now()
  for (let i = 0; i < MEASURED_ITERATIONS; i++) {
    fn()
  }

  return {
    name: label,
    unit: 'ms',
    value: (performance.now() - start) / MEASURED_ITERATIONS,
  }
}

export function report(results: BenchmarkResult[]) {
  process.stdout.write(JSON.stringify(results, null, 2) + '\n')
}
