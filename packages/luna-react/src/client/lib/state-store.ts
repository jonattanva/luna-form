import { createAtomStore } from './store-helper'
import type { FieldState } from '@luna-form/core'

const store = createAtomStore<FieldState>()

export const fieldStateAtom = store.atom
export const clearAllFieldStateAtom = store.clearAll
export const clearInputFieldStateAtom = store.clear
export const reportFieldStateAtom = store.report
