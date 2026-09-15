import { KeepValueContext } from '../client/context/keep-value-context'
import { useEffect, useEffectEvent, useRef } from 'react'

// Asks the collapsed containers around an element to open. Dispatched from the
// element itself, it bubbles, so every container on the way up hears it: a row
// inside a section opens along with the section.
export const REVEAL_EVENT = 'luna-form:reveal'

// Hides what it holds without taking it out of the form.
//
// Collapsing is a change of view and nothing else: the fields inside keep their
// values, still validate and are still submitted. All three rest on those
// fields staying mounted -- a field's effect is what registers it for the
// submit -- so the content is hidden with the `hidden` attribute.
// `<Activity mode="hidden">` keeps the state and the DOM but tears the effects
// down, and every field inside would drop out of the submit with them.
//
// Nothing here can tell that something inside has to be seen, so whatever
// knows asks, with `REVEAL_EVENT`, and `onReveal` is where the owner of the
// open state hears it.
export function Collapsible({
  children,
  onReveal,
  visible,
}: Readonly<{
  children: React.ReactNode
  onReveal?: () => void
  visible?: boolean
}>) {
  const ref = useRef<HTMLDivElement>(null)

  const reveal = useEffectEvent(() => {
    onReveal?.()
  })

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const listener = () => reveal()
    node.addEventListener(REVEAL_EVENT, listener)
    return () => {
      node.removeEventListener(REVEAL_EVENT, listener)
    }
  }, [])

  return (
    <div data-slot="collapsible-content" hidden={!visible} ref={ref}>
      <KeepValueContext value={true}>{children}</KeepValueContext>
    </div>
  )
}
