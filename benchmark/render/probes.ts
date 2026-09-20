import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * Counters for what a keystroke costs the form, patched into the library
 * source of whatever commit is checked out.
 *
 *   pnpm benchmark:probes
 *   pnpm benchmark:probes --strict
 *
 * Then build, serve, and read them from the page with the harness in this
 * folder's README, or run the budgets in `tests/e2e/render-budget.spec.ts`
 * (`pnpm test:render`). Revert with `git checkout -- packages`.
 *
 * Every probe patches one anchor and is skipped when that anchor is not in the
 * commit, so the same script measures any commit in the history and a counter
 * means the same thing on every commit it applies to. Read what it prints: a
 * skipped probe counts nothing, and the zero it leaves behind is not a
 * measurement. `--strict` is for CI, where the commit is the current one: it
 * fails unless every probe that is not a legacy anchor applied.
 *
 * Nothing here changes behaviour. The counters are writes to `globalThis`, and
 * the family wrapper hands back the family it was given.
 */

type Probe = Readonly<{
  anchor: string
  file: string
  // An anchor only older commits have, kept so the script still measures the
  // whole history. `--strict` does not ask for it.
  legacy?: true
  name: string
  replacement: string
}>

const LIB = 'packages/luna-react/src'
const CORE = 'packages/luna-core/src'

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
    legacy: true,
    replacement: `  useEffect(() => {\n    ${bump('effect')}\n    if (currentValue) {`,
  },
  {
    name: 'effect (entry)',
    file: `${LIB}/client/hook/use-value.ts`,
    anchor: '  useEffect(() => {\n    onEntryChange(',
    replacement: `  useEffect(() => {\n    ${bump('effect')}\n    onEntryChange(`,
  },
  // A field looked another one up by walking every registered field, in
  // `useInputCore`, until the registry became a `Map` that answers by name. The
  // second anchor counts every question that registry answers, the check
  // `InputBase` makes before its first events included.
  {
    name: 'lookup (walk)',
    file: `${LIB}/client/hook/use-input-core.ts`,
    anchor: '  function getField(target: string) {',
    legacy: true,
    replacement: `  function getField(target: string) {\n    ${bump('lookup')}`,
  },
  {
    name: 'lookup (registry)',
    file: `${LIB}/client/hook/use-schema.ts`,
    anchor: '(name: string) => registry.current.get(name)?.field,',
    replacement: `(name: string) => { ${bump('lookup')}; return registry.current.get(name)?.field },`,
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
  // The work a keystroke does around the fields rather than in them, added
  // with the budgets in tests/e2e/render-budget.spec.ts.
  //
  // `withState` and `withError`, the two wrappers around every field.
  {
    name: 'wrapper',
    file: `${LIB}/client/component/field/field-with-state.tsx`,
    anchor: '    const WithField = (props: Readonly<P>) => {',
    replacement: `    const WithField = (props: Readonly<P>) => {\n      ${bump('wrapper')}`,
  },
  {
    name: 'guard (whole record)',
    file: `${LIB}/client/component/guard/visibility-guard.tsx`,
    anchor: '  const states = useAtomValue(fieldStateAtom)',
    legacy: true,
    replacement: `  ${bump('guard')}\n  const states = useAtomValue(fieldStateAtom)`,
  },
  // The same guard, once its answer became a boolean of its own.
  {
    name: 'guard (derived boolean)',
    file: `${LIB}/client/component/guard/visibility-guard.tsx`,
    anchor: '  const hiddenAtom = useMemo(',
    replacement: `  ${bump('guard')}\n  const hiddenAtom = useMemo(`,
  },
  // A list row, whether or not the list shows a preview.
  {
    name: 'rowPreview',
    file: `${LIB}/client/component/field/field-list-preview-item.tsx`,
    anchor: '  const name = `${field.name}.${itemKey}`',
    replacement: `  ${bump('rowPreview')}\n  const name = \`\${field.name}.\${itemKey}\``,
  },
  // A row rescanning the whole value record for its own keys, where the scan
  // ran inside the hook's own `useMemo`.
  {
    name: 'liveScan (useMemo)',
    file: `${LIB}/client/hook/use-live-item-value.ts`,
    anchor: '  return useMemo(() => {\n    const prefix = `${name}.`',
    legacy: true,
    replacement: `  return useMemo(() => {\n    ${bump('liveScan')}\n    const prefix = \`\${name}.\``,
  },
  // The same scan, once it moved into the selector a row subscribes with. A
  // list with no condition to answer has no row subscribed, so this never runs.
  {
    name: 'liveScan (pickRow)',
    file: `${LIB}/client/hook/use-live-item-value.ts`,
    anchor: '  return (record: Record<string, unknown>) => {',
    replacement: `  return (record: Record<string, unknown>) => {\n    ${bump('liveScan')}`,
  },
  // A list handing its value over as if it were unmounting.
  {
    name: 'handoff',
    file: `${LIB}/client/hook/use-field-list.ts`,
    anchor: '    () => () => {\n      const values = store.get(valueAtom)',
    replacement: `    () => () => {\n      ${bump('handoff')}\n      const values = store.get(valueAtom)`,
  },
  {
    name: 'prepare',
    file: `${LIB}/component/form.tsx`,
    anchor: '  const sections = prepare(props.sections, props.definition)',
    replacement: `  ${bump('prepare')}\n  const sections = prepare(props.sections, props.definition)`,
  },
  // A build of the timezone option list, not a call for it: the anchor is the
  // start of the work, so a cache in front of it stops the count.
  {
    name: 'tz',
    file: `${CORE}/util/date.ts`,
    anchor: '  const detectedTimezone = getUserTimezone()',
    replacement: `  ${bump('tz')}\n  const detectedTimezone = getUserTimezone()`,
  },
]

if (!existsSync(join(process.cwd(), LIB))) {
  throw new Error(`run from the repository root: no ${LIB} here`)
}

const strict = process.argv.includes('--strict')
const applied: string[] = []
const skipped: Array<{ probe: Probe; reason: string }> = []

for (const probe of PROBES) {
  const path = join(process.cwd(), probe.file)
  if (!existsSync(path)) {
    skipped.push({ probe, reason: 'no such file in this commit' })
    continue
  }

  const source = readFileSync(path, 'utf8')
  if (source.includes(probe.replacement)) {
    applied.push(`${probe.name} (already)`)
    continue
  }

  const matches = source.split(probe.anchor).length - 1
  if (matches === 0) {
    skipped.push({ probe, reason: 'anchor not in this commit' })
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
console.log(
  `skipped: ${skipped.map(({ probe, reason }) => `${probe.name} (${reason})`).join(', ') || 'none'}`
)

// On the current commit a skipped probe is a budget that would pass on a zero
// it never measured. Legacy anchors belong to older commits and are not asked
// for.
const missing = skipped.filter(({ probe }) => !probe.legacy)
if (strict && missing.length > 0) {
  console.error(
    `--strict: ${missing.map(({ probe }) => probe.name).join(', ')} did not apply. ` +
      'An anchor moved: move the probe with the code it counts.'
  )
  process.exit(1)
}
