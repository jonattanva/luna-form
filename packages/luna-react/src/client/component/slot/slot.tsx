import { Field } from '../field/field'
import { ListGuard } from '../guard/list-guard'
import { createSlot } from '../../../component/slot/slot-create'

export const Slot = createSlot({ field: Field, list: ListGuard })
