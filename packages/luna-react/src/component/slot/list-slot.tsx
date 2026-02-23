import { FieldList } from '../field/field-list'
import { List } from '../list'
import type { ListProps } from '../field/field-list'

export function ListSlot({ children, field, value }: ListProps) {
  return (
    <List field={field}>
      <FieldList field={field} value={value}>
        {children}
      </FieldList>
    </List>
  )
}
