import * as esbuild from 'esbuild'
import pkg from './package.json' with { type: 'json' }

const dependencies = Object.keys(pkg.peerDependencies)
const isWatch = process.argv.includes('--watch')

function entry(entryPoints, callback) {
  entryPoints = Array.isArray(entryPoints) ? entryPoints : [entryPoints]

  callback(async (format, outdir) => {
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
    }
  })
}

entry('./src/server/index.ts', async (build) => {
  await build('esm', './dist/server/esm')
  await build('cjs', './dist/server/cjs')
})

entry('./src/client/index.ts', async (build) => {
  await build('esm', './dist/client/esm')
  await build('cjs', './dist/client/cjs')
})

entry('./src/config/index.ts', async (build) => {
  await build('esm', './dist/config/esm')
  await build('cjs', './dist/config/cjs')
})
