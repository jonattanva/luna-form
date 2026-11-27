'use client'

import config from '@/luna.config'
import { Button } from '../../components/ui/button'
import { Code } from '../../components/ui/code'
import {
  Form,
  callTool,
  listTools,
  withDeclaredFields,
  type AgentOptions,
  type ValueChange,
} from 'react-luna-form'
import { action } from '@/app/action'
import { useDefinition } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { useEffect, useMemo, useState } from 'react'

declare global {
  interface Window {
    // What a test asks before the preview's tools fill or submit it, and
    // what it is told of each call they answered.
    __lunaAllow?: AgentOptions['allow']
    __lunaOnCall?: AgentOptions['onCall']
    // Sets the shape of what the preview's action returns and nothing else:
    // the definition, and the sections the form is handed, keep their
    // identity.
    __lunaOutput?: (output: AgentOptions['output']) => void
    // Retitles the preview's tools and nothing else: the definition, and the
    // sections the form is handed, keep their identity.
    __lunaRetitle?: (title: string) => void
    __lunaTools?: Readonly<{ call: typeof callTool; list: typeof listTools }>
  }
}

// The preview offered to an agent, submit included: the action only echoes
// what it receives.
const AGENT: AgentOptions = {
  description:
    'The form in the luna editor preview. Filling and submitting it changes nothing outside this page.',
  name: 'preview',
  submit: true,
}

// The actions `host.fail` swaps in. See `ReactiveFormPreview`.
async function refusing() {
  return {
    data: null,
    error: { title: 'The host did not accept the form.' },
    success: false,
  }
}

async function throwing(): Promise<never> {
  throw new Error('The host could not be reached.')
}

type Container = Record<string, unknown> | unknown[]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function childOf(container: Container, key: string): unknown {
  return Array.isArray(container) ? container[Number(key)] : container[key]
}

function setChild(container: Container, key: string, value: unknown): void {
  if (Array.isArray(container)) {
    container[Number(key)] = value
  } else {
    container[key] = value
  }
}

// How a host that keeps the shape the form declares writes one report: `items`
// an array of row objects, `items.0.label` a route into it rather than a key of
// its own. A field reported empty loses its key, the way a store that only
// holds what was written behaves, and a clear aimed at a row that is gone
// builds nothing.
function writeNested(
  record: Record<string, unknown>,
  name: string,
  value: unknown
): Record<string, unknown> {
  const keys = name.split('.')
  const root: Record<string, unknown> = { ...record }
  let parent: Container = root

  for (let i = 0; i < keys.length - 1; i++) {
    const current = childOf(parent, keys[i])
    let next: Container
    if (Array.isArray(current)) {
      next = [...current]
    } else if (isRecord(current)) {
      next = { ...current }
    } else if (value === undefined) {
      return record
    } else {
      next = /^\d+$/.test(keys[i + 1]) ? [] : {}
    }
    setChild(parent, keys[i], next)
    parent = next
  }

  const last = keys[keys.length - 1]
  if (value !== undefined) {
    setChild(parent, last, value)
  } else if (Array.isArray(parent)) {
    parent.splice(Number(last), 1)
  } else {
    delete parent[last]
  }
  return root
}

