import { atom } from 'jotai'
import { mergeSource, type DataSource } from '@luna-form/core'
import {
  createNestedClearAtom,
  createNestedRecordAtomFamily,
} from './store-helper'

export const sourceAtom = atom<Record<string, Record<string, DataSource>>>({})

export const reportSourceAtom = createNestedRecordAtomFamily<DataSource>(
  sourceAtom,
  {
    merge: (values) => {
      const merged = mergeSource(values)
      if (merged) {
        return merged
      }
    },
    validateTarget: (target) => target.trim() !== '',
  }
)

export const clearInputSourceAtom = createNestedClearAtom(sourceAtom)
