import { FailedSubmitContext } from '../../client/context/failed-submit-context'
import { RevealContext } from '../../client/context/reveal-context'
import { use, useEffect } from 'react'
import type { Nullable } from '@luna-form/core'

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

  // After a failed submit the error has to be on screen, and a collapsed
  // section or row around it would keep it off: ask them to open. Keyed on the
  // submit and not on the errors, so it happens again on the next failed
  // submit, after the user closed what held it, and not while they type.
  useEffect(() => {
    if (failed) {
      reveal()
    }
  }, [failed, reveal])

  return (
    <ul
      className="text-sm text-red-600 dark:text-red-500"
      id={props.name ? `${props.name}-error` : undefined}
    >
      {props.errors.map((error, index) => (
        <li key={props.name ? `${props.name}-error-${index}` : index}>
          {error}
        </li>
      ))}
    </ul>
  )
}
