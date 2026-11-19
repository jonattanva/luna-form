import { FailedSubmitContext } from '../../client/context/failed-submit-context'
import { RevealContext } from '../../client/context/reveal-context'
import { use, useEffect, useRef } from 'react'
import type { Nullable } from '@luna-form/core'

const SLOT = 'field-error'

export function FieldError(
  props: Readonly<{
    errors?: Nullable<string[]>
    name?: string
  }>
) {
  if (!props.errors || props.errors.length === 0) {
    return null
  }

  return <ErrorList errors={props.errors} name={props.name} />
}

// Rendered only while the field has an error, so only a field that has one
// listens for a failed submit.
function ErrorList(
  props: Readonly<{
    errors: string[]
    name?: string
  }>
) {
  const reveal = use(RevealContext)
  const failed = use(FailedSubmitContext)
  const ref = useRef<HTMLUListElement>(null)
  const { name } = props

  // After a failed submit the error has to be on screen, and a collapsed
  // section or row around it would keep it off: ask them to open. Keyed on the
  // submit and not on the errors, so it happens again on the next failed
  // submit, after the user closed what held it, and not while they type.
  //
  // The first error of the form also takes the focus to its field, so a
  // keyboard user is not left on the submit button to look for it.
  useEffect(() => {
    if (!failed) {
      return
    }
    reveal()
    return ref.current && name ? focusFirstError(ref.current, name) : undefined
  }, [failed, name, reveal])

  return (
    <ul
      className="text-sm text-red-600 dark:text-red-500"
      data-slot={SLOT}
      id={name ? `${name}-error` : undefined}
      ref={ref}
    >
      {props.errors.map((error, index) => (
        <li key={name ? `${name}-error-${index}` : index}>{error}</li>
      ))}
    </ul>
  )
}

/**
 * Moves the focus to the field of `list` when `list` is the first error of its
 * form, in the order of the page, as a browser does for its own validation.
 *
 * Every field with an error runs this from the same commit, and only the first
 * one acts, so the form needs no list of its errors. The field is found the way
 * its label finds it, by its `id`, then by the `aria-errormessage` that points
 * at `list`. A component that cannot take the focus itself, such as a group of
 * buttons, hands it to the first control inside that can.
 *
 * A field inside a collapsed section or row cannot take the focus until what
 * holds it opens, which happens in a later commit: the focus waits for it. A
 * focus somewhere else on the page, outside the form, is left where it is, so a
 * submit made by code does not take the person away from what they are doing.
 *
 * Returns what stops the wait.
 */
function focusFirstError(
  list: HTMLElement,
  name: string
): (() => void) | undefined {
  const form = list.closest('form')
  if (!form || form.querySelector(`[data-slot="${SLOT}"]`) !== list) {
    return
  }

  const control = findControl(form, name, list.id)
  if (!control) {
    return
  }

  // Whether there is nothing left to wait for.
  const settle = () => {
    if (!isVisible(control)) {
      return false
    }
    const active = document.activeElement
    if (!active || active === document.body || form.contains(active)) {
      findFocusable(control)?.focus()
    }
    return true
  }

  if (settle()) {
    return
  }

  const observer = new MutationObserver(() => {
    if (settle()) {
      observer.disconnect()
    }
  })
  observer.observe(form, { attributes: true, childList: true, subtree: true })
  return () => observer.disconnect()
}

function findControl(form: HTMLFormElement, name: string, errorId: string) {
  const byId = form.ownerDocument.getElementById(name)
  if (byId && form.contains(byId)) {
    return byId
  }
  return Array.from(
    form.querySelectorAll<HTMLElement>('[aria-errormessage]')
  ).find((element) => element.getAttribute('aria-errormessage') === errorId)
}

function findFocusable(control: HTMLElement): HTMLElement | undefined {
  if (canFocus(control)) {
    return control
  }
  return Array.from(control.querySelectorAll<HTMLElement>('*')).find(canFocus)
}

function canFocus(element: HTMLElement) {
  return (
    element.tabIndex >= 0 && !element.matches(':disabled') && isVisible(element)
  )
}

function isVisible(element: HTMLElement) {
  return element.getClientRects().length > 0
}
