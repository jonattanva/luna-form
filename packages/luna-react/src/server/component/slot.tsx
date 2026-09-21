import { Field } from './field'
import { ListSlot } from './list-slot'
import { createSlot } from '../../component/slot/slot-create'

// The same injection the client makes, with the pieces this side can render.
// See `createSlot`.
export const Slot = createSlot({ field: Field, list: ListSlot })
