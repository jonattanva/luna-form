import { useLayoutEffect, useRef } from 'react'

/**
 * The latest value a commit left, for the code that runs after it: an event
 * handler, an effect, a callback whose identity has to stay steady across
 * renders.
 *
 * Written from a layout effect and not from the render body, which is the whole
 * point. A render is not a promise that anything reached the screen -- React
 * throws one away when a transition is interrupted or a boundary retries -- and
 * a ref assigned while rendering keeps whatever that discarded render held,
 * which is props nobody ever saw. A commit is the moment a value becomes real,
 * so that is when this writes it. It is also what the React Compiler asks of a
 * component before it will optimize it.
 *
 * Layout and not `useEffect`: every effect of a commit runs after every layout
 * effect of that same commit, so an effect reading this ref reads the value of
 * the render it belongs to, whatever order the hooks were declared in.
 *
 * Reading it while rendering is still wrong, and still reported by
 * `react-hooks/refs`: there the value is one commit old. What a render needs is
 * the value itself.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value)

  useLayoutEffect(() => {
    ref.current = value
  })

  return ref
}
