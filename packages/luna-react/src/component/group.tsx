import type { Orientation } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export function Group(
  props: Readonly<{
    children?: React.ReactNode
    compact?: boolean
    orientation?: Orientation
  }>,
) {
  return (
    <div
      data-slot="field-group"
      data-compact={props.compact}
      data-orientation={props.orientation}
      className={twMerge(
        'flex w-full flex-col gap-8 data-[compact=true]:gap-3',
        props.orientation === 'horizontal' && 'sm:flex-row',
      )}
    >
      {props.children}
    </div>
  )
}
