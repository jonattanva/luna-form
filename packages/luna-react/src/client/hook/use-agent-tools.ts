import { getModelContext } from '../lib/model-context'
import { logger, type FormStateError, type Nullable } from '@luna-form/core'
import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react'
import { useLatest } from './use-latest'
import type { AgentForm, AgentRuntime, Submitted } from '../lib/agent-host'
import type {
  Approval,
  Tool,
  ToolDefinition,
  ToolJson,
  ToolResult,
} from '../lib/agent-tools'

// What lives here is what every form pays for: the page's registry, the two
// functions that read it, and what a form records of its submissions. What
// builds and registers the tools is loaded the first time they are needed.
// See `createAgentRuntime`.

// A form on the page offered to agents: its name, its tools, built when
// someone first asks for them, and what to do when it becomes the form that
// answers to its name.
type PageEntry = Readonly<{
  load: () => Promise<readonly Tool[]>
  name: string
  wake: () => void
}>

// Every form with `agent` mounted on the page, in the order they mounted. Of
// two under one name, the first answers to it; the second, once the first is
// gone.
const page = new Set<PageEntry>()

function answersToItsName(entry: PageEntry): boolean {
  for (const other of page) {
    if (other.name === entry.name) {
      return other === entry
    }
  }
  return false
}

// A build that failed where nothing waits for it: the form goes on without
// its tools, and the next one tries again.
function report(error: Error) {
  logger.warn('The agent tools of a form could not be built.', error)
}

// How long a form waits after its definition changes before it builds its
// tools again: an editor changes it with every key typed into it.
const REBUILD_DELAY = 500

/**
 * The tools of every form with `agent` on the page, without WebMCP: for an
 * agent that calls a model's API and hands the page each call it asks for.
 * Asynchronous because the tools are loaded the first time they are asked for.
 */
export async function listTools(): Promise<ToolDefinition[]> {
  const loaded = await Promise.all([...page].map((entry) => entry.load()))
  return loaded.flat().map((tool) => ({
    annotations: tool.annotations,
    description: tool.description,
    inputSchema: tool.inputSchema,
    name: tool.name,
    outputSchema: tool.outputSchema,
    title: tool.title,
  }))
}

/**
 * Calls a tool of a form on the page by its name, as WebMCP would. A name no
 * form on the page has answers `unknown`, as a field it does not have does.
 */
export async function callTool(
  name: string,
  input: ToolJson,
  options?: Readonly<{ signal?: AbortSignal }>
): Promise<ToolResult> {
  for (const entry of page) {
    if (!name.startsWith(`${entry.name}_`)) {
      continue
    }
    const tool = (await entry.load()).find((each) => each.name === name)
    if (tool) {
      return tool.execute(input, options)
    }
  }
  return { code: 'unknown', message: `No tool named "${name}".`, ok: false }
}

type FormState = Readonly<{
  error: Nullable<FormStateError>
  success: boolean
}>

/**
 * What a form records of its submissions, for the tools to submit it and hear
 * how it went: the last outcome, and whoever waits for the next one.
 *
 * Made before the form's action state, so that `onSuccess` -- called with what
 * the action returned, which the state a success leaves does not keep -- can
 * go into it. A success is told from there, so it reaches the agent even when
 * the host takes the form off the page for it; `observe` is handed the state
 * on every commit, for a failure.
 */
export function useSubmission(formRef: RefObject<HTMLFormElement | null>) {
  const status = useRef<Submitted>({ status: 'idle' })
  const waiting = useRef<((outcome: Submitted) => void) | null>(null)
  const initial = useRef<FormState | null>(null)

  // A success held back until the form has started over. See `restart`.
  const held = useRef<Submitted | null>(null)

  const settle = useCallback((outcome: Submitted) => {
    held.current = null
    status.current = outcome
    waiting.current?.(outcome)
    waiting.current = null
  }, [])

  const release = useCallback(() => {
    if (held.current) {
      settle(held.current)
    }
  }, [settle])

  const observe = useCallback(
    (state: FormState, isPending: boolean) => {
      initial.current ??= state
      if (isPending) {
        status.current = { status: 'pending' }
        return
      }

      // The state the form starts with is no submission, and a success has
      // been told already.
      if (state === initial.current || state.success) {
        return
      }

      settle({ ...(state.error && { error: state.error }), status: 'error' })
    },
    [settle]
  )

  // A success starts the form over, so whoever waits for it is answered once
  // the form has, and reads what the form holds then rather than a store about
  // to be dropped or one its fields have not reported into yet. Until then the
  // submission is still pending, and no other is sent into the form leaving.
  const onSuccess = useCallback((data: Record<string, unknown>) => {
    held.current = { data, status: 'success' }
  }, [])

  // The outcome of the submission about to start.
  const wait = useCallback(
    () =>
      new Promise<Submitted>((resolve) => {
        waiting.current = resolve
        status.current = { status: 'pending' }
      }),
    []
  )

  const getStatus = useCallback(() => status.current, [])

  // Where an agent's submission stands while a person decides on it, as the
  // last submission. A wait taken back puts back what was there before it,
  // unless a submission has taken its place.
  const before = useRef<Submitted>({ status: 'idle' })
  const approval = useCallback((approval?: Approval) => {
    if (approval?.status === 'awaiting_approval') {
      before.current = status.current
    }
    if (approval) {
      status.current = approval
    } else if (status.current.status === 'awaiting_approval') {
      status.current = before.current
    }
  }, [])

  // The form started over: the state its action begins with is a new one,
  // and no submission either. The last outcome stays, for an agent to read.
  // Called as the form mounts anew, after its fields have, so a success held
  // for it is told here.
  const restart = useCallback(() => {
    initial.current = null
    release()
  }, [release])

  // A form taken off the page does not start over, and whoever waits is told
  // all the same.
  useEffect(() => release, [release])

  return useMemo(
    () => ({ approval, formRef, getStatus, observe, onSuccess, restart, wait }),
    [approval, formRef, getStatus, observe, onSuccess, restart, wait]
  )
}

