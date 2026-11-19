---
description: Audit of the test suite: gaps in what matters, repeated tests, tests that prove nothing, slow, flaky and order-dependent tests, and the run time of the whole suite locally and in CI. Every finding backed by a mutation or a measurement, with a plan to cut time without losing protection.
argument-hint: '[scope, e.g. "e2e only", "run time only" or "lists"]'
---

# Test suite audit of luna-form

Requested scope: $ARGUMENTS

If nothing was given, audit both suites (unit and e2e, render budgets included) on the current branch, and how long they take to run. This command is separate from `/audit`: it does not look for library bugs, it answers **whether each test earns the time it costs, and whether the suite runs as fast as it could**. A test that catches nothing, or catches the same as a cheaper one, only adds slowness and a false sense of safety. Do not fix or delete anything unless explicitly asked (see "Fixing later").

**Language:** this command is in English, but everything written into the registry (titles, summaries, sections) and the final answer is in Spanish. Code, test names and commit messages stay in English.

## Non-negotiable rules

1. **No evidence, no finding.** The evidence of this audit is a **mutation** or a **measurement**:
   - **Mutation:** deliberately break the code the test claims to cover (invert a condition, return early, return an empty value, remove a call or a validation) and run only that test. Record the exact mutation (`file:line`, before -> after) and whether the test failed or passed. Always revert the mutation, and check with `git diff` that nothing is left.
   - **Measurement:** duration per test and per suite, with its conditions: `next dev` or production, browser, workers, how many runs, median or range, and machine load (`uptime`).

   What cannot be demonstrated yet goes to `investigar`.

2. **A mutation in the library needs a build.** The e2e tests exercise `packages/luna-react/dist` through the editor, not the source: after each mutation run `pnpm build` and restart the server before the test, and again when reverting. Unit tests read the source and do not need it. Record what was rebuilt for each mutation.
3. **A test is never deleted without proving it adds nothing of its own.** To call it repeated, show that another test fails on **every** mutation that makes it fail. To call it empty, show it survives mutations of the code it claims to cover. Deleting is a plan task, not something done during the audit.
4. **Verify before claiming.** Before proposing to remove a test, find why it exists with `git log -S '<test name>'` and `git log --follow` on the file. Many e2e tests reproduce a fixed bug (the `list-remove-*`, `initial-value-*` and `*-bug.spec.ts` families): such a test is not touched without redoing the mutation that brings that bug back. Tests marked `// Audit <ID>` pin an `/audit` finding: do not touch them without reviewing that finding in `audit/findings.js`.
5. **What is not repetition:**
   - the same spec running in Chromium, Firefox and WebKit (on purpose);
   - the same code tested with different equivalence classes or edges;
   - the same flow on `/` and on `/reactive`, when what changes is whether the host controls the value;
   - an e2e that is the only test of the wiring (definition -> render -> submitted value) of something whose logic a unit test already covers: logic is tested below, wiring above. It is repetition when the e2e walks every branch of that logic again.
6. **Speed never costs protection.** Every time saving is proven not to lose coverage: the mutations the old setup caught still fail with the new one, in every browser that ran them.
7. **Follow `AGENTS.md`:** pnpm, strict TS without `any` or `unknown`, never `page.waitForTimeout()`, e2e tests tagged `@e2e`, no emojis, and ask before creating files other than this audit's.

## Environment

Use the same rules as `.claude/commands/audit.md`, in its **"Working environment"** section: own worktree with its own install, own port, and the same server CI uses for each suite. Also:

- **How CI runs** (`.github/workflows/build-and-test.yml`): `e2e-test` runs against `pnpm serve` in a matrix of three browsers by two shards, with `CI` set, so `playwright.config.ts` uses 1 worker and 2 retries. Chromium also runs the `chromium-webmcp` project. Each e2e job installs and builds on its own after the `build` job. `render-budget` runs Chromium only, against production with probes. `unit-test` runs `pnpm test:unit`.
- **Per-test durations:**
  ```sh
  pnpm vitest run --reporter=json --outputFile=<scratchpad>/unit.json
  PLAYWRIGHT_BASE_URL=http://localhost:<port> pnpm playwright test --grep @e2e --project=chromium --workers=1 --reporter=json > <scratchpad>/e2e.json
  ```
  With `--workers=1` per-test durations are comparable. Repeat in Firefox and WebKit, usually the slowest. Measure the total separately with default workers, and the time of each job, each shard and each step in CI (`gh run view <id>` and `gh run view <id> --json jobs`).
