import {
  DATA_INVALID,
  DATA_READONLY,
  getSpan,
  type Orientation,
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export function FieldGroup(
  props: Readonly<{
    children: React.ReactNode
    cols?: number
    errors?: string[]
    orientation?: Orientation
    disabled?: boolean
  }>
) {
  const errors = props.errors && props.errors.length > 0

  return (
    <div
      {...(errors && { [DATA_INVALID]: 'true' })}
      {...(props.disabled && { [DATA_READONLY]: 'true' })}
      data-slot="field"
      data-orientation={props.orientation}
      className={twMerge(
        'group data-[invalid=true]:text-destructive flex w-full flex-row items-center gap-3',
        "[&[data-orientation='vertical']]:flex-col",
        '[&>*:not([role=checkbox]):not([role=radio])]:w-full',
        'has-[>[data-slot=field-content]]:items-start',
        'has-[>[role=checkbox],[role=radio]]:flex-row-reverse',
        'has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        getSpan(props.cols)
      )}
    >
      {props.children}
    </div>
  )
}
