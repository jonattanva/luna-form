import { atom } from 'jotai'
import { createNestedClearAtom } from './store-helper'
import { mergeSource, type DataSource } from '@luna-form/core'

const merge = (values: DataSource[]) => {
  const merged = mergeSource(values)
  if (merged) {
    return merged
  }
  return undefined
}

const validate = (target: string) => target.trim() !== ''

export const sourceAtom = atom<Record<string, Record<string, DataSource>>>({})

// What a field writing a source into another field's entry needs, held here
// beside the record rather than passed at every call: the identities have to
// stay put, or the atom a component makes of them would not.
export const SOURCE_OPTIONS = {
  merge,
  validateTarget: validate,
} as const

export const clearInputSourceAtom = createNestedClearAtom(sourceAtom)
