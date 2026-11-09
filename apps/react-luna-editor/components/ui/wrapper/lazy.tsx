'use client'

import { Suspense, use, type ComponentType } from 'react'

/**
 * A component the browser fetches when it is first wanted, for one that only
 * appears once someone asks for it -- a calendar opened, a toast raised -- and
 * that can be asked to fetch ahead of time.
 *
 * Not `next/dynamic`, because of how React reveals what was suspended: content
 * that resolves behind a fallback is held back until 300ms after the fallback
 * appeared (`FALLBACK_THROTTLE_MS`), however fast the code arrived. Whoever
 * shows one of these waits for `preload` instead, and then it renders straight
 * away, with no fallback and nothing to hold back. The boundary is only there
 * for a render that did not wait.
 *
 * Only for what sits outside a form's fields. An input is registered with the
 * form and renders the control its value is submitted through, so one still
 * loading would leave its value out of a submit; the inputs stay in the page.
 */
export function lazyComponent<P extends object>(
  load: () => Promise<ComponentType<P>>
) {
  let Loaded: ComponentType<P> | undefined
  let pending: Promise<ComponentType<P>> | undefined

  function preload() {
    pending ??= load().then((component) => (Loaded = component))
    return pending
  }

  function Resolved(props: P) {
    // Loaded once and kept for the life of the page: every render reaches the
    // same component, so nothing under it is remounted.
    const Component = Loaded ?? use(preload())
    return <Component {...props} />
  }

  function LazyComponent(props: P) {
    return (
      <Suspense fallback={null}>
        <Resolved {...props} />
      </Suspense>
    )
  }

  return Object.assign(LazyComponent, {
    isLoaded: () => Loaded !== undefined,
    preload,
  })
}
