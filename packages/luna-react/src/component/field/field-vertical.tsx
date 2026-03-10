import { FieldBase, type FieldLayoutProps } from './field-base'
import { twMerge } from 'tailwind-merge'

export function FieldVertical(props: Readonly<FieldLayoutProps>) {
  return (
    <FieldBase
      {...props}
      orientation="vertical"
      className={twMerge(
        'gap-3 has-[>[data-slot=field-content]]:items-start',
        !props.isClickable && '[&>*]:w-full'
      )}
    >
      {props.children}
    </FieldBase>
  )
}
