import { atom } from 'jotai'
import {
  createBulkReportAtom,
  createClearAllAtom,
  createClearAtom,
  createRecordAtomFamily,
} from './store-helper'

export const valueAtom = atom<Record<string, unknown>>({})

export const clearAllValueAtom = createClearAllAtom(valueAtom)
export const clearInputValueAtom = createClearAtom(valueAtom)
export const reportBulkValueAtom = createBulkReportAtom(valueAtom)
export const reportValueAtom = createRecordAtomFamily(valueAtom)
