import { getModelContext, registerTools } from '../lib/model-context'
import { logger, type FormStateError, type Nullable } from '@luna-form/core'
import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react'
import { useLatest } from './use-latest'
import type { AgentForm, Submitted } from '../lib/agent-host'
import type {
  Queue,
  Tool,
  ToolDefinition,
  ToolJson,
  ToolResult,
} from '../lib/agent-tools'

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
 * How the tools submit the form and hear how it went: through the `<form>` on
 * the page, as its submit button does, and from what its action leaves.
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

  const settle = useCallback((outcome: Submitted) => {
    status.current = outcome
    waiting.current?.(outcome)
    waiting.current = null
  }, [])

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

  const onSuccess = useCallback(
    (data: Record<string, unknown>) => {
      settle({ data, status: 'success' })
    },
    [settle]
  )

  const submit = useCallback(
    (signal: AbortSignal) =>
      new Promise<Submitted>((resolve) => {
        const form = formRef.current
        if (!form || signal.aborted) {
          resolve({
            error: { title: 'The form is not on the page.' },
            status: 'error',
          })
          return
        }

        waiting.current = resolve
        status.current = { status: 'pending' }
        // Through the form's own submit button when it has one, so its `name`
        // and `value` are sent as they are when a person presses it.
        form.requestSubmit(findSubmitter(form))
      }),
    [formRef]
  )

  const getStatus = useCallback(() => status.current, [])

  return useMemo(
    () => ({ getStatus, observe, onSuccess, submit }),
    [getStatus, observe, onSuccess, submit]
  )
}

function findSubmitter(
  form: HTMLFormElement
): HTMLButtonElement | HTMLInputElement | undefined {
  for (const element of form.elements) {
    if (
      (element instanceof HTMLButtonElement ||
        element instanceof HTMLInputElement) &&
      element.type === 'submit'
    ) {
      return element
    }
  }
  return undefined
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

  // While the form is on the page under its name: the signal of its life,
  // which takes down every tool built for it and refuses what `allow` was
  // still being asked, and the queue every one of them shares.
  const life = useRef<{
    controller: AbortController
    entry: PageEntry
    queue?: Queue
  } | null>(null)

  // The tools built last, what tells whether a build would give the same ones,
  // and the signal that unregisters them.
  const current = useRef<{
    key: string
    registration: AbortController
    tools: readonly Tool[]
  } | null>(null)

  const build = useCallback(async (): Promise<readonly Tool[]> => {
    const owner = life.current
    if (!owner || !answersToItsName(owner.entry)) {
      return []
    }

    const { createAgentTools } = await import('../lib/agent-host')

    // Gone, or replaced by a remount, while the module loaded.
    if (life.current !== owner) {
      return []
    }

    const built = createAgentTools(() => latest.current, {
      queue: owner.queue,
      signal: owner.controller.signal,
    })
    owner.queue = built.queue

    if (current.current?.key === built.key) {
      return current.current.tools
    }

    current.current?.registration.abort()
    const registration = new AbortController()
    owner.controller.signal.addEventListener(
      'abort',
      () => registration.abort(),
      { once: true }
    )
    current.current = { key: built.key, registration, tools: built.tools }

    const modelContext = getModelContext()
    if (modelContext) {
      registerTools(
        modelContext,
        built.tools,
        registration.signal,
        (tool, error) =>
          logger.warn(`The tool ${tool.name} was not registered.`, error)
      )
    }
    return built.tools
  }, [latest])

  // Built afresh when the definition changed since, and handed out as they are
  // otherwise.
  const stale = useRef(true)
  const load = useCallback(async () => {
    if (!stale.current && current.current) {
      return current.current.tools
    }
    stale.current = false
    return build()
  }, [build])

  const name = form.agent?.name
  useEffect(() => {
    if (!name) {
      return
    }

    const entry: PageEntry = {
      load,
      name,
      wake: () => {
        if (getModelContext()) {
          void load()
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

    const owner = { controller: new AbortController(), entry }
    life.current = owner
    stale.current = true
    page.add(entry)

    return () => {
      page.delete(entry)
      owner.controller.abort()
      life.current = null
      current.current = null

      for (const other of page) {
        if (other.name === name) {
          other.wake()
          break
        }
      }
    }
  }, [load, name])

  // What the tools are built from. With WebMCP on the page they are built and
  // registered on mount, and again a pause after it changes; without it, the
  // next `listTools()` or `callTool()` builds them.
  //
  // The agent by what describes its tools, not by identity: a host writes the
  // object inline, new on every render. `allow` and `readOnly` are read when
  // they are needed.
  const { context, definition, localization, sections } = form
  // By content: a host that defines its config in a component makes the
  // record anew on every render.
  const types = JSON.stringify(form.types ?? null)
  const description = form.agent?.description
  const submit = form.agent?.submit
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
        void load()
      },
      current.current ? REBUILD_DELAY : 0
    )
    return () => clearTimeout(timer)
  }, [
    context,
    definition,
    description,
    load,
    localization,
    name,
    sections,
    submit,
    types,
  ])
}
