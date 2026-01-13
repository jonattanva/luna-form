import { Column } from '../column'
import { Field } from '../field/field'
import { SlotBase } from './slot-base'
import type { Children } from '../../type'
import type { Fields, Style } from '@luna-form/core'

export const Slot = (
  props: Readonly<{
    children: Children
    disabled?: boolean
    fields?: Fields
    style?: Style
  }>
) => <SlotBase {...props} components={{ column: Column, field: Field }} />
