import { FormContent } from './form-content'
import { Provider, createStore } from 'jotai'
import { resolveDictionary } from '@luna-form/core'
import { useAgentTools, useSubmission } from '../hook/use-agent-tools'
import { hostValueAtom } from '../lib/host-value-store'
import { useApplyRegistry } from '../hook/use-apply'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Config, Control, ValueChange } from '../../type'
import type { Definition, Nullable, Sections, ZodSchema } from '@luna-form/core'
import type { AgentOptions } from '../lib/agent-tools'
import type { FormState } from '../hook/use-form-action'

export function Form<
  T extends Record<string, unknown> = Record<string, unknown>,
  F = Record<string, unknown>,
>(
  props: Readonly<{
    advanced?: {
      step?: boolean
    }
    action?: (formData: F, schema?: ZodSchema) => Promise<FormState<T>>
    /**
     * Offers the form to AI agents as tools: through WebMCP when the browser
     * has it, and through `listTools()` and `callTool()` always. See
     * `docs/agents/tools.md`.
     */
    agent?: AgentOptions
    children?: Control
    config: Config
    context?: Record<string, unknown>
    definition?: Definition
    lang?: string
    onSuccess?: (data: T) => void
    onValueChange?: (input: ValueChange) => void
    readOnly?: boolean
    sections: Sections
    translations?: Record<string, Record<string, string>>
    value?: Nullable<T>
  }>
) {
  // How many times a success has started the form over. Each time is a store
  // of its own and a tree mounted anew, so the form comes back as it opened:
  // every value, every row of every list and whatever change events left,
  // from the definition and from what the host holds through `value`.
  // Clearing only the values left a list with its rows emptied and a field the
  // host held blank.
  const [start, setStart] = useState(() => ({
    generation: 0,
    store: createStore(),
  }))

  // How many times a success asked for it. The new store is made here, in the
  // render that answers, with what the host holds in that render: the fields
  // mount with their entry and report it from their own effects, so the form
  // has its values back by the time it is told it started over (see
  // `useSubmission`). Not in `onReset` itself, which React may run as soon as
  // it is called, before a host that clears its state in `onSuccess` has
  // rendered the cleared `value`.
  const [requested, setRequested] = useState(0)
  if (requested !== start.generation) {
    const next = createStore()
    next.set(hostValueAtom, props.value ?? null)
    setStart({ generation: requested, store: next })
  }
  const { generation, store } = start

  // What outlives a start over, kept here rather than in the content: the
  // `<form>`, the registry of the fields' handles, what the tools record of
  // the submissions, and the tools themselves, which stay registered under
  // their name instead of being taken down and put back after every success.
  const formRef = useRef<HTMLFormElement>(null)
  const [onRegisterApply, getHandles] = useApplyRegistry()
  const submission = useSubmission(formRef)

  // Whether the focus was in the form when it was submitted: a keyboard user
  // who submitted is brought back to its submit button, not to the top of the
  // page. Noted on the submit itself, before the button is disabled while the
  // action runs and the browser moves the focus off it.
  const refocus = useRef(false)
  useEffect(() => {
    const form = formRef.current
    if (!form) {
      return
    }
    const note = () => {
      refocus.current = form.contains(document.activeElement)
    }
    form.addEventListener('submit', note, true)
    return () => form.removeEventListener('submit', note, true)
  }, [generation])

  const onReset = useCallback(() => {
    setRequested((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!refocus.current) {
      return
    }
    refocus.current = false
    formRef.current?.querySelector<HTMLElement>('[type="submit"]')?.focus()
  }, [generation])

  // Merging the built-ins allocates, so it is memoized: the fields' schemas
  // are built on this identity, and a fresh one on every render would rebuild
  // every field's schema on every keystroke.
  const localization = useMemo(
    () => ({
      lang: props.lang,
      translations: resolveDictionary(props.lang, props.translations),
    }),
    [props.lang, props.translations]
  )

  useAgentTools({
    agent: props.agent,
    context: props.context,
    definition: props.definition,
    getHandles,
    localization,
    readOnly: props.readOnly,
    sections: props.sections,
    store,
    submission: props.action ? submission : undefined,
    types: props.config.agentTypes,
    validates: props.config.validation.submit !== false,
  })

  return (
    <Provider key={generation} store={store}>
      <FormContent
        {...props}
        formRef={formRef}
        localization={localization}
        onRegisterApply={onRegisterApply}
        onReset={onReset}
        submission={submission}
      />
    </Provider>
  )
}
