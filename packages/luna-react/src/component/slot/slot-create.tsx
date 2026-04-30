import { SlotBase } from './slot-base'
import type { Children, Config } from '../../type'
import type { Fields, Nullable, Style } from '@luna-form/core'
import type { SlotComponents } from './slot-base'

export function createSlot(components: SlotComponents) {
  const CreateSlot = (
    props: Readonly<{
      children: Children
      config: Config
      context?: Record<string, unknown>
      disabled?: boolean
      fields?: Fields
      style?: Style
      translations?: Record<string, string>
      value?: Nullable<Record<string, unknown>>
    }>
  ) => <SlotBase {...props} components={components} />

  return CreateSlot
}
