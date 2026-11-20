---
description: Periodic audit of the library: renders, React 19 and Jotai, JSON contract and docs, duplicate and dead code, bundle and performance, accessibility, security, agent tools and demonstrable bugs. Every finding backed by a test or a measurement and recorded with its fix plan in audit/findings.js.
argument-hint: '[branch, PR or scope, e.g. "fix/own-keys", "pr 172" or "security only"]'
---

# Periodic audit of luna-form

Requested scope: $ARGUMENTS

If nothing was given, audit the whole current branch, in every area. The goal is to **find and report** measurable problems. Do not fix anything unless explicitly asked (see "Fixing later").

What is audited is the library: `packages/luna-core` and `packages/luna-react`, with its JSON contract documented in `packages/luna-react/docs/`. `apps/react-luna-editor` is the test bench, not the product: a problem in the editor is a finding only if it skews what the tests measure.

**Language:** this command is in English, but everything written into the registry (titles, summaries, sections) and the final answer is in Spanish. Code, test names and commit messages stay in English.

## Non-negotiable rules

1. **No test, no finding.** Every finding is backed by a test that demonstrates it or by a reproducible measurement:
   - e2e with Playwright, in `tests/e2e/*.spec.ts`, with `{ tag: ['@e2e'] }`;
   - unit with Vitest, in `tests/unit/**/*.spec.ts`;
   - render budget, in `tests/e2e/render-budget.spec.ts` (`@render`);
   - benchmark with mitata, in `benchmark/*.bench.ts`.

   What cannot be tested yet is reported as **to investigate** (`investigar`), with what was seen and how to continue.

2. **A bug's test is marked as an expected failure:** `test.fail(...)` or `it.fails(...)`, with the comment `// Audit <ID>: <what happens>. Drop .fail once fixed.` The suite stays green and the test flips by itself the day someone fixes it. Before marking it, check it fails for the reason the comment gives, not for a selector or a timeout.
3. **Measure, do not estimate.** Every number comes with its conditions:
   - `next dev` or production build (`next start`), and the editor route;
   - how many runs, and the median or range;
   - the size of the definition (fields, list rows, options);
   - machine load (`uptime`).

   If something was estimated, say so.

4. **Verify before claiming.** Before calling code "dead" or "useless", find why it exists with `git log -S '<code>'` and try removing it. A `memo`, a wrapper or a render probe that looks useless may be holding up a test or a budget.
5. **Follow `AGENTS.md`:** pnpm, strict TS without `any` or `unknown`, no unused code, no emojis anywhere, and ask before creating files other than the audit's tests and `audit/`.
6. **The library is general.** A finding, a test or a commit describes the library's behaviour, never that of one particular consumer.

## Working environment

- **One worktree per audit**, created from the remote branch (`.claude/worktrees` is in `.gitignore`), with its own install: a `node_modules` linked from another checkout gets relinked and left dangling.
  ```sh
  git fetch origin
  git worktree add -b claude/audit-<date> .claude/worktrees/audit-<date> origin/<branch>
  pnpm install --frozen-lockfile
  pnpm build
  ```
  For a PR, the branch is `claude/audit-pr<number>` with its current base merged in (`git merge origin/<base>`): that is the tree CI tests and the one that lands.
- **Which server tests what.** In CI, the `e2e-test` job runs `pnpm test:e2e` against `pnpm serve` (`next dev`) in Chromium and against `pnpm start` (production) in Firefox and WebKit, and the `render-budget` job runs `pnpm test:render` against `pnpm start` (production, probes applied). Test each thing against the same server CI uses, and before trusting a run confirm which one is on the port (`next dev` or `next start` in its log). Behaviour that differs between the two is itself something to review.
- **Own port.** If `:3000` belongs to another checkout (`lsof -i :3000` and `lsof -a -p <pid> -d cwd`), leave it and use another:
  ```sh
  pnpm --filter react-luna-editor exec next dev -p <port>
  PLAYWRIGHT_BASE_URL=http://localhost:<port> pnpm playwright test tests/e2e/<spec>.spec.ts --project=chromium
  ```
  Pass the **full path** of the spec: a short filter also matches the worktree name and runs the whole suite.
- **Editor routes:** `/` is an uncontrolled host, `/reactive` a controlled one that feeds `value` back on every change, and `/server` the server entry. The definition is injected with `inject(page, json)` from `tests/e2e/support/inject.ts`. Keystroke cost is measured on `/reactive`: on `/` a field does not re-render and every optimisation reads as "no change".
- **Noise:**
  - Check `uptime` before measuring. If another session has a `next-server` or Playwright running, parallel tests fail on time: repeat with `--workers=1` and note the load.
  - A failure that disappears on repeat is not a finding, unless the pattern repeats, and then it goes to `investigar`.
  - Restart the server after every branch switch and every `pnpm build`: one that has been up for hours can serve a mix of the old and new library.
