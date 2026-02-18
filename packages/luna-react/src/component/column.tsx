import { getColumn, type Column } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export function Column(
  props: Readonly<{
    children?: React.ReactNode
    column?: Column
  }>
) {
  const cols = getColumn(props.column?.advanced?.cols)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className={twMerge('grid grid-cols-1 gap-3 sm:gap-4', cols)}>
        {props.children}
      </div>
    </div>
  )
}
