import { atom } from 'jotai'
import { mergeSource, type DataSource } from '@luna-form/core'
import {
  createNestedClearAtom,
  createNestedRecordAtomFamily,
} from './store-helper'

const merge = (values: DataSource[]) => {
  const merged = mergeSource(values)
  if (merged) {
    return merged
  }
  return undefined
}

const validate = (target: string) => target.trim() !== ''

const sourceAtom = atom<Record<string, Record<string, DataSource>>>({})

export const reportSourceAtom = createNestedRecordAtomFamily<DataSource>(
  sourceAtom,
  {
    merge,
    validateTarget: validate,
  }
)

export const clearInputSourceAtom = createNestedClearAtom(sourceAtom)
