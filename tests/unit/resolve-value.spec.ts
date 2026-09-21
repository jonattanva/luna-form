import { describe, expect, test } from 'vitest'
import { extract, resolveEntry } from '@/packages/luna-core/src/util/extract'
import { resolveValue } from '@/packages/luna-react/src/client/lib/resolve-value'

// `found` is the half `resolveValue` cannot express. Both a path nobody
// mentioned and a path holding an empty value read back as `undefined`, and
// `useValue` has to treat them differently: the first leaves the field alone,
// the second empties it.
describe('resolve value', () => {
  test('should read a top-level key', () => {
    expect(resolveEntry('label', { label: 'Send invoice' })).toEqual({
      found: true,
      value: 'Send invoice',
    })
  })

  test('should not find a key that is not there', () => {
    expect(resolveEntry('description', { label: 'Send invoice' })).toEqual({
      found: false,
      value: undefined,
    })
  })

  // `in` is true for what an object inherits, so a field named `toString` or
  // `__proto__` read as one the host names, and `useValue` took an internal for
  // its value. Only what the tree owns is data.
  test('should not find a member the value tree only inherits', () => {
    expect(resolveEntry('toString', { label: 'Send invoice' })).toEqual({
      found: false,
      value: undefined,
    })

    expect(resolveEntry('__proto__', { label: 'Send invoice' })).toEqual({
      found: false,
      value: undefined,
    })
  })

  test('should find a key held as undefined', () => {
    expect(resolveEntry('description', { description: undefined })).toEqual({
      found: true,
      value: undefined,
    })
  })

  test('should find a key held as an empty string', () => {
    expect(resolveEntry('description', { description: '' })).toEqual({
      found: true,
      value: '',
    })
  })

  test('should find a key held as null', () => {
    expect(resolveEntry('description', { description: null })).toEqual({
      found: true,
      value: null,
    })
  })

  test('should walk a dotted path', () => {
    expect(resolveEntry('auth.token', { auth: { token: 'x' } })).toEqual({
      found: true,
      value: 'x',
    })
  })

  test('should find a leaf a dotted path holds as empty', () => {
    expect(resolveEntry('auth.token', { auth: { token: '' } })).toEqual({
      found: true,
      value: '',
    })
  })

  test('should not find a leaf whose branch is missing', () => {
    expect(resolveEntry('auth.token', { auth: {} })).toEqual({
      found: false,
      value: undefined,
    })
  })

  test('should not find a leaf whose parent is not there', () => {
    expect(resolveEntry('auth.token', {})).toEqual({
      found: false,
      value: undefined,
    })
  })

  test('should not walk past a value that is not a container', () => {
    expect(resolveEntry('auth.token', { auth: 'bearer' })).toEqual({
      found: false,
      value: undefined,
    })
  })

  test('should index into an array', () => {
    expect(
      resolveEntry('rules.1.field', { rules: [{}, { field: 'x' }] })
    ).toEqual({ found: true, value: 'x' })
  })

  test('should not find a position the array does not have', () => {
    expect(resolveEntry('rules.2.field', { rules: [{}] })).toEqual({
      found: false,
      value: undefined,
    })
  })

  test('should not index an array with a segment that is not a number', () => {
    expect(resolveEntry('rules.first', { rules: [{ field: 'x' }] })).toEqual({
      found: false,
      value: undefined,
    })
  })

  // A flat key wins over the path it spells out, so a caller keeping values
  // under the emitted names is read the way it wrote them.
  test('should prefer a literal dotted key over the path it describes', () => {
    expect(
      resolveEntry('auth.token', {
        'auth.token': 'flat',
        auth: { token: 'nested' },
      })
    ).toEqual({ found: true, value: 'flat' })
  })

  test('should read an array passed as the root', () => {
    expect(resolveEntry('0.field', [{ field: 'x' }])).toEqual({
      found: true,
      value: 'x',
    })
  })

  test('should not read a bare name off an array root', () => {
    expect(resolveEntry('field', [{ field: 'x' }])).toEqual({
      found: false,
      value: undefined,
    })
  })

  test('should return the value alone', () => {
    expect(resolveValue('auth.token', { auth: { token: 'x' } })).toBe('x')
  })

  test('should return undefined for a path that is not there', () => {
    expect(resolveValue('auth.token', { auth: {} })).toBeUndefined()
  })
})

// Two walks, one per package, disagreed about the first step: a flat key that
// is literally the path. Whether a list named `config.items` was found came
// down to which reader the caller happened to use. Each row runs through both.
describe('one walk for every reader', () => {
  const cases: Array<[string, Record<string, unknown>, unknown]> = [
    ['a.b', { 'a.b': 1 }, 1],
    ['a.b', { a: { b: 2 } }, 2],
    ['list.1.v', { list: [{ v: 'x' }, { v: 'y' }] }, 'y'],
    ['list.5.v', { list: [{ v: 'x' }] }, undefined],
    ['missing.path', { a: 1 }, undefined],
    ['toString', { a: 1 }, undefined],
    ['a.b', { a: { b: '' } }, ''],
  ]

  test.each(cases)(
    '%s resolves the same way everywhere',
    (path, value, expected) => {
      expect(resolveValue(path, value)).toBe(expected)
      expect(extract(value, path) ?? undefined).toBe(expected)
    }
  )
})
