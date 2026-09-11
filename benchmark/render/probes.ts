import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * Counters for what a keystroke costs the form, patched into the library
 * source of whatever commit is checked out.
 *
 *   pnpm benchmark:probes
 *
 * Then build, serve, and read them from the page with the harness in this
 * folder's README. Revert with `git checkout -- packages`.
 *
 * Every probe patches one anchor and is skipped when that anchor is not in the
 * commit, so the same script measures any commit in the history and a counter
 * means the same thing on every commit it applies to. Read what it prints: a
 * skipped probe counts nothing, and the zero it leaves behind is not a
 * measurement.
 *
 * Nothing here changes behaviour. The counters are writes to `globalThis`, and
 * the family wrapper hands back the family it was given.
 */

type Probe = Readonly<{
  anchor: string
  file: string
  name: string
  replacement: string
}>

const LIB = 'packages/luna-react/src'

const COUNTERS =
  'globalThis as typeof globalThis & { __luna?: Record<string, number> }'

function bump(counter: string) {
  return (
    `{ const __g = ${COUNTERS}; const __c = __g.__luna ?? (__g.__luna = {}); ` +
    `__c.${counter} = (__c.${counter} ?? 0) + 1 }`
  )
}

const FAMILY_IMPORT = "import { atomFamily } from 'jotai-family'"

// Every family registers itself as it is created, so the page can count what
// each one has cached through `getParams()`.
const FAMILY_WRAP = `import { atomFamily as untrackedAtomFamily } from 'jotai-family'
const atomFamily = ((...args: Parameters<typeof untrackedAtomFamily>) => {
  const family = untrackedAtomFamily(...args)
  const g = globalThis as typeof globalThis & { __lunaFamilies?: Array<typeof family> }
  if (!g.__lunaFamilies) g.__lunaFamilies = []
  g.__lunaFamilies.push(family)
  return family
}) as typeof untrackedAtomFamily`

const PROBES: Probe[] = [
  {
    name: 'render',
    file: `${LIB}/component/field/field.tsx`,
    anchor: 'export function Field(props: FieldProps) {',
    replacement: `export function Field(props: FieldProps) {\n  ${bump('render')}`,
  },
  {
    name: 'schema',
    file: `${LIB}/client/hook/use-input.ts`,
    anchor: '() => getSchema(field, translations),',
    replacement: `() => { ${bump('schema')}; return getSchema(field, translations) },`,
  },
  // `useValue` read the host's record as a prop until it subscribed to its own
  // entry. The second anchor stops at the call, so it matches every shape the
  // entry has been passed in since; one of the two applies on any commit.
  {
    name: 'effect (record prop)',
    file: `${LIB}/client/hook/use-value.ts`,
    anchor: '  useEffect(() => {\n    if (currentValue) {',
    replacement: `  useEffect(() => {\n    ${bump('effect')}\n    if (currentValue) {`,
  },
  {
    name: 'effect (entry)',
    file: `${LIB}/client/hook/use-value.ts`,
    anchor: '  useEffect(() => {\n    onEntryChange(',
    replacement: `  useEffect(() => {\n    ${bump('effect')}\n    onEntryChange(`,
  },
  {
    name: 'lookup',
    file: `${LIB}/client/hook/use-input-core.ts`,
    anchor: '  function getField(target: string) {',
    replacement: `  function getField(target: string) {\n    ${bump('lookup')}`,
  },
  {
    name: 'families: store-helper',
    file: `${LIB}/client/lib/store-helper.ts`,
    anchor: FAMILY_IMPORT,
    replacement: FAMILY_WRAP,
  },
  {
    name: 'families: host-value-store',
    file: `${LIB}/client/lib/host-value-store.ts`,
    anchor: FAMILY_IMPORT,
    replacement: FAMILY_WRAP,
  },
]

if (!existsSync(join(process.cwd(), LIB))) {
  throw new Error(`run from the repository root: no ${LIB} here`)
}

const applied: string[] = []
const skipped: string[] = []

for (const probe of PROBES) {
  const path = join(process.cwd(), probe.file)
  if (!existsSync(path)) {
    skipped.push(`${probe.name} (no such file in this commit)`)
    continue
  }

  const source = readFileSync(path, 'utf8')
  if (source.includes(probe.replacement)) {
    applied.push(`${probe.name} (already)`)
    continue
  }

  const matches = source.split(probe.anchor).length - 1
  if (matches === 0) {
    skipped.push(`${probe.name} (anchor not in this commit)`)
    continue
  }

  if (matches > 1) {
    throw new Error(`${probe.name}: the anchor matches ${matches} times`)
  }

  writeFileSync(
    path,
    source.replace(probe.anchor, () => probe.replacement)
  )
  applied.push(probe.name)
}

console.log(`applied: ${applied.join(', ') || 'none'}`)
console.log(`skipped: ${skipped.join(', ') || 'none'}`)
