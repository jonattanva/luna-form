import { SlotBase } from './slot-base'
import type { Children } from '../../type'
import type { FieldProps } from '../field/field'
import type { Fields, Nullable, Style } from '@luna-form/core'
import type { ListProps } from '../field/field-list'

export function createSlot(
  Field: React.ComponentType<FieldProps>,
  FieldList: React.ComponentType<ListProps>
) {
  const CreateSlot = (
    props: Readonly<{
      children: Children
      disabled?: boolean
      fields?: Fields
      style?: Style
      value?: Nullable<Record<string, unknown>>
    }>
  ) => (
    <SlotBase {...props} components={{ field: Field, fieldList: FieldList }} />
  )

  return CreateSlot
}
