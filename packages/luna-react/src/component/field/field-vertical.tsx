import { FieldBase } from './field-base'
import { VERTICAL } from '@luna-form/core'

export function FieldVertical(
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
      orientation={VERTICAL}
      className="gap-3 has-[>[data-slot=field-content]]:items-start [&>*:not([role=checkbox]):not([role=radiogroup])]:w-full"
    >
      {props.children}
    </FieldBase>
  )
}
