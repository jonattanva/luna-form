import { Field } from '../field/field'
import { FormattedDescription } from '../formatted-description'
import { ListGuard } from '../guard/list-guard'
import { createSlot } from '../../../component/slot/slot-create'

export const Slot = createSlot({
  description: FormattedDescription,
  field: Field,
  list: ListGuard,
})