- Raw results go to the scratchpad, not the repo.

## Areas and how to test them

1. **Tests that prove nothing (`VAC-`).** First look for candidates with static signals:
   - a case without `expect`. In e2e the `playwright/expect-expect` rule covers it, but in Vitest **there is no ESLint plugin**, so nothing catches it;
   - assertions that always hold: `toBeDefined()` or `toBeTruthy()` on something never `undefined`, or `expect(x).toBe(x)`;
   - assertions on the mock itself: set `vi.fn().mockReturnValue(y)` and then check it returns `y`;
   - conditional assertions (`if (...) expect(...)`) or inside a loop over an array that may be empty;
   - a `try/catch` swallowing the error, or an `expect(...).rejects` without `await`;
   - an e2e that checks a value "did not change" without comparing it to a baseline run: "as if never given" is asserted by equality with the run without that input, over several submits, reading the request body;
   - an e2e that only injects a definition and checks it loaded, when another already uses it;
   - a render budget that passes on a 0 that measured nothing because the probe was not applied;
   - a `test.skip` whose condition always holds in CI, or a `test.fail`/`it.fails` failing for a reason other than its comment (read the real error);
   - a test name promising something the body does not check.

   Then **confirm with mutations**: at least two mutations relevant to the test name. If it survives all of them, it is `VAC-`. If it survives some, record which part of its promise is untested.

2. **Repeated tests (`DUP-`).** Look for candidates by:
   - **similar titles and bodies**, within a file and across files, e.g. the `list-*`, `chips-*`, `date-submission-*` or `initial-value-*` families;
   - **the same code covered at both levels**: the same rule in `tests/unit/` and in `tests/e2e/`;
   - **contained coverage**, for unit tests: run each test file's coverage on the same target (`pnpm vitest run <test> --coverage --coverage.include=<target file> --coverage.reporter=json`) and compare lines and branches covered. If one test's are a subset of another's, it is a candidate. If the coverage provider is missing, ask before installing it;
   - **copied cases with other data**: they can be merged into an `it.each` or a `test` loop without losing anything, but that does not make them repeated. Only a case in the same equivalence class as another is repeated.

   **Confirm with a mutation table** on the code they share: one row per mutation, one column per test, marking which fails. A test whose caught mutations are a subset of those of a **cheaper** test is `DUP-`. The cheapest level that catches the same stays, and the e2e keeps only what only a browser can show.

3. **Slow tests (`LEN-`).** Sort by duration and by **duration x contribution**: the first to cut is a slow test that is also `DUP-` or `VAC-`. Typical causes to review and measure:
   - long waits: `expect.poll` with large intervals, `waitForLoadState('networkidle')`, inflated timeouts (`expect` already waits 15 s by default);
   - reloading the page or re-injecting the definition per case when several cases could share the load without sharing state;
   - typing character by character (`pressSequentially`) where `fill` tests the same;
   - `test.describe.serial` or heavy `beforeAll` blocks preventing parallelism;
   - definitions larger than the case needs.

   Each finding carries the **measured** saving, not estimated: try the change and measure before and after, same browser, same workers.

