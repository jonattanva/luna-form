'use client'

import config from '@/luna.config'
import { codeAtom } from '@/lib/store'
import { readReference } from '@/app/reference'
import { registerTools } from 'react-luna-form'
import { useEffect } from 'react'
import { useStore } from 'jotai'
import type { Tool, ToolJson, ToolResult } from 'react-luna-form'
import type { ToolSchema } from 'react-luna-form/schema'

type Store = ReturnType<typeof useStore>

const ANSWER: ToolSchema = { type: 'object' }

const NO_INPUT: ToolSchema = { properties: {}, type: 'object' }

const FORM: ToolSchema = {
  properties: {
    definition: {
      description: 'What a `$ref` in the sections points at.',
      type: 'object',
    },
    sections: {
      description: 'The sections of the form, each with its fields.',
      items: { type: 'object' },
      type: 'array',
    },
  },
  required: ['sections'],
  type: 'object',
}

const PAGE: ToolSchema = {
  properties: {
    page: {
      description:
        'The path of a page, such as `fields/select.md`. Left out, the index, which says which page covers what.',
      type: 'string',
    },
  },
  type: 'object',
}

// What `get_definition` reads: the object the editor holds, or the text
// when it holds something else.
function readCode(code: string): ToolResult {
  try {
    const parsed: ToolJson = JSON.parse(code)
    if (isRecord(parsed)) {
      return { definition: parsed, ok: true }
    }
  } catch {
    // Told below, with what the editor holds.
  }
  return {
    code: 'invalid',
    message: 'The editor does not hold a JSON object.',
    ok: false,
    text: code,
  }
}

function isRecord(
  input: ToolJson
): input is { readonly [key: string]: ToolJson } {
  return input !== null && typeof input === 'object' && !Array.isArray(input)
}

function createTools(store: Store): Tool[] {
  const types = Object.keys(config.inputs)

  return [
    {
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      description:
        'Reads the JSON of the form the luna editor holds, the one its preview renders. Answers it as `definition`, or as `text` with `ok` false when the editor holds no JSON object.',
      execute: async () => readCode(store.get(codeAtom)),
      inputSchema: NO_INPUT,
      name: 'get_definition',
      outputSchema: ANSWER,
      title: 'Read the form',
    },
    {
      annotations: {},
      description:
        'Replaces the form the luna editor holds with this JSON, which its preview renders. Read the contract with get_reference first. A form with problems is not applied: `ok` is false and `problems` says what and where. Once applied, the preview offers its own tools, preview_fill and preview_read, to try it.',
      execute: async (input): Promise<ToolResult> => {
        if (!isRecord(input)) {
          return {
            code: 'invalid',
            message: 'Expected the form as a JSON object.',
            ok: false,
          }
        }
        // Loaded when an agent first writes a form, not with the page.
        const { checkDefinition } = await import('react-luna-form/schema')
        const problems = checkDefinition(input, types)
        if (problems.length > 0) {
          return {
            code: 'invalid',
            message: 'The form was not applied.',
            ok: false,
            problems,
          }
        }
        store.set(codeAtom, JSON.stringify(input, null, 2))
        return { ok: true }
      },
      inputSchema: FORM,
      name: 'set_definition',
      outputSchema: ANSWER,
      title: 'Replace the form',
    },
    {
      annotations: { readOnlyHint: true },
      description:
        'Reads a page of the reference for the form JSON: fields, sections, validation, events. Start with the index, which says which page covers what.',
      execute: async (input): Promise<ToolResult> => {
        const page =
          isRecord(input) && typeof input.page === 'string'
            ? input.page
            : 'index.md'
        const reference = await readReference(page).catch(() => null)
        if (!reference) {
          return {
            code: 'unavailable',
            message: 'The reference could not be read.',
            ok: false,
          }
        }
        if ('pages' in reference) {
          return {
            code: 'unknown',
            message: `No page "${page}".`,
            ok: false,
            pages: reference.pages,
          }
        }
        return { ...reference, ok: true }
      },
      inputSchema: PAGE,
      name: 'get_reference',
      outputSchema: ANSWER,
      title: 'Read the reference',
    },
  ]
}

/**
 * Offers an agent the editor itself through WebMCP, where the browser has it:
 * reading the form, replacing it, and reading the reference to write one.
 */
export function AuthoringTools() {
  const store = useStore()

  useEffect(() => {
    const controller = new AbortController()
    registerTools(createTools(store), controller.signal)
    return () => controller.abort()
  }, [store])

  return null
}