export function ReactiveFormPreview() {
  const { code, read } = useDefinition()

  const [result, setResult] = useState<{
    message: string
    form: Record<string, unknown>
  } | null>(null)

  // Memoized because the identity of what comes out of here is the identity
  // the form hands every field, and `useInput` memoizes each field's Zod
  // schema on it. Re-parsing on every render -- and `handleValueChange` sets
  // state on every keystroke -- rebuilt every schema on every keystroke.
  const form = useMemo(() => convertCodeToForm(code), [code])

  // `env` and `style` live on the config, not on the form, so a definition
  // alone cannot reach them. The harness lifts them out of the injected JSON to
  // let a test set one -- `env` holds the values a label can interpolate and
  // `style` is the form-wide layout default, and nothing else here can vary
  // either. `host.validateOnSubmit: false` turns the submit's parse off, for a
  // host whose action reads the raw `FormData` itself.
  //
  // Memoized like `form`, and for the same reason: every field is memoized on
  // the config it is handed, so a new one on each keystroke -- this page sets
  // state on every one -- rendered every field of a form that declares either.
  const unchecked = form.host?.validateOnSubmit === false
  const formConfig = useMemo(
    () =>
      form.env || form.style || unchecked
        ? {
            ...config,
            ...(form.env ? { env: form.env } : {}),
            ...(form.style ? { style: form.style } : {}),
            ...(unchecked
              ? { validation: { ...config.validation, submit: false } }
              : {}),
          }
        : config,
    [form.env, form.style, unchecked]
  )

  const [values, setValues] = useState<Record<string, unknown>>(
    () => (form.value as Record<string, unknown>) ?? {}
  )

  const [prevCode, setPrevCode] = useState(code)
  if (code !== prevCode) {
    setPrevCode(code)
    setValues((form.value as Record<string, unknown>) ?? {})
  }

  // The page keeps every report under its own name, a flat record. A test that
  // needs the other kind of host says so in the injected JSON: `host.nested`
  // keeps the declared shape (see `writeNested`), `host.declared` hands the
  // form that record through `withDeclaredFields`, as such a host is told to,
  // and `host.clearOnSuccess` empties it after a successful submit, as a host
  // that wants the form to start blank does. `host.fail` stands in for a host
  // whose action does not accept what it is sent: `"answer"` answers a failure
  // and `"throw"` throws.
  const { agent: offered, host, ...formProps } = form

  // A host whose form edits whichever item is open, as a settings panel does
  // for the item selected: `host.items` holds each item's values by its id,
  // and opening one hands the form its values in place of the ones it had,
  // and names it to the agent as the item the form edits. `host.remount`
  // draws the form anew for each item instead, as a host keying it does.
  const items = isRecord(host?.items) ? host.items : {}
  const [opened, setOpened] = useState<string>()
  function handleOpen(id: string) {
    const item = items[id]
    setOpened(id)
    setValues(isRecord(item) ? item : {})
  }

  // A title set through `window.__lunaRetitle`, over the injected one.
  const [retitled, setRetitled] = useState<string>()
  useEffect(() => {
    window.__lunaRetitle = setRetitled
    return () => {
      if (window.__lunaRetitle === setRetitled) {
        delete window.__lunaRetitle
      }
    }
  }, [])

  // The shape of what the action returns, set through `window.__lunaOutput`.
  const [output, setOutput] = useState<AgentOptions['output']>()
  useEffect(() => {
    window.__lunaOutput = setOutput
    return () => {
      if (window.__lunaOutput === setOutput) {
        delete window.__lunaOutput
      }
    }
  }, [])

  // How the preview is offered to an agent. A test changes its name,
  // description, submit, target or title in the injected JSON, the title
  // alone through `window.__lunaRetitle`, or the shape of what its action
  // returns through `window.__lunaOutput`, or offers none with
  // `"agent": false`, decides what `allow` answers through
  // `window.__lunaAllow`, and hears of each call through `window.__lunaOnCall`.
  const agent = useMemo<AgentOptions>(
    () => ({
      ...AGENT,
      ...(isRecord(offered) && {
        ...(typeof offered.name === 'string' && { name: offered.name }),
        ...(typeof offered.description === 'string' && {
          description: offered.description,
        }),
        ...(typeof offered.submit === 'boolean' && { submit: offered.submit }),
        ...(typeof offered.target === 'string' && {
          target: offered.target,
        }),
        ...(typeof offered.title === 'string' && { title: offered.title }),
      }),
      ...(opened !== undefined && { target: opened }),
      ...(retitled !== undefined && { title: retitled }),
      ...(output && { output }),
      allow: (call, options) =>
        window.__lunaAllow ? window.__lunaAllow(call, options) : true,
      onCall: (call) => window.__lunaOnCall?.(call),
    }),
    [offered, opened, output, retitled]
  )
  const nested = host?.nested === true
  const declared = host?.declared === true
  const clearOnSuccess = host?.clearOnSuccess === true

  const formAction =
    host?.fail === 'throw'
      ? throwing
      : host?.fail === 'answer'
        ? refusing
        : action

  const formValue = useMemo(
    () =>
      declared
        ? withDeclaredFields(form.sections ?? [], values, form.definition)
        : values,
    [declared, form.definition, form.sections, values]
  )

  // An agent reaches the form through WebMCP when the browser has it, and
  // through `window.__lunaTools` when it drives the page instead -- an
  // end-to-end test among them.
  useEffect(() => {
    const tools = { call: callTool, list: listTools }
    window.__lunaTools = tools
    return () => {
      if (window.__lunaTools === tools) {
        delete window.__lunaTools
      }
    }
  }, [])

  function handleValueChange(input: ValueChange) {
    console.log('Form values changed:', input)
    setValues((prev) =>
      nested
        ? writeNested(prev, input.name, input.value)
        : { ...prev, [input.name]: input.value }
    )
  }

  // A host putting its own state back the way it was, which is the one thing
  // this page could not do before: everything else here only ever adds to
  // `values`. What the form does with a value that lost a field is only
  // observable from the outside, so it needs someone outside to lose one.
  function handleReset() {
    setValues((form.value as Record<string, unknown>) ?? {})
  }

  function handleSuccess(response: {
    message: string
    form: Record<string, unknown>
  }) {
    setResult(response)
    if (clearOnSuccess) {
      setValues({})
    }
  }

  return (
    <div className="w-full max-w-md p-6">
      {result && (
        <div className="mb-4">
          <p>{result.message}</p>
          <Code response={result.form} />
        </div>
      )}
      {read && (
        <Form
          key={host?.remount === true ? opened : undefined}
          {...formProps}
          value={formValue}
          config={formConfig}
          action={formAction}
          agent={offered === false ? undefined : agent}
          onSuccess={handleSuccess}
          onValueChange={handleValueChange}
        >
          {({ isPending }) => (
            <div className="flex w-full justify-end gap-2">
              {Object.keys(items).map((id) => (
                <Button
                  key={id}
                  type="button"
                  variant="outline"
                  onClick={() => handleOpen(id)}
                >
                  {`Open ${id}`}
                </Button>
              ))}
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset values
              </Button>
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </div>
          )}
        </Form>
      )}
    </div>
  )
}
