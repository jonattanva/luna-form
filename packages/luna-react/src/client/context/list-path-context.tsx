import { createContext } from 'react'

export type TranslateListPath = (name: string) => string

// Module-level constant so the default context value keeps a stable identity:
// inputs outside any list subscribe to a value that never changes and therefore
// never re-render because of this context.
const identity: TranslateListPath = (name) => name

export const ListPathContext = createContext<TranslateListPath>(identity)
