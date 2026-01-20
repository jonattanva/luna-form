import { FieldBase } from './field-base'
import { VERTICAL } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export function FieldVertical(
  props: Readonly<{
    children: React.ReactNode
    cols?: number
    disabled?: boolean
    errors?: string[]
    isCheckbox?: boolean
    isClickable?: boolean
  }>
) {
  return (
    <FieldBase
      {...props}
      orientation={VERTICAL}
      className={twMerge(
        'gap-3 has-[>[data-slot=field-content]]:items-start',
        !props.isClickable && '[&>*]:w-full'
      )}
    >
      {props.children}
    </FieldBase>
  )
}
