import { createAtomStore } from './store-helper'

const store = createAtomStore<string[]>()

export const inputErrorAtom = store.atom
export const clearInputErrorAtom = store.clear
export const reportErrorAtom = store.bulkReport
