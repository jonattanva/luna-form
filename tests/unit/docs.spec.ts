import { describe, expect, test } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import {
  CHECKBOX,
  CHIPS,
  CHIPS_DAYS,
  CHIPS_MONTHS,
  COLUMN,
  INPUTS,
  LIST,
  RADIO,
  SELECTS,
  TEXTAREA,
} from '@/packages/luna-core/src/util/constant'

/**
 * Keeps the shipped documentation honest about what the library does.
 *
 * These pages travel inside the published package, so a consumer reads them as
 * a description of the build they installed. That only holds while something
 * checks it: an audit by hand found a type documented that did not exist, a
 * behaviour documented backwards, and a constant with no implementation that
 * looked exactly like an undocumented feature. All three were invisible to
 * every other check in this repository.
 *
 * The type list is assembled from the library's own groups rather than copied,
 * so a variant added to `INPUTS` or `SELECTS` tomorrow is covered the day it
 * lands. A whole new family still needs a line here, which is deliberate: that
 * is a decision worth making on purpose.
 */
const PACKAGE = 'packages/luna-react'
const DOCS = join(PACKAGE, 'docs')

const RENDERABLE = [
  ...INPUTS,
  ...SELECTS,
  CHIPS,
  CHIPS_DAYS,
  CHIPS_MONTHS,
  RADIO,
  CHECKBOX,
  TEXTAREA,
  LIST,
  COLUMN,
]

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      return markdownFiles(path)
    }
    return entry.name.endsWith('.md') ? [path] : []
  })
}

const pages = markdownFiles(DOCS)
const corpus = pages.map((file) => readFileSync(file, 'utf-8')).join('\n')

describe('shipped documentation', () => {
  test('travels inside the published package', () => {
    const manifest: { files?: string[] } = JSON.parse(
      readFileSync(join(PACKAGE, 'package.json'), 'utf-8')
    )

    // Without this the pages exist and reach nobody, which is the state this
    // whole effort started from.
    expect(manifest.files).toContain('docs')
    expect(existsSync(join(DOCS, 'index.md'))).toBe(true)
  })

  test('names every field type the library renders', () => {
    const undocumented = RENDERABLE.filter(
      (type) => !corpus.includes(`\`${type}\``)
    )

    expect(undocumented).toEqual([])
  })

  test('cites no field type the library does not have', () => {
    // The reverse direction, and the one that catches a page describing
    // something that was renamed, never built, or belongs to a consumer.
    const known = new Set<string>(RENDERABLE)
    const cited = [...corpus.matchAll(/"type":\s*"([a-z][a-z0-9/-]*)"/g)].map(
      (match) => match[1]
    )

    const invented = [...new Set(cited)].filter((type) => !known.has(type))

    expect(invented).toEqual([])
  })

  test('links only to pages that exist', () => {
    const broken: string[] = []

    for (const page of pages) {
      const links = readFileSync(page, 'utf-8').matchAll(
        /\]\(([^)#]+\.md)(?:#[^)]*)?\)/g
      )
      for (const [, target] of links) {
        if (!existsSync(resolve(dirname(page), target))) {
          broken.push(`${page} -> ${target}`)
        }
      }
    }

    expect(broken).toEqual([])
  })
})
