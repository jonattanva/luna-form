import { atom } from 'jotai'
import {
  createBulkReportAtom,
  createClearAtom,
  createRecordAtomFamily,
} from './store-helper'

export const inputErrorAtom = atom<Record<string, string[]>>({})

export const clearInputErrorAtom = createClearAtom(inputErrorAtom)
export const reportErrorAtom = createBulkReportAtom(inputErrorAtom)
export const reportInputErrorAtom = createRecordAtomFamily(inputErrorAtom)
