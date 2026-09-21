import { DescriptionText, type DescriptionTextProps } from './description'
import { getColumn, type Column } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import type { Config } from '../type'

export function Column(
  props: Readonly<{
    children?: React.ReactNode
    column?: Column
    config?: Config
    context?: Record<string, unknown>
    description?: React.ComponentType<DescriptionTextProps>
    translations?: Record<string, string>
  }>
) {
  const Description = props.description ?? DescriptionText
  const cols = getColumn(props.column?.advanced?.cols)

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        data-slot="column"
        className={twMerge('grid grid-cols-1 gap-3 sm:gap-4', cols)}
      >
        {props.children}
      </div>
      {props.column?.description && (
        <Description
          config={props.config}
          context={props.context}
          text={props.column.description}
          translations={props.translations}
        />
      )}
    </div>
  )
}
