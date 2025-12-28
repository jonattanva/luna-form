import * as esbuild from 'esbuild'
import pkg from './package.json' with { type: 'json' }

const dependencies = Object.keys(pkg.peerDependencies)

function entry(entryPoints, callback) {
  entryPoints = Array.isArray(entryPoints) ? entryPoints : [entryPoints]

  callback(async (format, outdir) => {
    await esbuild.build({
      bundle: true,
      entryPoints: entryPoints,
      external: dependencies,
      format: format,
      logLevel: 'info',
      minify: true,
      outdir: outdir,
      splitting: format === 'esm',
    })
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
