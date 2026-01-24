import { createAtomStore } from './store-helper'

const store = createAtomStore<unknown>()

export const valueAtom = store.atom
export const clearAllValueAtom = store.clearAll
export const clearInputValueAtom = store.clear
export const reportValueAtom = store.report
