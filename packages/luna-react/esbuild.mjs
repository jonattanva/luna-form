import * as esbuild from 'esbuild'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pkg from './package.json' with { type: 'json' }

const dependencies = Object.keys(pkg.peerDependencies)
const isWatch = process.argv.includes('--watch')

const outputs = []

function entry(entryPoints, callback) {
  entryPoints = Array.isArray(entryPoints) ? entryPoints : [entryPoints]

  return callback(async (format, outdir) => {
    const options = {
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
}