- `turbo` tasks append a managed block to `AGENTS.md`. If that change appears, tell the user; do not revert or commit it on your own.
- When done, stop the servers you started and restore `packages/` if you applied probes (`git checkout -- packages`).

## Areas and how to test them

1. **Unnecessary renders.** Counted, not timed: the editor's own work dominates wall time.
   - The instrument is `benchmark/render/` (read its `README.md` first): `pnpm benchmark:probes --strict` patches counters into the library source, and `tests/e2e/support/render-counters.ts` reads them from the page.
   - Budgets go in `tests/e2e/render-budget.spec.ts`. The full flow: `pnpm benchmark:probes --strict`, `pnpm build`, `pnpm start`, `pnpm test:render`, then `git checkout -- packages` and another `pnpm build`. Under `next dev`, StrictMode doubles `render` and `schema`.
   - A probed tree does not pass `pnpm lint`. Do not run `lint`, `typescript` or `build` while measuring: turbo's `^build` rebuilds the library from the current source and every counter goes back to 0.
   - Measure real interactions on `/reactive`: typing in a field, adding, removing and collapsing list rows, changing a field that `state` or `value` depend on, and swapping the whole definition.
   - To know what a change adds, measure both sides on the same server: return its files to the base with `git checkout <base> -- <files>`, measure, and restore them.
2. **React 19.** Review:
   - `use`, Actions, `useTransition` and `useOptimistic`, especially in submit (`use-form-action.ts`);
   - effects that chain renders or compute derived state;
   - refs written during render (the React Compiler rules are on in `packages/luna-react/eslint.config.mjs`);
   - `memo` and stable callbacks where a memoized child receives them;
   - the server entry (`src/server`) and hydration: what renders on the server has to match the client's first render;
   - `prefers-reduced-motion` in animations.
3. **Jotai.** Atom granularity, reads inside handlers with `store.get` instead of subscriptions, `selectAtom`, atom families that are never cleaned up (the render instrument counts what each one caches), and fields subscribed to the whole value record for a single value.
4. **JSON contract and docs.** The contract lives in `packages/luna-react/docs/`, which ships with the package. Review:
   - that every behavioural claim in the docs is true: run it before accepting it, and one that does not hold is a finding;
   - what happens with a malformed definition: a rule the form cannot read must not unmount the form, nor let through values it should hold back;
   - a key with more than one type (`number | 'any'`): every JSON key has one type;
   - that the public types (`dist/types`) describe what the library really accepts.
5. **Duplicate and dead code.** Run `pnpm knip` (read `knip.ts` first: in `luna-core` every export nothing imports counts as dead) and also look for:
   - props never passed;
   - conditions always true;
   - wrappers that do nothing;
   - blocks copied between `luna-core` and `luna-react`, or between inputs.

   For a duplicate, the test pins the contract both copies have to share.

6. **Bundle and performance.**
   - **Bundle:** the `bundle-size` job in `.github/workflows/build-and-test.yml` sets three budgets on `packages/luna-react/dist`: the total of every file, the esm main path gzipped, and the agent tools chunk. Reproduce that same calculation after `pnpm build` and report the margin left on each.
   - **What an application loads:** peer dependencies stay out of the bundle, `sideEffects: false` holds, and what in the main path could load only when needed, as the agent tools already do.
   - **Build and evaluation:** `pnpm benchmark` (`form-build.bench.ts`), `pnpm benchmark:interpolate` and the other `benchmark/*.bench.ts` with `pnpm exec tsx`. Compare against the base with the same command on the same machine.
   - **Large definitions:** `pnpm test:perf` (`performance.bench.spec.ts`, Chromium only) for lists with many rows and selects with many options.
7. **Accessibility.** What the library renders: every field with its `label`, `aria-invalid` and `aria-describedby` pointing to its error and description, roles and states of compound controls (select, chips, date and time, collapsible lists), keyboard use, and where focus goes after a failed submit or when a row is removed. `eslint-plugin-jsx-a11y` only covers the static part: the rest is tested with Playwright in all three browsers.
8. **Security.** A definition or a value may come from outside, so review:
   - dotted names reaching the prototype (`__proto__`, `constructor`, `toString`) when building, reading or extracting values (`extract.ts`, `resolve-value.ts`, `host-value-store.ts`);
   - reads of inherited members where an own property was expected;
   - HTML reaching the DOM from description markdown, interpolation or format filters;
   - URLs interpolated into remote data sources (`docs/fields/data-source.md`): which values can change the host or path;
   - regular expressions: a `pattern` is the author's code and documented as such, but a regex the library builds must not be open to ReDoS;
   - what the agent tools let an agent read or write, and whether they validate what they receive.

   Tests go in `tests/unit/` when the cause is a function, and in `tests/e2e/` when a browser is needed.

