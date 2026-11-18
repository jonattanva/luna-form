import type { List, Nullable, Localization } from '@luna-form/core'
import type { ValueChange } from '../../type'

export type ListProps = Readonly<{
  // A row by its stable id, and the value it starts from. See `SlotListField`.
  children: (
    index: number,
    value?: Nullable<Record<string, unknown>>
  ) => React.ReactNode
  field: List
  onValueChange?: (input: ValueChange) => void
  localization?: Localization
  value?: Nullable<Record<string, unknown>>
}>
