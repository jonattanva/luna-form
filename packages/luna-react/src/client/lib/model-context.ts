import { logger } from '@luna-form/core'
import type { Tool } from './agent-tools'

/**
 * The part of WebMCP's `document.modelContext` the form uses: a tool is
 * registered with a signal, and aborting the signal unregisters it. Declared
 * here, from the specification's IDL, because `lib.dom` does not have it yet;
 * if the API changes, this is the one place that follows it.
 *
 * Not added to the global `Document`, so it cannot clash with a declaration
 * the host or a later `lib.dom` makes.
 */
export type ModelContext = Readonly<{
  registerTool: (
    tool: Tool,
    options?: Readonly<{ signal?: AbortSignal }>
  ) => Promise<void> | void
}>

/** The page's `document.modelContext`, where the browser offers one. */
export function getModelContext(): ModelContext | undefined {
  if (typeof document === 'undefined' || !('modelContext' in document)) {
    return undefined
  }
  return (document as Document & { modelContext?: ModelContext }).modelContext
}

/**
 * Registers each tool with WebMCP until `signal` is aborted, where the browser
 * has it; without it, nothing. A page that turned tools off
 * (`NotAllowedError`) and a signal aborted before the tools were in
 * (`AbortError`) are no fault of the page; anything else is reported, and the
 * page goes on without that tool.
 */
export function registerTools(tools: readonly Tool[], signal: AbortSignal) {
  const modelContext = getModelContext()
  if (!modelContext) {
    return
  }
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
