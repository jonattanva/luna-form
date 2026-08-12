import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      // Standalone scripts, run by hand with `tsx`. Only `form-build.bench.ts`
      // has a package script, so without this the rest of the folder reads as
      // unreachable.
      entry: ['benchmark/*.ts'],
    },
    // Resolves on its own: `main` and `types` point straight at `src/index.ts`.
    'packages/luna-core': {},
    'packages/luna-react': {
      // The four bundles built by `esbuild.mjs`, which are also the four keys
      // of the package's `exports` map. They have to be spelled out because
      // `exports` points at `dist/`, which is not source -- so knip finds no
      // way in and reports the whole of `src/` as unused, entry points
      // included.
      entry: ['src/{client,server,config,schema}/index.ts'],
    },
    'apps/react-luna-editor': {
      // shadcn writes one module per component straight into this folder, and
      // each ships the whole family whether or not the app uses every piece.
      // Flat files only: `components/ui/wrapper/` is ours, and a glob reaching
      // into subdirectories would exempt it from the dead-code check under a
      // rule whose reason does not cover it.
      ignore: ['components/ui/*.{ts,tsx}'],
    },
  },
  // Outside the pnpm workspace (`apps/*` and `packages/*`) on purpose: the
  // examples are there to be read and copied, not built with the monorepo.
  ignore: ['examples/**'],
}

export default config
