import { composeListValue } from './compose-list-value'
import { isUnder } from './store-helper'
import { createFormTools, createQueue, type Queue } from './agent-tools'
import { fieldStateAtom } from './state-store'
import { inputErrorAtom } from './error-store'
import {
  mountedListsAtom,
  pendingListRowsAtom,
  type MountedList,
} from './list-store'
import { sourceAtom } from './source-store'
import { touchedAtom, valueAtom } from './value-store'
import {
  buildToolSchema,
  flattenOptions,
  getPreviewOptions,
  getTimezones,
  isColumn,
  isList,
  isObject,
  isSelectTimezone,
  isString,
  logger,
  prepare,
  translateBuiltIn,
  type Definition,
  type Field,
  type Fields,
  type FormStateError,
  type Localization,
  type Option,
  type Sections,
  type ToolSchema,
} from '@luna-form/core'
import { getModelContext, type ModelContext } from './model-context'
import type { RefObject } from 'react'
import type { useStore } from 'jotai'
import type {
  AgentOptions,
  FormToolsHost,
  SubmitStatus,
  Tool,
  ToolJson,
  ToolResult,
  ToolRow,
  ToolValue,
} from './agent-tools'
import type { FieldHandle } from '../hook/use-apply'

type Store = ReturnType<typeof useStore>

// What the tools are told of the changes a person makes. See `watchChanges`.
type Changes = Pick<FormToolsHost, 'isChanged' | 'seen'>

// What the person is shown of an agent at work. See `showAgent`.
type Signs = Pick<FormToolsHost, 'filled' | 'using'>

/** The last submission as the form keeps it, before it is told to an agent. */
export type Submitted = Readonly<{
  data?: Record<string, unknown>
  error?: FormStateError
  status: SubmitStatus['status']
}>

/**
 * What a form records of its submissions, for the tools to submit it and hear
 * how it went. `wait` answers with the outcome of the submission about to
 * start. See `useSubmission`.
 */
export type Submission = Readonly<{
  formRef: RefObject<HTMLFormElement | null>
  getStatus: () => Submitted
  wait: () => Promise<Submitted>
}>

/** What builds and registers a form's tools while it is on the page. */
export type AgentRuntime = Readonly<{
  dispose: () => void
  load: (fresh: boolean) => readonly Tool[]
}>

/**
 * What a form hands over to be offered to an agent, read afresh on every use:
 * what can change without changing the tools -- `allow`, `readOnly`, the
 * instant in `context` -- is never the value it had when they were built.
 */
export type AgentForm = Readonly<{
  agent?: AgentOptions
  context?: Record<string, unknown>
  definition?: Definition
  // The `<form>` on the page: a start over draws a new one.
  formRef: RefObject<HTMLFormElement | null>
  getHandles: () => ReadonlyMap<string, FieldHandle>
  localization: Localization
  readOnly?: boolean
  sections: Sections
  store: Store
  submission?: Submission
  // The schema each custom type declares for agents. See `defineCustomInput`.
  types?: Readonly<Record<string, ToolSchema>>
  // Whether a submit checks the values: `validation.submit`.
  validates?: boolean
}>

// How long the form is given to settle after a round of writes: until nothing
// it holds has changed for one step, and no longer than the limit. On a timer,
// which keeps running in a tab in the background, where animation frames do
// not.
const SETTLE_STEP = 50
const SETTLE_LIMIT = 2_000

/**
 * Builds a form's tools, registers them with WebMCP when the browser has it,
 * and registers them again only when a build gives different ones. `fresh`
 * says the definition changed since the last build; without it the tools built
 * last are handed out as they are. `dispose` takes every one of them down and
 * refuses what `allow` was still being asked: the form is gone.
 */
export function createAgentRuntime(read: () => AgentForm): AgentRuntime {
  // The life of the form, the queue every set of its tools shares, and what
  // the agent was told of the changes a person made.
  const life = new AbortController()
  let queue: Queue | undefined
  const changes = watchChanges(() => read().store)
  const signs = showAgent(read, life.signal)

  // The tools built last, what tells whether a build would give the same ones,
  // and the signal that unregisters them.
  let current: Readonly<{
    key: string
    registration: AbortController
    tools: readonly Tool[]
  }> | null = null

  return {
    dispose: () => life.abort(),
    load: (fresh) => {
      if (life.signal.aborted) {
        return []
      }
      if (current && !fresh) {
        return current.tools
      }

      const built = createAgentTools(read, {
        changes,
        queue,
        signal: life.signal,
        signs,
      })
      queue = built.queue
      if (current?.key === built.key) {
        return current.tools
      }

      current?.registration.abort()
      const registration = new AbortController()
      life.signal.addEventListener('abort', () => registration.abort(), {
        once: true,
      })
      current = { key: built.key, registration, tools: built.tools }

      const modelContext = getModelContext()
      if (modelContext) {
        registerTools(modelContext, built.tools, registration.signal)
      }
      return built.tools
    },
  }
}

