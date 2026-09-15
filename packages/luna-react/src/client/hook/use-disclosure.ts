import { useCallback, useState } from 'react'

// The open state of something that collapses -- an advanced section, a list
// row, the help text of a description -- and the two ways it changes: the user
// toggles it, and something inside asks to be seen. Both callbacks keep one
// identity for the life of the component, so `Collapsible` can hand `reveal` on
// through a context without each owner having to remember to memoize it.
export function useDisclosure(initialOpen: boolean | (() => boolean) = false) {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen)

  const toggle = useCallback(() => setIsOpen((previous) => !previous), [])
  const reveal = useCallback(() => setIsOpen(true), [])

  return [isOpen, toggle, reveal] as const
}
