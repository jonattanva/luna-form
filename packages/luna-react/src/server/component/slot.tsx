import { Field } from '../../component/field/field'
import { ListSlot } from './list-slot'
import { createSlot } from '../../component/slot/slot-create'

// The same injection the client makes, with the pieces this side can render.
// See `createSlot`. The field is the shared one, handed no error list: there is
// nothing to list on the server. See `FieldProps`.
export const Slot = createSlot({ field: Field, list: ListSlot })