/**
 * Registers each tool until `signal` is aborted. A page that turned tools off
 * (`NotAllowedError`) and a form gone before its tools were in (`AbortError`)
 * are no fault of the form; anything else is reported, and the form goes on
 * without that tool.
 */
function registerTools(
  modelContext: ModelContext,
  tools: readonly Tool[],
  signal: AbortSignal
) {
  for (const tool of tools) {
    // A browser on an older draft returns nothing or throws instead of
    // rejecting, so both end up in the same `catch`.
    Promise.resolve()
      .then(() => modelContext.registerTool(tool, { signal }))
      .catch((error: Error) => {
        if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
          logger.warn(`The tool ${tool.name} was not registered.`, error)
        }
      })
  }
}

/**
 * The tools of a form, and what tells whether they would be the same ones
 * again: the agent's own options and the schema, as text. Two builds with the
 * same `key` describe the same tools, so there is nothing to register again.
 *
 * `queue`, `changes` and `signs` are the form's, kept from one build to the
 * next; `signal` is the life of the form.
 */
function createAgentTools(
  read: () => AgentForm,
  options: Readonly<{
    changes: Changes
    queue?: Queue
    signal: AbortSignal
    signs: Signs
  }>
): Readonly<{ key: string; queue: Queue; tools: Tool[] }> {
  const form = read()
  const built = buildToolSchema(form.sections, {
    context: form.context,
    definition: form.definition,
    localization: form.localization,
    types: form.types,
  })

  const agent: AgentOptions = {
    description: form.agent?.description ?? '',
    name: form.agent?.name ?? '',
    // Sending needs a form that does something with it.
    submit: form.agent?.submit === true && form.submission !== undefined,
    // The host's latest, whichever it was when the tools were built.
    allow: (call, allowOptions) => {
      const allow = read().agent?.allow
      return allow ? allow(call, allowOptions) : true
    },
    onCall: (call) => read().agent?.onCall?.(call),
  }

  const host = createFormHost(
    read,
    indexFields(prepareFields(form.sections, form.definition, form.context)),
    { ...options.changes, ...options.signs }
  )
  const queue = options.queue ?? createQueue()

  return {
    key: JSON.stringify([
      agent.name,
      agent.description,
      agent.submit,
      form.validates !== false,
      built,
    ]),
    queue,
    tools: createFormTools(agent, built, host, {
      declared: new Set(Object.keys(form.types ?? {})),
      queue,
      signal: options.signal,
      validates: form.validates,
    }),
  }
}

function prepareFields(
  sections: Sections,
  definition?: Definition,
  context?: Record<string, unknown>
): Fields {
  return prepare(sections, definition, context).flatMap(
    (section) => section.fields ?? []
  )
}

// Every field by the name the tool schema gives it: a column's fields at the
// level of the column, and a list's leaves through its first row,
// `items.0.sku`. The first field to take a name keeps it.
function indexFields(
  fields: Fields,
  prefix = '',
  index = new Map<string, Field>()
): ReadonlyMap<string, Field> {
  for (const entry of prepare(fields)) {
    if (isColumn(entry)) {
      indexFields(entry.fields, prefix, index)
    } else if (isList(entry)) {
      indexFields(entry.fields, `${prefix}${entry.name}.0.`, index)
    } else if (!index.has(`${prefix}${entry.name}`)) {
      index.set(`${prefix}${entry.name}`, entry)
    }
  }
  return index
}

/**
 * The form as the tools reach it: each field through the handle it registered,
 * a list through the rows a `value` event hands it, and the rest through the
 * form's store.
 */
