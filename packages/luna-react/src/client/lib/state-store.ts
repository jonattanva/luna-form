import { createAtomStore } from './store-helper'
import type { FieldState } from '@luna-form/core'

const store = createAtomStore<FieldState>()

export const fieldStateAtom = store.atom
export const reportFieldStateAtom = store.report
