# Agent Instructions

## Package Management

- This project uses **pnpm** as its package manager
- Never use npm or yarn for this project.

## Project architecture

- **packages/luna-core**: Core utilities and types
- **packages/luna-react**: React bindings (depends on luna-core)
- **luna-core** must build before **luna-react**

## Setup commands

- Install deps: `pnpm install`
- Start dev server: `pnpm run serve`
- Build project: `pnpm run build`

## Important notes

- Ensure the local server is running (`pnpm run serve`) before executing the e2e tests.
- You must build the project using `pnpm run build` before starting the server with `pnpm run serve`.
- Never commit code with type errors or linting issues
- All checks must pass before work is considered complete
- Ask before generating new files

## Code style

- TypeScript strict mode
- Avoid using **any** or **unknown**
- **Remove Unused Code**: Delete any unused variables, imports, or functions immediately.
- **Underscore Prefixing**: Only use the \_ prefix for variables that are technically required but intentionally unused (e.g., required function parameters or destructuring). Otherwise, remove them.

## Testing

- Unit tests: **tests/unit/** -- Vitest. Collected by path (`vitest.config.ts`), not by tag
- E2E tests: **tests/e2e/** -- Playwright, tagged with `@e2e` (`pnpm test:e2e` filters on it)
- Test files follow the pattern **\*.spec.ts**
- E2E tests run against Chromium, Firefox, and WebKit

## Form documentation

The JSON contract of a luna form is documented in
**packages/luna-react/docs/**, starting at `docs/index.md`. Read the relevant
page before writing or changing form JSON, a validation rule or a change event.

These files ship inside the published package (`files: ["dist", "docs"]`), so a
consumer finds them at `node_modules/react-luna-form/docs/`. That is
deliberate: the documentation is versioned with the code it describes, and
cannot drift from the installed build. Keep it in step when the contract
changes.

## Documentation guidelines

- **No Emojis**: Do not use emojis under any circumstances. This applies to source code, inline comments, documentation, README files, and commit messages. Maintain a strictly professional, text-only format.

## Build outputs

- **luna-core**: Type declarations only (no bundled JS)
- **luna-react**: ESM and CJS bundles via esbuild (multiple entry points: client, server, config)
- Build outputs go to **dist/** directories