9. **Agent tools and WebMCP.** `listTools()` and `callTool()` against `docs/agents/tools.md`: the tools reflect the current definition (hidden fields, lists, remote options), an invalid call fails with a clear error, and the host hears about every call. WebMCP tests carry `@webmcp` and run in the `chromium-webmcp` project.
10. **Demonstrable bugs.** Walk the real flows with Playwright on `/` and `/reactive`: initial values, `state` and `value` events, lists (add, remove a row that is not the last, collapse, nest), visibility, steps, dates and times in another time zone, translations, and submit. Try them with double clicks, swapping the definition mid-edit, network errors on remote sources (`page.route`), and in Chromium, Firefox and WebKit.

## Comparing with the previous audit

The audit is meant to repeat, so **do not start from scratch**:

- **Start from the registry:** every audit lives in `audit/findings.js` (the view is `audit/index.html`). Read its header first, which documents the format, and the open findings: everything not in `corregido` or `plan`.
- **Regressions:** re-run the tests of fixed findings. If one fails, it is a regression and is reported first.
- **Expected failures:** if they still fail, the finding stays open. If they now pass, someone fixed it: drop the `.fail` and mark the finding `corregido`.
- **An existing finding is updated, not duplicated:** change its `st` and add a section with `audit: '<this run's id>'` saying what changed and with what evidence.
- **IDs:** new findings get new IDs, and an ID is never reused: search `audit/findings.js` before using one. Prefixes: `R-` renders, `A-` React/Jotai, `C-` contract and docs, `S-` duplicate/simplification, `PERF-B/C-` bundle/build, `U-` accessibility, `SEC-` security, `AG-` agent tools, `BUG-` bugs, `INV-` to investigate. A PR audit uses its own series, with a two-letter suffix after the prefix (`BUG-OK1`, `SEC-OK2`).
- **To investigate:** review the open `INV-` items of the previous audit.

## Format of each finding

Each finding is an entry of `findings` in `audit/findings.js`, in the format its header describes:

- **`code`**, **`sev`** (`crit` / `mejora` / `optim`), **`cat`** (the area) and **`st`** (`corregido` · `probado` · `medido` · `estatico` · `pendiente` · `investigar`).
- **`title`** in one line and **`audit`**, this run's id.
- **`sections`**, in this order:
  - **Dónde:** `file:line`;
  - **Qué pasa:** what happens and why it matters, with the measured numbers;
  - **Riesgo**, security only: how serious it is and who can exploit it;
  - **Prueba:** `file :: test name`;
  - **Corrección**, if fixed: PR, commit, before and after;
  - **Plan de corrección:** the task that resolves it (see "Deliverable").

## Deliverable

`audit/findings.js` updated:

1. **A new entry in `audits`** for this run (`id: 'audit-<date>'`, or `'audit-pr<number>'` for a PR), with a `summary` holding the totals by severity and area, the key measurements in tables (`<div class="table-wrap"><table>`), the audited commit, and regressions if any.
2. **New findings** added to `findings`, and existing ones updated (see "Comparing with the previous audit").
3. **Fix plan** as a section of each finding, with the task grouped into phases: 1 security, 2 bugs that lose or falsify values, 3 contract and docs, 4 performance and renders, 5 accessibility and cleanup. Each task carries its IDs, **crear primero** (the test that reproduces it), **antes**, **después** and **mejora esperada**.

After editing, run `pnpm exec prettier --write audit/` and open `audit/index.html` to check the page loads and the new findings show up. New tests pass `pnpm lint` and `pnpm prettier:check` before they are committed. If the user wants to share it, publish `audit/index.html` as an artifact with `findings.js` in `files`, always at the same URL.

## Fixing later (only when asked, task by task)

1. A new worktree from the audited branch, with its own install.
2. Reproduce with the test first and see it fail for the right reason.
3. Fix, and measure before and after under the same conditions.
4. Pass the full checks: `pnpm build`, `pnpm lint`, `pnpm typescript`, `pnpm prettier:check`, `pnpm knip`, `pnpm test:unit`, the affected e2e in all three browsers, and `pnpm test:render` and the bundle budgets if the change touches renders or size. If the contract changed, the docs in `docs/` change in the same commit.
5. Commit in English, with no tool attribution, and **ask before push and PR**.
6. Update the finding in `audit/findings.js`: `st`, and the **Corrección** section with PR, commit, before and after.

## Final answer

A short summary in Spanish with:

- the path `audit/index.html` (and the artifact URL, if published);
- how many new findings, by severity;
- regressions, if any;
- findings that closed by themselves;
- the 3 to 5 most urgent items, each with its test.
