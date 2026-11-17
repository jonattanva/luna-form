import { composeListValue } from './compose-list-value'
import { createFormTools, createQueue, type Queue } from './agent-tools'
import { fieldStateAtom } from './state-store'
import { inputErrorAtom } from './error-store'
import { mountedListsAtom, pendingListRowsAtom } from './list-store'
import { sourceAtom } from './source-store'
import { valueAtom } from './value-store'
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
  prepare,
  type Definition,
  type Field,
  type Fields,
  type FormStateError,
  type Localization,
  type Option,
  type Sections,
} from '@luna-form/core'
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

/** The last submission as the form keeps it, before it is told to an agent. */
export type Submitted = Readonly<{
  data?: Record<string, unknown>
  error?: FormStateError
  status: SubmitStatus['status']
}>

/** How the tools submit a form and hear how it went. */
export type Submission = Readonly<{
  getStatus: () => Submitted
  submit: (signal: AbortSignal) => Promise<Submitted>
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
  getHandles: () => ReadonlyMap<string, FieldHandle>
  localization: Localization
  readOnly?: boolean
  sections: Sections
  store: Store
  submission?: Submission
}>

// How long the form is given to settle after a round of writes: until nothing
// it holds has changed for one step, and no longer than the limit. On a timer,
// which keeps running in a tab in the background, where animation frames do
// not.
const SETTLE_STEP = 50
const SETTLE_LIMIT = 2_000

/**
 * The tools of a form, and what tells whether they would be the same ones
 * again: the agent's own options and the schema, as text. Two builds with the
 * same `key` describe the same tools, so there is nothing to register again.
 *
 * `queue` is the form's, kept from one build to the next; `signal` is the life
 * of the form.
 */
export function createAgentTools(
  read: () => AgentForm,
  options: Readonly<{ queue?: Queue; signal: AbortSignal }>
): Readonly<{ key: string; queue: Queue; tools: Tool[] }> {
  const form = read()
  const built = buildToolSchema(form.sections, {
    context: form.context,
    definition: form.definition,
    localization: form.localization,
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
  }

  const host = createFormHost(
    read,
    indexFields(prepareFields(form.sections, form.definition, form.context))
  )
  const queue = options.queue ?? createQueue()

  return {
    key: JSON.stringify([agent.name, agent.description, agent.submit, built]),
    queue,
    tools: createFormTools(agent, built, host, {
      queue,
      signal: options.signal,
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
  fields: ReadonlyMap<string, Field>
): FormToolsHost {
  const { getHandles, store } = read()
  const lists = () => store.get(mountedListsAtom)

  return {
    apply: (name, value, options) =>
      getHandles().get(name)?.apply(value, options) ?? false,

    applyRows: (name, rows) => {
      if (!lists()[name]) {
        return false
      }
      store.set(pendingListRowsAtom, {
        ...store.get(pendingListRowsAtom),
        [name]: rows.map((row) => ({ ...row })),
      })
      return true
    },

    getErrors: () => store.get(inputErrorAtom),

    getField: (name) => fields.get(name),

    getOptions: (name) =>
      getHandles().get(name)?.options() ??
      declaredOptions(fields.get(name), read()),

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

    getSubmit: () => toSubmitStatus(read().submission?.getStatus(), store),

    read: (name) => {
      const mounted = lists()
      const list = mounted[name]
      const values = store.get(valueAtom)
      return list
        ? composeListValue(name, list, { mounted, values }).map(toRow)
        : toToolValue(values[name])
    },

    settle: () => settle(store, getHandles),

    submit: async (signal) => {
      const outcome = await read().submission?.submit(signal)
      return toSubmitStatus(outcome, store)
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

// Waits until nothing the form holds has changed for one step: the change
// events a write runs, the fields they show or hide, and the rows a list takes.
async function settle(
  store: Store,
  getHandles: () => ReadonlyMap<string, FieldHandle>
) {
  const read = () => [
    store.get(valueAtom),
    store.get(fieldStateAtom),
    store.get(mountedListsAtom),
    store.get(pendingListRowsAtom),
    store.get(sourceAtom),
    [...getHandles().keys()].join('\n'),
  ]

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
