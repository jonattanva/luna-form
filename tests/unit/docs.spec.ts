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

function componentFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      return componentFiles(path)
    }
    return entry.name.endsWith('.tsx') ? [path] : []
  })
}

const sourceText = componentFiles(join(PACKAGE, 'src'))
  .map((file) => readFileSync(file, 'utf-8'))
  .join('\n')

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

/**
 * The `data-slot` list is the published surface a design system restyles
 * against, and the page offers it as the whole scaffolding. A slot the library
 * renders and the list leaves out is a hook nobody knows to reach for, which is
 * indistinguishable from one that does not exist -- `collapsible-content` was
 * exactly that, and `field-content` and `field-set-content` were in one of the
 * two lists and not the other.
 *
 * Read off the markup rather than kept by hand, so a slot added tomorrow is
 * either documented or the build says so.
 */
describe('the slots the documentation offers', () => {
  const FILES = [join(PACKAGE, 'README.md'), join(DOCS, 'setup.md')]

  const rendered = new Set(
    sourceText
      .match(/data-slot="[a-z-]+"/g)
      ?.map((match) => match.slice(11, -1))
  )

  /** The names the `data-slot` sentence offers, between its two dashes. */
  function documented(file: string): Set<string> {
    const prose = readFileSync(file, 'utf-8').replace(/\n/g, ' ')
    const sentence = prose.match(
      /carries a `data-slot` attribute[^—]*—(.*?)—/
    )?.[1]

    return new Set(
      [...(sentence ?? '').matchAll(/`([^`]+)`/g)].map(([, name]) => name)
    )
  }

  test.each(FILES)('%s offers every slot the markup renders', (file) => {
    const listed = documented(file)
    const missing = [...rendered].filter((slot) => !listed.has(slot))

    expect(missing.toSorted()).toEqual([])
  })

  test.each(FILES)('%s offers no slot the markup does not render', (file) => {
    const invented = [...documented(file)].filter((slot) => !rendered.has(slot))

    expect(invented.toSorted()).toEqual([])
  })
})

/**
 * The peer table is the one page a consumer acts on before anything renders,
 * and the only place the library states what it needs. A missing peer surfaces
 * as a module resolution error at import time, which the page says itself -- so
 * a name listed here that the library does not declare is an install the reader
 * performs for nothing, and a version that drifted is one they satisfy wrongly.
 *
 * Both were true: `jotai-family` outlived the atom families by a whole release
 * and `tailwind-merge` moved a minor without either table hearing about it.
 * Read from the manifest rather than compared by eye, so the next bump cannot
 * repeat it.
 */
describe('the peers the documentation asks for', () => {
  const manifest: { peerDependencies: Record<string, string> } = JSON.parse(
    readFileSync(join(PACKAGE, 'package.json'), 'utf-8')
  )

  const TABLES = [join(PACKAGE, 'README.md'), join(DOCS, 'setup.md')]

  /** The rows of the table whose first heading is `Peer`, as `[names, versions]`. */
  function peerRows(file: string): [string[], string[]][] {
    const lines = readFileSync(file, 'utf-8').split('\n')
    const heading = lines.findIndex((line) => /^\|\s*Peer\s*\|/.test(line))

    const rows: [string[], string[]][] = []

    // The heading, then the `| --- |` separator, then the body until the table
    // stops.
    for (let index = heading + 2; lines[index]?.startsWith('|'); index++) {
      const cells = lines[index].split('|').slice(1, -1)
      const backticked = (cell: string) =>
        [...cell.matchAll(/`([^`]+)`/g)].map(([, text]) => text)

      rows.push([backticked(cells[0]), backticked(cells[1])])
    }

    return rows
  }

  test.each(TABLES)('%s names every peer, and only those', (file) => {
    // Sorted on both sides: the table groups packages by what they are for and
    // the manifest is alphabetical, and neither order is the other's business.
    const listed = peerRows(file).flatMap(([names]) => names)

    expect(listed.toSorted()).toEqual(
      Object.keys(manifest.peerDependencies).toSorted()
    )
  })

  test.each(TABLES)(
    '%s states the version each peer is declared at',
    (file) => {
      const wrong: string[] = []

      for (const [names, versions] of peerRows(file)) {
        for (const [index, name] of names.entries()) {
          // One version covers the whole row when a row lists several packages
          // released together, as `react` and `react-dom` are.
          const documented =
            versions.length === 1 ? versions[0] : versions[index]
          const declared = manifest.peerDependencies[name]

          if (documented !== declared) {
            wrong.push(`${name}: reads ${documented}, declared ${declared}`)
          }
        }
      }

      expect(wrong).toEqual([])
    }
  )
})