function createFormHost(
  read: () => AgentForm,
  fields: ReadonlyMap<string, Field>,
  parts: Changes & Signs
): FormToolsHost {
  // The store as the form holds it now: a success starts the form over on a
  // new one, and the tools built before it go on reading and writing the form.
  const { getHandles } = read()
  const store = () => read().store
  const lists = () => store().get(mountedListsAtom)

  return {
    ...parts,

    apply: (name, value, options) =>
      getHandles().get(name)?.apply(value, options) ?? false,

    applyRows: (name, rows) => {
      if (!lists()[name]) {
        return false
      }
      store().set(pendingListRowsAtom, {
        ...store().get(pendingListRowsAtom),
        [name]: { rows: rows.map((row) => ({ ...row })), source: 'agent' },
      })
      return true
    },

    getErrors: () => store().get(inputErrorAtom),

    getField: (name) => fields.get(name),

    getOptions: (path, name) =>
      (name === undefined ? undefined : getHandles().get(name)?.options()) ??
      declaredOptions(fields.get(path), read()),

    // A field hidden is not mounted, and has no handle to ask.
    getStatus: (name) => {
      const handle = getHandles().get(name)
      if (handle) {
        return { hidden: false, locked: handle.isLocked() }
      }
      return lists()[name]
        ? { hidden: false, locked: read().readOnly === true }
        : undefined
    },

    getSubmit: () => toSubmitStatus(read().submission?.getStatus(), store()),

    // What the form holds, against what the page drew: rows a list has not
    // taken yet, a field a `state` event shows with no handle yet, or one it
    // unlocks with its handle still locked. A field its own definition makes
    // read-only, or a form that is, stays locked whatever the event says, and
    // a list on the form is drawn, read-only or not.
    isDrawing: (name, path) => {
      if (store().get(pendingListRowsAtom)[name]) {
        return true
      }
      const state = store().get(fieldStateAtom)[name]
      if (!state) {
        return false
      }
      const handle = getHandles().get(name)
      if (!handle) {
        return state.hidden === false && !lists()[name]
      }
      return (
        state.disabled === false &&
        handle.isLocked() &&
        read().readOnly !== true &&
        fields.get(path)?.readonly !== true
      )
    },

    resolve: (route) => translateRows(route, lists(), 'id'),

    locate: (name) => translateRows(name, lists(), 'position'),

    read: (name) => {
      const mounted = lists()
      const list = mounted[name]
      const values = store().get(valueAtom)
      return list
        ? composeListValue(name, list, { mounted, values }).map(toRow)
        : toToolValue(values[name])
    },

    settle: () => settle(store, getHandles),

    submit: async (signal) => {
      const submission = read().submission
      const form = submission?.formRef.current
      if (!submission || !form || signal.aborted) {
        return toSubmitStatus(
          { error: { title: 'The form is not on the page.' }, status: 'error' },
          store()
        )
      }

      const outcome = submission.wait()
      // Through the form's own submit button when it has one, so its `name`
      // and `value` are sent as they are when a person presses it.
      form.requestSubmit(findSubmitter(form))
      return toSubmitStatus(await outcome, store())
    },

    validate: (names) => {
      const errors: Record<string, readonly string[]> = {}
      for (const [name, handle] of getHandles()) {
        if (
          names.some((list) => name === list || name.startsWith(`${list}.`))
        ) {
          errors[name] = handle.validate()
        }
      }
      return errors
    },
  }
}

// A name with the row of every list in it named the other way: by position,
// as an agent names it, or by the id the form keeps it under. `to` says which
// the result uses. A list is found by the name the form gives it, ids and all,
// so one in a row (`items.<id>.parts`) is found whichever way the row was
// named. `undefined` when a row is not there, or not named as a row is: a
// whole number, with no leading zero.
function translateRows(
  name: string,
  mounted: Readonly<Record<string, MountedList>>,
  to: 'id' | 'position'
): string | undefined {
  const segments = name.split('.')
  let key = ''
  let translated = ''

  for (let index = 0; index < segments.length; index++) {
    key = key ? `${key}.${segments[index]}` : segments[index]
    translated = translated
      ? `${translated}.${segments[index]}`
      : segments[index]

    const list = mounted[key]
    const row = segments[index + 1]
    if (!list || row === undefined) {
      continue
    }
    if (!/^(0|[1-9]\d*)$/.test(row)) {
      return undefined
    }

    const position = to === 'id' ? Number(row) : list.items.indexOf(Number(row))
    const id = list.items[position]
    if (id === undefined) {
      return undefined
    }

    key = `${key}.${id}`
    translated = `${translated}.${to === 'id' ? id : position}`
    index++
  }
  return translated
}

