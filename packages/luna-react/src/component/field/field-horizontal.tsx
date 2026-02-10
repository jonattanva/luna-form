import { FieldBase } from './field-base'
import { HORIZONTAL } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export function FieldHorizontal(
  props: Readonly<{
    children: React.ReactNode
    cols?: number
    disabled?: boolean
    errors?: string[]
    isCheckbox?: boolean
    isReversed?: boolean
    isClickable?: boolean
  }>
) {
  return (
    <FieldBase
      {...props}
      orientation={HORIZONTAL}
      className={twMerge(
        'gap-2 md:flex-row md:gap-4',
        '[&>[data-slot=field-content]]:min-w-0 [&>[data-slot=field-content]]:flex-grow [&>[data-slot=field-content]]:self-start',
        '[&_[role=checkbox]]:mt-[1.5px]',
        props.isClickable && 'md:flex-col',
        !props.isClickable && [
          'md:justify-between',
          '[&>*:not([data-slot=field-content])]:w-full',
          '[&>*:not([data-slot=field-content])]:md:w-1/2',
          '[&>*:not([data-slot=field-content])]:xl:w-2/5',
        ]
      )}
    >
      {props.children}
    </FieldBase>
  )
}
