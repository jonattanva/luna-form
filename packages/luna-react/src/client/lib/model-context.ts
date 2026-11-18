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