// The options a field's definition gives it, for a field that is not mounted
// to say which it offers: a leaf of a list, or a field not shown yet.
function declaredOptions(
  field: Field | undefined,
  form: AgentForm
): readonly Option[] | undefined {
  if (!field) {
    return undefined
  }

  if (isSelectTimezone(field)) {
    const now = form.context?.now
    return flattenOptions(
      getTimezones(undefined, isString(now) ? now : undefined)
    )
  }

  const options = getPreviewOptions(field, form.localization)
  return options && flattenOptions(options)
}

/**
 * What a person changed in a form that the agent was not told of: a field, a
 * value in a row, or a list's rows. What the form notes a person changed is
 * kept against what an agent was told it held, by the number each change
 * takes; one that changed since is news to the agent. A success starts the
 * form over on a new store with nothing noted, and what was changed before is
 * gone with what it held.
 */
function watchChanges(current: () => Store): Changes {
  const told = new Map<string, number>()
  let watched: Store | undefined
  const untold = () => {
    const store = current()
    if (store !== watched) {
      watched = store
      told.clear()
    }
    return Object.entries(store.get(touchedAtom)).filter(
      ([name, at]) => told.get(name) !== at
    )
  }

  // A value under the name, or the rows of a list it is or is in: a row named
  // by its position is another row once they moved, and the agent told what
  // one row holds now has been told they moved.
  const concerns = (key: string, names: readonly string[]) =>
    isUnder(key, names) || names.some((name) => isUnder(name, [key]))

  return {
    isChanged: (name) => untold().some(([key]) => concerns(key, [name])),
    seen: (names) => {
      for (const [key, at] of untold()) {
        if (concerns(key, names)) {
          told.set(key, at)
        }
      }
    },
  }
}

// Hidden from sight, not from a screen reader.
const UNSEEN =
  'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap'

// How long a live region waits before it speaks: one put on the page and given
// its text at once is not always heard.
const ANNOUNCE_DELAY = 100

/**
 * What the person sees of an agent at work on a form, for the host to style:
 *
 * - `data-agent-active` on the `<form>` while a call runs;
 * - `data-agent-filled` on the field (`[data-slot="field"]`) of each value a
 *   fill changed, or that its change events did, until the person changes it
 *   or the rows of a list it is in;
 * - a polite live region in the form that says how many fields a fill
 *   filled, in the form's language.
 *
 * Attributes on elements React renders, which it leaves alone because it did
 * not set them; a field drawn again, or a form started over, has none.
 */
function showAgent(read: () => AgentForm, signal: AbortSignal): Signs {
  let active = 0
  let region: HTMLElement | undefined
  let timer: ReturnType<typeof setTimeout> | undefined

  // The fields marked, by the name of their control, with what the form had
  // noted of a person's change to it, or to a list it is in, then.
  const marked = new Map<string, string>()
  let watched: Store | undefined
  let stop = () => {}

  const fieldOf = (control: Element) => control.closest('[data-slot="field"]')

  const noted = (
    name: string,
    touched: Readonly<Record<string, number>>
  ): string =>
    Object.entries(touched)
      .filter(([key]) => isUnder(name, [key]))
      .map(([key, at]) => `${key}:${at}`)
      .join(' ')

  const clear = (name: string) => {
    marked.delete(name)
    for (const control of read().formRef.current?.querySelectorAll(
      `[name="${CSS.escape(name)}"]`
    ) ?? []) {
      fieldOf(control)?.removeAttribute('data-agent-filled')
    }
  }

  // A person's change takes the mark off.
  const unmark = () => {
    const touched = watched?.get(touchedAtom) ?? {}
    for (const [name, at] of marked) {
      if (noted(name, touched) !== at) {
        clear(name)
      }
    }
  }

  // In the form, so a form in a modal dialog is heard; put back when a start
  // over draws a new one.
  const announce = (form: HTMLFormElement, text: string) => {
    if (!region) {
      region = document.createElement('div')
      region.setAttribute('aria-live', 'polite')
      region.setAttribute('aria-atomic', 'true')
      region.style.cssText = UNSEEN
    }
    if (region.parentElement !== form) {
      form.append(region)
    }
    const speaking = region
    speaking.textContent = ''
    clearTimeout(timer)
    timer = setTimeout(() => {
      speaking.textContent = text
    }, ANNOUNCE_DELAY)
  }

  signal.addEventListener(
    'abort',
    () => {
      stop()
      clearTimeout(timer)
      region?.remove()
      for (const name of marked.keys()) {
        clear(name)
      }
      read().formRef.current?.removeAttribute('data-agent-active')
    },
    { once: true }
  )

  return {
    filled: (names) => {
      const form = read().formRef.current
      if (!form || signal.aborted) {
        return
      }

      // A new store is a form started over: its fields are drawn anew.
      const { store } = read()
      if (store !== watched) {
        stop()
        marked.clear()
        watched = store
        stop = store.sub(touchedAtom, unmark)
      }

      // A list's name marks the fields of its rows.
      const touched = store.get(touchedAtom)
      const fields = new Set<Element>()
      for (const name of names) {
        const escaped = CSS.escape(name)
        for (const control of form.querySelectorAll(
          `[name="${escaped}"], [name^="${escaped}."]`
        )) {
          const field = fieldOf(control)
          const controlName = control.getAttribute('name')
          if (field && controlName) {
            field.setAttribute('data-agent-filled', '')
            marked.set(controlName, noted(controlName, touched))
            fields.add(field)
          }
        }
      }

      if (fields.size > 0) {
        const translations = read().localization.translations
        announce(
          form,
          fields.size === 1
            ? translateBuiltIn('An agent filled 1 field', translations)
            : translateBuiltIn(
                'An agent filled {count} fields',
                translations
              ).replace('{count}', String(fields.size))
        )
      }
    },

    using: (on) => {
      active += on ? 1 : -1
      const form = read().formRef.current
      if (active > 0) {
        form?.setAttribute('data-agent-active', '')
      } else {
        form?.removeAttribute('data-agent-active')
      }
    },
  }
}

