import { keepsValue, type Field, type List } from '@luna-form/core'
import { createContext, use } from 'react'

export const KeepValueContext = createContext<boolean>(false)

// Whether a field leaves its value behind when it goes: what it inherits from
// a container that keeps the values inside it, or its own `keepValue`. The
// declaration ADDS to what is inherited, never replaces it, so a field inside
// a collapsible stays kept whatever it says.
//
// The one reading of the rule. A field's value and a list's rows have to agree
// on it: rows held for values that were dropped would come back empty, and
// values kept without their rows would not come back at all.
export function useKeepsValue(slot: Field | List): boolean {
  return use(KeepValueContext) || keepsValue(slot)
}
