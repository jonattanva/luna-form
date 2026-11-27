'use client'

import { useLayoutEffect, useRef } from 'react'

/**
 * A text field drawn as an editable `div`: a control with no `name` in the
 * page, as a rich editor is. The form knows its value from `onChange` alone,
 * and finds its field by nothing this component renders.
 */
export function Expression({
  'aria-errormessage': errorMessage,
  'aria-invalid': invalid,
  'aria-labelledby': labelledBy,
  disabled,
  id,
  onBlur,
  onChange,
  value = '',
}: {
  'aria-errormessage'?: string
  'aria-invalid'?: boolean
  'aria-labelledby'?: string
  disabled?: boolean
  id?: string
  onBlur?: () => void
  onChange?: (event: { target: { value: string } }) => void
  value?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Written in when it comes from elsewhere, so the caret of what the person
  // types is left where it is.
  useLayoutEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value])

  return (
    <div
      ref={ref}
      aria-errormessage={errorMessage}
      aria-invalid={invalid}
      aria-labelledby={labelledBy}
      aria-multiline="false"
      className="border-input min-h-9 w-full rounded-md border px-3 py-1.5 text-sm"
      contentEditable={!disabled}
      id={id}
      onBlur={onBlur}
      onInput={(event) =>
        onChange?.({ target: { value: event.currentTarget.textContent ?? '' } })
      }
      role="textbox"
      suppressContentEditableWarning
      tabIndex={disabled ? -1 : 0}
    />
  )
}
