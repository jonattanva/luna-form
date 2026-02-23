import { SlotBase } from './slot-base'
import type { Children } from '../../type'
import type { Fields, Nullable, Style } from '@luna-form/core'
import type { SlotComponents } from './slot-base'

export function createSlot(components: SlotComponents) {
  const CreateSlot = (
    props: Readonly<{
      children: Children
      disabled?: boolean
      fields?: Fields
      style?: Style
      value?: Nullable<Record<string, unknown>>
    }>
  ) => <SlotBase {...props} components={components} />

  return CreateSlot
}
