import { getColumn, type Column } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import { FormattedDescription } from './formatted-description'
import type { Config } from '../type'

export function Column(
  props: Readonly<{
    children?: React.ReactNode
    column?: Column
    config?: Config
    context?: Record<string, unknown>
    translations?: Record<string, string>
  }>
) {
  const cols = getColumn(props.column?.advanced?.cols)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className={twMerge('grid grid-cols-1 gap-3 sm:gap-4', cols)}>
        {props.children}
      </div>
      {props.column?.description && (
        <FormattedDescription
          config={props.config}
          context={props.context}
          text={props.column.description}
          translations={props.translations}
        />
      )}
    </div>
  )
}