/**
 * Offers a form to agents while it is mounted with `agent`: through WebMCP
 * when the browser has it, and through `listTools()` and `callTool()` always.
 *
 * Nothing is built until it is needed -- WebMCP on the page, or a call to
 * either function -- and the module that builds the tools is loaded then. A
 * definition that changes builds them again after a pause, and registers them
 * again only when they come out different.
 */
export function useAgentTools(form: AgentForm) {
  const latest = useLatest(form)

  // The form on the page under its name, while it is.
  const entry = useRef<PageEntry | null>(null)

  // Whether the definition changed since the tools were last built.
  const stale = useRef(true)

  // Whether the tools were built since the form took its name, which is when
  // a change to the definition waits a pause before they are built again.
  const built = useRef(false)

  const name = form.agent?.name
  useEffect(() => {
    if (!name) {
      return
    }

    // What builds and registers the tools for this form while it is on the
    // page, loaded the first time it is needed. A load that failed is tried
    // again the next time.
    let runtime: Promise<AgentRuntime> | undefined
    let loaded: AgentRuntime | undefined

    const mounted: PageEntry = {
      load: async () => {
        if (!answersToItsName(mounted)) {
          return []
        }

        runtime ??= import('../lib/agent-host').then(
          ({ createAgentRuntime }) => {
            loaded = createAgentRuntime(() => latest.current)
            return loaded
          },
          (error: Error) => {
            runtime = undefined
            throw error
          }
        )
        const ready = await runtime

        // Gone while the module loaded.
        if (!page.has(mounted)) {
          return []
        }

        // Fresh until a build succeeds: one that throws is built again.
        const tools = ready.load(stale.current)
        stale.current = false
        built.current = true
        return tools
      },
      name,
      wake: () => {
        if (getModelContext()) {
          void mounted.load().catch(report)
        }
      },
    }

    for (const other of page) {
      if (other.name === name) {
        logger.warn(
          `Two forms on the page are offered to agents as "${name}": the second offers its tools once the first is gone.`
        )
        break
      }
    }

    stale.current = true
    built.current = false
    entry.current = mounted
    page.add(mounted)

    return () => {
      page.delete(mounted)
      entry.current = null
      built.current = false

      // At once when the module is here, so nothing registered outlives the
      // form, and the next form under its name registers after it.
      if (loaded) {
        loaded.dispose()
      } else {
        void runtime?.then((ready) => ready.dispose()).catch(report)
      }

      for (const other of page) {
        if (other.name === name) {
          other.wake()
          break
        }
      }
    }
  }, [latest, name])

  // What the tools are built from. With WebMCP on the page they are built and
  // registered on mount, and again a pause after it changes; without it, the
  // next `listTools()` or `callTool()` builds them.
  //
  // The agent by what describes its tools, not by identity: a host writes the
  // object inline, new on every render. `allow` and `readOnly` are read when
  // they are needed: of `allow`, only whether there is one is described.
  const { context, definition, localization, sections } = form
  const approves = form.agent?.allow !== undefined
  const description = form.agent?.description
  const submit = form.agent?.submit
  // Only whether the host names the item the form edits: which one is read
  // on every call.
  const targets = form.agent?.target !== undefined
  const title = form.agent?.title
  const validates = form.validates
  // By content: a host that defines its config in a component makes the
  // record anew on every render, and writes the shape of what its action
  // returns inline.
  const output = JSON.stringify(form.agent?.output ?? null)
  const types = JSON.stringify(form.types ?? null)
  useEffect(() => {
    if (!name) {
      return
    }

    stale.current = true
    if (!getModelContext()) {
      return
    }

    const timer = setTimeout(
      () => {
        void entry.current?.load().catch(report)
      },
      built.current ? REBUILD_DELAY : 0
    )
    return () => clearTimeout(timer)
  }, [
    approves,
    context,
    definition,
    description,
    localization,
    name,
    output,
    sections,
    submit,
    targets,
    title,
    types,
    validates,
  ])
}
