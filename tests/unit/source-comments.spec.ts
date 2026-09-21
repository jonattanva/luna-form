import { describe, expect, test } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Keeps the comments in `src` pointing at something a reader can open.
 *
 * This codebase explains itself in prose, which is worth more than most and
 * costs more when it goes stale: a comment that sends you to the wrong place
 * is worse than no comment, because you go. An audit by hand found three, and
 * nothing else in this repository could have found them -- the compiler does
 * not read comments, and neither does the linter.
 *
 * `docs.spec.ts` does this for the pages that ship inside the package. These
 * are the other half: not written for whoever installs the library, but for
 * whoever changes it next.
 */
const SOURCES = ['packages/luna-core/src', 'packages/luna-react/src']

/**
 * Names that look like a module and are not one. An export condition is the
 * only kind so far: React resolves `react-server` to pick an entry point, and
 * a comment explaining that has to be able to say so.
 */
const NOT_A_MODULE = new Set(['react-server'])

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      return sourceFiles(path)
    }
    return /\.tsx?$/.test(entry.name) ? [path] : []
  })
}

const files = SOURCES.flatMap(sourceFiles)
const moduleNames = new Set(
  files.map((path) => path.split('/').pop()!.replace(/\.tsx?$/, ''))
)

function isComment(line: string): boolean {
  const text = line.trim()
  return text.startsWith('//') || text.startsWith('*') || text.startsWith('/*')
}

describe('comments in src', () => {
  test('cite a symbol rather than a line number', () => {
    // A line number is right until the next edit above it, and nothing says
    // when it stops being right. `use-field-list` pointed at what were once
    // the lines holding a ref and are now `useInput`, a placeholder and
    // `getField`.
    const cited: string[] = []

    for (const path of files) {
      readFileSync(path, 'utf-8')
        .split('\n')
        .forEach((line, index) => {
          if (isComment(line) && /\.(ts|tsx|mjs|js):\d+/.test(line)) {
            cited.push(`${path}:${index + 1}`)
          }
        })
    }

    expect(cited).toEqual([])
  })

  test('name only modules this package actually has', () => {
    // A name resolved against the demo application, which a consumer reading
    // the installed library has no copy of, and which is free to be deleted
    // without anything here noticing.
    const missing: string[] = []

    for (const path of files) {
      readFileSync(path, 'utf-8')
        .split('\n')
        .forEach((line, index) => {
          if (!isComment(line)) {
            return
          }

          for (const [, name] of line.matchAll(
            /`([a-z][a-z0-9]*(?:-[a-z0-9]+)+)`/g
          )) {
            if (!moduleNames.has(name) && !NOT_A_MODULE.has(name)) {
              missing.push(`${path}:${index + 1} -> ${name}`)
            }
          }
        })
    }

    expect(missing).toEqual([])
  })

  test('leave no JSDoc block documenting the block below it', () => {
    // Two JSDoc blocks in a row: the second is what the editor shows for the
    // declaration, and the first documents nothing and is shown nowhere. It
    // reads as documented code in the file and as undocumented code
    // everywhere else, which is how one of these survived a rewrite of the
    // symbol it described.
    const orphaned: string[] = []

    for (const path of files) {
      const lines = readFileSync(path, 'utf-8').split('\n')

      lines.forEach((line, index) => {
        const next = lines[index + 1]
        if (line.trim() === '*/' && next?.trim().startsWith('/**')) {
          orphaned.push(`${path}:${index + 1}`)
        }
      })
    }

    expect(orphaned).toEqual([])
  })
})
