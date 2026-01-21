# Agent Instructions

## Package Management

- This project uses **pnpm** as its package manager
- Never use npm or yarn for this project.

## Setup commands

- Install deps: `pnpm install`
- Start dev server: `pnpm run serve`
- Run unit tests: `pnpm run test:unit`
- Run e2e tests: `pnpm run test:e2e`
- Build project: `pnpm run build`

## Important notes

- Ensure the local server is running (`pnpm run serve`) before executing the e2e tests.
- You must build the project using `pnpm run build` before starting the server with `pnpm run serve`.
- Never commit code with type errors or linting issues
- All checks must pass before work is considered complete

## Code style

- TypeScript strict mode
- Avoid using any or unknown
- **Remove Unused Code**: Delete any unused variables, imports, or functions immediately.
- **Underscore Prefixing**: Only use the \_ prefix for variables that are technically required but intentionally unused (e.g., required function parameters or destructuring). Otherwise, remove them.

## Documentation guidelines

- **No Emojis**: Do not use emojis under any circumstances. This applies to source code, inline comments, documentation, README files, and commit messages. Maintain a strictly professional, text-only format.
