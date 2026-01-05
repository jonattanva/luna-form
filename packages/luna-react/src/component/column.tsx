import { Group } from './group'
import { getColumn, type Column as ColumnType } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import { useStyle, type Style } from '../lib/use-style'

export type ColumnProps = Readonly<{
  children?: React.ReactNode
  column?: ColumnType
  style?: Style
}>

export function Column(props: ColumnProps) {
  const cols = getColumn(props.column?.advanced?.cols)

  const { compact } = useStyle(props.style)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className={twMerge('grid grid-cols-1 gap-8 sm:gap-4', cols)}>
        <Group compact={compact}>{props.children}</Group>
      </div>
    </div>
  )
}
