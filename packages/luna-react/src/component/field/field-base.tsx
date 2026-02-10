import { DATA_INVALID, DATA_READONLY, type Orientation } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export function FieldBase(
  props: Readonly<{
    children: React.ReactNode
    className?: string
    cols?: number
    disabled?: boolean
    errors?: string[]
    isCheckbox?: boolean
    isReversed?: boolean
    isClickable?: boolean
    orientation: Orientation
  }>
) {
  const errors = props.errors && props.errors.length > 0

  return (
    <div
      data-slot="field"
      data-clickable={props.isClickable ? 'true' : 'false'}
      {...(errors && { [DATA_INVALID]: 'true' })}
      {...(props.disabled && { [DATA_READONLY]: 'true' })}
      data-orientation={props.orientation}
      className={twMerge(
        'group flex w-full flex-col items-center data-[invalid=true]:text-red-600 data-[invalid=true]:dark:text-red-500',
        'data-[clickable=true]:items-start',
        props.isCheckbox &&
          (props.isReversed ? 'flex-row-reverse!' : 'flex-row!'),
        'data-[clickable=true]:has-[>[data-slot=field-content]]:[&>:first-child]:mt-px',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}
