import { DescriptionText, type DescriptionTextProps } from './description'
import { getColumn, type Column, type Localization } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import type { Config } from '../type'

export function Column(
  props: Readonly<{
    children?: React.ReactNode
    column?: Column
    config?: Config
    context?: Record<string, unknown>
    description?: React.ComponentType<DescriptionTextProps>
    localization?: Localization
  }>
) {
  const Description = props.description ?? DescriptionText
  const cols = getColumn(props.column?.advanced?.cols)

  // A hidden field renders nothing, so a column whose fields are all hidden is
  // an empty grid; left in the layout, it adds the form's gap twice over.
  return (
    <div className="flex w-full flex-col gap-4 has-[>[data-slot=column]:empty]:hidden">
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
          localization={props.localization}
          text={props.column.description}
        />
      )}
    </div>
  )
}
