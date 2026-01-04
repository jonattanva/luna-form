import {
  DATA_INVALID,
  DATA_READONLY,
  getSpan,
  type Orientation,
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export type FieldBaseProps = Readonly<{
  children: React.ReactNode
  className?: string
  cols?: number
  disabled?: boolean
  errors?: string[]
  orientation: Orientation
}>

export function FieldBase(props: FieldBaseProps) {
  const errors = props.errors && props.errors.length > 0

  return (
    <div
      data-slot="field"
      {...(errors && { [DATA_INVALID]: 'true' })}
      {...(props.disabled && { [DATA_READONLY]: 'true' })}
      data-orientation={props.orientation}
      className={twMerge(
        'group flex w-full flex-col items-center data-[invalid=true]:text-red-600 data-[invalid=true]:dark:text-red-500',
        'has-[>[role=checkbox],[role=radiogroup]]:items-start',
        'has-[>[role=checkbox]]:flex-row-reverse',
        'has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radiogroup]]:mt-px',
        getSpan(props.cols),
        props.className
      )}
    >
      {props.children}
    </div>
  )
}