4. **Suite run time (`OPT-`).** Beyond single tests: how long the whole suite takes to give a verdict, locally and in CI, and how to bring that down. Measure each item, and for each proposal show before and after plus rule 6.
   - **CI critical path:** which job finishes last and why. Break each job into its steps (checkout, install, build, server start, tests, report) from `gh run view <id> --json jobs`, over several runs. Time that is not running tests is the first candidate.
   - **Repeated work across jobs:** every e2e job installs and runs `pnpm build` again after the `build` job did; the turbo cache is keyed by commit. Measure what passing the built `dist` and `.next` between jobs, or a shared turbo cache, would save.
   - **Workers and shards:** CI runs with 1 worker; measure whether the runner holds 2 or more without new failures (`--repeat-each` with `--retries=0`). Check shard balance: a shard taking twice as long as the other stretches the whole job. Try other shard counts per browser.
   - **Server:** `next dev` compiles each route on first request; compare a full run against `next dev` and against `next start`, and the server's start-up wait.
   - **Retries:** what the 2 retries cost per run (sum the retried durations from the junit), and whether `trace` and `video` `on-first-retry` add to it.
   - **What runs where:** cases tagged `@e2e` that only need one browser (no browser-specific behaviour) could carry `@chromium`; logic exercised in e2e that a unit test could cover in milliseconds.
   - **Unit suite:** total time, the slowest files, and Vitest options (`pool`, `isolate`) measured both ways.
   - **Local loop:** how long a developer waits to check one change: build, server start, one spec. Propose what shortens it (running by tag or by path, reusing the server) with measurements.

5. **Flaky tests (`FLK-`).** In CI, Playwright runs with `retries: 2`, so a case that fails then passes on retry stays green and hides the flakiness, but costs up to three times its duration. Find them:
   - in CI reports: the `flaky` status in the merged HTML report (`playwright-report-e2e`) and the retries in the junit;
   - locally, with `--repeat-each=5 --retries=0` in all three browsers.

   Frequent causes in this suite: typing into a field before a select has closed and returned focus, and assertions reading the definition editor instead of what the form renders. A case that fails even once is `FLK-`, with the cause if found. A failure caused by machine load is repeated with `--workers=1` before reporting it.

6. **Gaps in what matters (`HUE-`).** A suite is adequate if it protects what carries the most risk, not if it has many cases.
   - **Feature x level matrix** for what is critical: each field type (input, select, chips, radio, checkbox, date, time, time zone), lists (add, remove, collapse, nest, keep values), visibility and `state`, value events, declarative and custom validation, initial values, submit and failed submit, remote data sources (happy path, network error, invalid response), translation, server entry and agent tools. An empty cell in something critical is a candidate.
   - **Documented contract:** every behavioural claim in `packages/luna-react/docs/` needs a test backing it. One without a test is a candidate.
   - **Coverage map**, as a guide and not a target, only for what unit tests cover: `pnpm vitest run --coverage --coverage.reporter=json-summary`. Look for files in `packages/luna-core/src` and `packages/luna-react/src/client/lib` not covered and error branches never reached.
   - **Regressions:** every fixed bug should leave its test. Cross `fix` PRs with their changes in `tests/`.

   A gap is proven by a mutation **no** test catches: that is the evidence, and the missing test goes in **crear primero**.

7. **Missing guards (`GUA-`).** What would let these problems come back unnoticed. For example: no ESLint rules for Vitest (`expect-expect`, `no-conditional-expect`, `valid-expect`), no coverage threshold in CI, nobody reviewing retries, no alert when a CI job's time grows, or a spec with neither `@e2e` nor another tag that no job runs. Each one comes with the concrete case from this audit it would have caught.

8. **Order-dependent tests (`DEP-`).** No test may depend on another having run before, or on what another left behind: order, sharding and parallelism can change at any time. Such a test passes by chance, and may hide the very bug it claims to catch. How to find them:
   - **Unit in random order**, with at least 5 different seeds:
     ```sh
     pnpm vitest run --sequence.shuffle --sequence.seed=<seed>
     ```
   - **E2e with several workers** (the config already sets `fullyParallel`) and with `--shard` in a different split than CI's, so cases run in another order and other processes. Also check the `localStorage` that `inject` leaves: a case that does not inject its own definition reads the previous one's.
   - **Static signals:** test objects created once at module level and reused by several cases, library caches or global registries a case fills without clearing, `beforeAll` leaving state the cases modify, and cases reading what the previous case wrote.

   Each candidate is **confirmed** two ways: run alone it passes (or fails) differently than in the order that made it fail, and the test fix (e.g. a new object per case) makes it pass with every seed. Revert that fix after measuring: fixing is a plan task. Record the seeds that make it fail.

