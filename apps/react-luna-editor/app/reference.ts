'use server'

import { join } from 'node:path'
import { readFile, readdir } from 'node:fs/promises'

// The reference for the form JSON, as it ships inside the installed package:
// it describes the version the editor renders with.
const DOCS = join(process.cwd(), 'node_modules', 'react-luna-form', 'docs')

// Its pages, read once: they do not change while the server runs. A read that
// failed is tried again on the next call.
let listed: Promise<string[]> | null = null

function listPages(): Promise<string[]> {
  listed ??= readdir(DOCS, { recursive: true }).then(
    (files) => files.filter((file) => file.endsWith('.md')).sort(),
    (error: Error) => {
      listed = null
      throw error
    }
  )
  return listed
}

export type Reference =
  | Readonly<{ content: string; page: string }>
  | Readonly<{ pages: readonly string[] }>

/**
 * One page of the reference by its path, such as `fields/select.md`. A path
 * that is no page answers the pages there are, which also keeps a path from
 * reading anything outside them. Rejects when the reference cannot be read.
 */
export async function readReference(page: string): Promise<Reference> {
  const pages = await listPages()
  if (!pages.includes(page)) {
    return { pages }
  }
  return { content: await readFile(join(DOCS, page), 'utf8'), page }
}
