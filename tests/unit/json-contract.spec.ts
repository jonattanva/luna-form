import { describe, expect, test } from 'vitest'
import path from 'node:path'
import ts from 'typescript'

// A host imports its form definitions as JSON files, and TypeScript infers
// their types with every literal widened: `"agent": false` is `boolean`. These
// compile what such a host writes, with the options it compiles with, so a
// contract key the inferred type cannot be assigned to fails here.
const root = path.resolve(import.meta.dirname, '../..')
const entry = path.join(root, 'tests/unit/fixtures/json-contract.ts')

function diagnosticsOf(fixture: string) {
  const source = [
    `import type { Sections } from '../../../packages/luna-core/src/type'`,
    `import form from './${fixture}'`,
    `export const sections: Sections = form`,
  ].join('\n')

  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2020,
    types: [],
  }

  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile
  host.getSourceFile = (fileName, version, ...rest) =>
    fileName === entry
      ? ts.createSourceFile(fileName, source, version)
      : getSourceFile(fileName, version, ...rest)

  const program = ts.createProgram([entry], options, host)
  return ts
    .getPreEmitDiagnostics(program)
    .map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    )
}

describe('A form imported from JSON', () => {
  test('types without a cast when a field and a list say "agent": false', () => {
    expect(diagnosticsOf('agent-false.json')).toEqual([])
  })
})
