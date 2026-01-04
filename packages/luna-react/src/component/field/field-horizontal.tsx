import { FieldBase } from './field-base'
import { HORIZONTAL } from '@luna-form/core'

export function FieldHorizontal(
  props: Readonly<{
    children: React.ReactNode
    cols?: number
    disabled?: boolean
    errors?: string[]
  }>
) {
  return (
    <FieldBase
      {...props}
      orientation={HORIZONTAL}
      className="gap-2 md:flex-row md:gap-4 [&:not(:has(>[role=checkbox],[role=radiogroup]))]:md:justify-between [&>*:not([role=checkbox]):not([role=radiogroup]):not([data-slot=field-content])]:w-full [&>*:not([role=checkbox]):not([role=radiogroup]):not([data-slot=field-content])]:md:w-1/2 [&>*:not([role=checkbox]):not([role=radiogroup]):not([data-slot=field-content])]:xl:w-2/5 [&>[data-slot=field-content]]:min-w-0 [&>[data-slot=field-content]]:flex-grow [&>[data-slot=field-content]]:self-start"
    >
      {props.children}
    </FieldBase>
  )
}
