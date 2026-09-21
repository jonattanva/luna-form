import * as esbuild from 'esbuild'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pkg from './package.json' with { type: 'json' }

const dependencies = Object.keys(pkg.peerDependencies)
const isWatch = process.argv.includes('--watch')

const outputs = []

const USE_CLIENT = '"use client";'

function isClient(outdir) {
  return outdir.includes('/client/')
}

function entry(entryPoints, callback) {
  entryPoints = Array.isArray(entryPoints) ? entryPoints : [entryPoints]

  return callback(async (format, outdir) => {
    const options = {
      // The client entry is hooks all the way down, and a bundler drops a
      // directive it finds in the sources, so it goes on the way out instead.
      // Marked, an App Router project can import `Form` straight from a Server
      // Component; unmarked, it needs a file of its own that says it.
      banner: isClient(outdir) ? { js: '"use client";' } : undefined,
      bundle: true,
      drop: ['console', 'debugger'],
      entryPoints: entryPoints,
      external: dependencies,
      format: format,
      logLevel: 'info',
      minify: !isWatch,
      outdir: outdir,
      splitting: format === 'esm',
    }

    if (isWatch) {
      const ctx = await esbuild.context(options)
      await ctx.watch()
      console.log(`Watching ${entryPoints.join(', ')} (${format})...`)
    } else {
      await esbuild.build(options)
      outputs.push(join(outdir, 'index.js'))
    }
  })
}

await Promise.all([
  entry('./src/server/index.ts', async (build) => {
    await build('esm', './dist/server/esm')
    await build('cjs', './dist/server/cjs')
  }),
  entry('./src/client/index.ts', async (build) => {
    await build('esm', './dist/client/esm')
    await build('cjs', './dist/client/cjs')
  }),
  entry('./src/config/index.ts', async (build) => {
    await build('esm', './dist/config/esm')
    await build('cjs', './dist/config/cjs')
  }),
  entry('./src/schema/index.ts', async (build) => {
    await build('esm', './dist/schema/esm')
    await build('cjs', './dist/schema/cjs')
  }),
])

if (!isWatch) {
  const unminified = outputs.filter((file) => {
    const content = readFileSync(file, 'utf8')
    return content.includes('// src/') || content.split('\n').length > 5
  })

  if (unminified.length > 0) {
    console.error(
      `Build produced un-minified output in:\n${unminified.map((f) => `  - ${f}`).join('\n')}`
    )
    process.exit(1)
  }

  // A client output that lost its directive is a consumer finding out with an
  // error, which is how this was found in the first place.
  const unmarked = outputs.filter(
    (file) =>
      isClient(file) && !readFileSync(file, 'utf8').startsWith(USE_CLIENT)
  )

  if (unmarked.length > 0) {
    console.error(
      `Client output without ${USE_CLIENT}\n${unmarked.map((f) => `  - ${f}`).join('\n')}`
    )
    process.exit(1)
  }
}