## Comparing with the previous audit

- **Start from the registry:** `audit/findings.js`, the same as `/audit`. Read its header first and the open findings with `cat: 'pruebas'`: everything not in `corregido` or `plan`.
- **Measure again** the total time of each suite and each CI job, and compare with the previous run: the trend matters more than a single number.
- **Fixed findings:** redo their mutation or measurement. If the test added for a `HUE-` no longer catches the mutation, or a trimmed test or job got slow again, it is a regression and is reported first.
- **An existing finding is updated, not duplicated:** change its `st` and add a section with `audit: '<this run's id>'` saying what changed and with what evidence.
- **IDs:** new for what is new, never reused: search `audit/findings.js` before using one. Prefixes: `VAC-`, `DUP-`, `LEN-`, `OPT-`, `FLK-`, `HUE-`, `GUA-`, `DEP-` and `INV-` to investigate.

## Format of each finding

Each finding is an entry of `findings` in `audit/findings.js`, in the format of its header, with `cat: 'pruebas'`:

- **`code`**, **`sev`** (`crit` false safety on something critical / `mejora` costs time or confidence / `optim` cleanup) and **`st`** (`corregido` · `probado` for what a mutation confirmed · `medido` · `pendiente` · `investigar`).
- **`title`** in one line and **`audit`**, this run's id.
- **`sections`**, in this order:
  - **Área:** lentas, tiempo de la suite, inestables, dependen de otra, no prueban nada, repetidas, huecos or guardas;
  - **Dónde:** `file :: test name`, or the CI job and step;
  - **Qué pasa;**
  - **Evidencia:** the measurements, with their conditions;
  - **Mutaciones:** the mutation table (`<div class="table-wrap"><table>`), when there is one;
  - **Costo:** seconds per CI run, counting retries and the three browsers;
  - **Propuesta:** delete, merge, move down a level, strengthen the assertion, create the missing test, or change how the suite runs, and what keeps covering the same;
  - **Plan de corrección:** the task that resolves it (see "Deliverable").

## Deliverable

`audit/findings.js` updated:

1. **A new entry in `audits`** for this run (`id: 'test-audit-<date>'`), with a `summary` holding the total time per suite, per browser and per CI job (and the critical path), the totals by area and severity, the measured possible saving, and the feature x level matrix with the gaps marked, in tables (`<div class="table-wrap"><table>`).
2. **New findings** added to `findings`, and existing ones updated (see "Comparing with the previous audit").
3. **Fix plan** as a section of each finding, with the task in one of these phases:
   1. empty tests and gaps in what is critical;
   2. flaky and order-dependent tests;
   3. suite run time (CI and local);
   4. repeated tests;
   5. slow tests;
   6. guards.

   Each task carries its IDs, **crear primero** (the mutation or measurement that proves it), **antes**, **después** and **ahorro o protección esperada**.

After editing, run `pnpm exec prettier --write audit/` and open `audit/index.html` to check the page loads and the new findings show up.

## Fixing later (only when asked, task by task)

1. A new worktree from the audited branch, with its own install.
2. Before the change, redo the evidence: the mutation the remaining test catches, or the duration measurement.
3. **When deleting or merging tests:** run the mutation table again and show every mutation still fails with the resulting suite. If any mutation survives, the cut lost protection and does not go in.
4. **When speeding up:** measure before and after under the same conditions. For a CI change, compare at least three runs on each side.
5. Pass the full checks: `pnpm build`, `pnpm lint`, `pnpm typescript`, `pnpm prettier:check`, `pnpm knip`, `pnpm test:unit` and the affected e2e in all three browsers.
6. Commit in English, with no tool attribution, and **ask before push and PR**.
7. Update the finding in `audit/findings.js`: `st`, and a **Corrección** section with PR, commit, before and after.

## Final answer

A short summary in Spanish with:

- the time of each suite and CI job, and how much can be saved, measured;
- how many findings by area and severity;
- regressions, if any;
- the 3 to 5 actions that save the most time or remove the most false safety, each with its evidence.
