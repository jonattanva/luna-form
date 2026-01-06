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

## Code style

- TypeScript strict mode
- Avoid using any or unknown
