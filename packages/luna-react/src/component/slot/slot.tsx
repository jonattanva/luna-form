import { Column } from '../column'
import { Field } from '../field/field'
import { SlotBase } from './slot-base'
import type { Children } from '../../type'
import type { Fields } from '@luna-form/core'
import type { Style } from '../../lib/use-style'

export const Slot = (
  props: Readonly<{
    children: Children
    disabled?: boolean
    fields?: Fields
    style?: Style
  }>
) => <SlotBase {...props} components={{ column: Column, field: Field }} />
