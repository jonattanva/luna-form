// Makes the emitted `.d.ts` self-contained. `@luna-form/core` is a private,
// unpublished workspace package: its bundled at runtime by esbuild, but the
// emitted declarations keep the bare `@luna-form/core` specifier, which a
// consumer cannot resolve — so `react-luna-form/schema` (and the other entries)
// resolve to `any`. Here we ship core's own emitted declarations inside this
// package and rewrite every `@luna-form/core` specifier to a relative path, so
// the published types are fully self-contained (only true externals like `zod`,
// a peer dependency, remain as bare imports).
import {
  cpSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const coreTypes = join(packageRoot, '..', 'luna-core', 'dist', 'types')
const distTypes = join(packageRoot, 'dist', 'types')
const shippedCore = join(distTypes, 'luna-core')

// 1) Ship core's emitted declarations alongside our own.
cpSync(coreTypes, shippedCore, { recursive: true })

// 2) Rewrite `@luna-form/core` -> a relative path to the shipped core barrel.
const coreBarrel = join(shippedCore, 'index')
const declarations = []
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
    } else if (full.endsWith('.d.ts')) {
      declarations.push(full)
    }
  }
}
walk(join(distTypes, 'luna-react'))

let rewritten = 0
for (const file of declarations) {
  const source = readFileSync(file, 'utf8')
  if (!source.includes('@luna-form/core')) {
    continue
  }
  let specifier = relative(dirname(file), coreBarrel).split(sep).join('/')
  if (!specifier.startsWith('.')) {
    specifier = `./${specifier}`
  }
  writeFileSync(
    file,
    source.replaceAll(/(['"])@luna-form\/core\1/g, `'${specifier}'`)
  )
  rewritten += 1
}

console.log(
  `bundle-types: shipped core declarations, rewrote ${rewritten} file(s)`
)
