import { createContext } from 'react'

// How something inside a collapsed container asks to be seen. Calling it opens
// the nearest `Collapsible` and every one around it: a row inside a section
// opens along with the section. Outside any container there is nothing to open,
// and it does nothing.
//
// A context rather than an event on the DOM, so that what decides to open is
// the form's own state -- a field holding an error -- and not an attribute that
// a host's component may or may not put on the page. See `FieldError`.
export const RevealContext = createContext<() => void>(() => {})
