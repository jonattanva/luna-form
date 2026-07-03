import { describe, expect, test } from 'vitest'
import { isEmptySelectChange } from '@/packages/luna-react/src/client/component/input-selectable'
import type { Field } from '@/packages/luna-core/src/type'

describe('isEmptySelectChange', () => {
  test('skips an empty string for a native select field', () => {
    const field = { type: 'select', name: 'document_type' } as Field
    expect(isEmptySelectChange(field, '')).toBe(true)
  })

  test('skips an empty string for a custom select/* field', () => {
    const field = { type: 'select/file-provider', name: 'provider' } as Field
    expect(isEmptySelectChange(field, '')).toBe(true)
  })

  test('keeps a real (non-empty) select value', () => {
    const field = { type: 'select', name: 'document_type' } as Field
    expect(isEmptySelectChange(field, 'dni')).toBe(false)
  })

  test('does not skip empty values for non-select fields', () => {
    const radio = { type: 'radio', name: 'gender' } as Field
    const input = { type: 'input', name: 'title' } as Field
    expect(isEmptySelectChange(radio, '')).toBe(false)
    expect(isEmptySelectChange(input, '')).toBe(false)
  })
})
