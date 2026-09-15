import { KeepValueContext } from '../client/context/keep-value-context'
import { RevealContext } from '../client/context/reveal-context'
import { use, useCallback } from 'react'

// Hides what it holds without taking it out of the form.
//
// Collapsing is a change of view and nothing else: the fields inside keep their
// values, still validate and are still submitted. All three rest on those
// fields staying mounted -- a field's effect is what registers it for the
// submit -- so the content is hidden with the `hidden` attribute.
// `<Activity mode="hidden">` keeps the state and the DOM but tears the effects
// down, and every field inside would drop out of the submit with them.
//
// What is inside asks to be seen through `RevealContext`: this one opens, with
// `onReveal`, and passes the request on to the container around it.
export function Collapsible({
  children,
  onReveal,
  visible,
}: Readonly<{
  children: React.ReactNode
  onReveal?: () => void
  visible?: boolean
}>) {
  const revealAround = use(RevealContext)

  // As steady as `onReveal`, which is its owner's to keep steady: a new
  // function here would render again everything inside that reads it.
  const reveal = useCallback(() => {
    onReveal?.()
    revealAround()
  }, [onReveal, revealAround])

  return (
    <div data-slot="collapsible-content" hidden={!visible}>
      <RevealContext value={reveal}>
        <KeepValueContext value={true}>{children}</KeepValueContext>
      </RevealContext>
    </div>
  )
}
