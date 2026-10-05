import { FieldList } from '../field/field-list'
import { List } from '../list'
import type { ListProps } from '../field/field-list'

export function ListSlot({ children, field, localization, value }: ListProps) {
  return (
    <List field={field} translations={localization?.translations}>
      <FieldList field={field} localization={localization} value={value}>
        {children}
      </FieldList>
    </List>
  )
}
