import { Field } from '../field/field'
import { ListSlot } from './list-slot'
import { createSlot } from './slot-create'

export const Slot = createSlot({ field: Field, list: ListSlot })
