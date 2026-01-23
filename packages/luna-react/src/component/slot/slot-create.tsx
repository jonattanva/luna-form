import { Column } from '../column'
import { SlotBase } from './slot-base'
import type { Children } from '../../type'
import type { FieldProps } from '../field/field'
import type { Fields, Style } from '@luna-form/core'

export function createSlot(Field: React.ComponentType<FieldProps>) {
  const CreateSlot = (
    props: Readonly<{
      children: Children
      disabled?: boolean
      fields?: Fields
      style?: Style
    }>
  ) => <SlotBase {...props} components={{ column: Column, field: Field }} />

  return CreateSlot
}