// Waits until nothing the form holds has changed for one step: the change
// events a write runs, the fields they show or hide, and the rows a list takes.
async function settle(
  current: () => Store,
  getHandles: () => ReadonlyMap<string, FieldHandle>
) {
  const read = () => {
    const store = current()
    return [
      store.get(valueAtom),
      store.get(fieldStateAtom),
      store.get(mountedListsAtom),
      store.get(pendingListRowsAtom),
      store.get(sourceAtom),
      [...getHandles().keys()].join('\n'),
    ]
  }

  let last = read()
  for (let waited = 0; waited < SETTLE_LIMIT; waited += SETTLE_STEP) {
    await new Promise((resolve) => setTimeout(resolve, SETTLE_STEP))
    const now = read()
    if (now.every((part, index) => part === last[index])) {
      return
    }
    last = now
  }
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

function toSubmitStatus(
  submitted: Submitted | undefined,
  store: Store
): SubmitStatus {
  if (!submitted || submitted.status === 'idle') {
    return { status: 'idle' }
  }
  if (submitted.status !== 'error') {
    return {
      ...(submitted.data && { data: toToolResult(submitted.data) }),
      status: submitted.status,
    }
  }

  const { description, details, title } = submitted.error ?? {
    title: 'The submission failed.',
  }
  return {
    error: {
      ...(description && { description }),
      ...(details && { details: toToolJson(details) }),
      title,
    },
    errors: store.get(inputErrorAtom),
    status: 'error',
  }
}

// What the form holds, as a tool reads it: a value, or nothing for anything
// that is not one.
function toToolValue(value: unknown): ToolValue {
  if (
    isString(value) ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }
  if (!Array.isArray(value)) {
    return null
  }
  return value.every(
    (item) =>
      isString(item) || typeof item === 'number' || typeof item === 'boolean'
  )
    ? value
    : value.filter((item) => isObject(item)).map(toRow)
}

function toRow(row: Record<string, unknown>): ToolRow {
  return Object.fromEntries(
    Object.entries(row).map(([leaf, value]) => [leaf, toToolValue(value)])
  )
}

// What an action answered, as JSON carries it: what JSON cannot hold is left
// out, as `JSON.stringify` leaves it out.
function toToolJson(value: unknown): ToolJson {
  if (
    value === null ||
    isString(value) ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  ) {
    return value
  }
  if (Array.isArray(value)) {
    return value.map(toToolJson)
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  return isObject(value) ? toToolResult(value) : null
}

function toToolResult(record: Record<string, unknown>): ToolResult {
  return Object.fromEntries(
    Object.entries(record).flatMap(([key, value]) =>
      value === undefined || typeof value === 'function'
        ? []
        : [[key, toToolJson(value)]]
    )
  )
}
