import { prepare, resolveRefs } from '../packages/luna-core/src/util/prepare'
import type { Field, Section } from '../packages/luna-core/src/type'

type BenchmarkResult = {
  name: string
  unit: string
  value: number
}

const WARMUP_ITERATIONS = 50
const MEASURED_ITERATIONS = 500

function measure(label: string, fn: () => void): BenchmarkResult {
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

function makeFields(count: number): Field[] {
  return Array.from({ length: count }, (_, i) => ({
    label: `Field ${i + 1}`,
    name: `field_${i + 1}`,
    type: 'input/text',
    required: i % 3 === 0,
  }))
}

function makeSections(
  sectionCount: number,
  fieldsPerSection: number
): Section[] {
  return Array.from({ length: sectionCount }, (_, i) => ({
    title: `Section ${i + 1}`,
    fields: makeFields(fieldsPerSection),
  }))
}

const definition = {
  contact: { email: 'user@example.com', phone: '555-1234' },
  address: { street: '123 Main St', city: 'Anytown' },
}

const smallFields = makeFields(10)
const largeFields = makeFields(50)
const simpleSections = makeSections(3, 10)
const largeSections = makeSections(5, 20)

const fieldsWithRefs = Array.from({ length: 20 }, (_, i) => ({
  name: `field_${i}`,
  type: 'input/text',
  label: `Field ${i}`,
  meta: { $ref: i % 2 === 0 ? '#/definition/contact' : '#/definition/address' },
}))

const results: BenchmarkResult[] = [
  measure('prepare: simple form (10 fields)', () => {
    prepare(smallFields, undefined)
  }),

  measure('prepare: large form (50 fields)', () => {
    prepare(largeFields, undefined)
  }),

  measure('prepare: large form (50 fields) with definition', () => {
    prepare(largeFields, definition)
  }),

  measure('prepare: sections (3 sections x 10 fields)', () => {
    prepare(simpleSections, undefined)
  }),

  measure('prepare: sections (5 sections x 20 fields)', () => {
    prepare(largeSections, undefined)
  }),

  measure('resolveRefs: array with $ref (20 items)', () => {
    resolveRefs(fieldsWithRefs, definition)
  }),
]

process.stdout.write(JSON.stringify(results, null, 2) + '\n')
