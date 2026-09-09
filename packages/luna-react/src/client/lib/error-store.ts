import { createAtomStore } from './store-helper'

const store = createAtomStore<string[]>()

export const clearInputErrorAtom = store.clear
export const releaseInputErrorAtom = store.release
export const reportErrorAtom = store.bulkReport
export const reportInputErrorAtom = store.report
