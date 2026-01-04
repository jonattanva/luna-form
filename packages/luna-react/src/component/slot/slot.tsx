import { Column } from '../column'
import { Field } from '../field/field'
import { SlotBase } from './slot-base'
import type { Children } from '../../type'
import type { Fields } from '@luna-form/core'

export const Slot = (
  props: Readonly<{
    children: Children
    disabled?: boolean
    fields?: Fields
  }>
) => <SlotBase {...props} components={{ column: Column, field: Field }} />
