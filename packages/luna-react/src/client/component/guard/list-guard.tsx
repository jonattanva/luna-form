import { FieldList } from '../field/field-list'
import { List } from '../../../component/list'
import { VisibilityGuard } from './visibility-guard'
import type { ListProps } from '../../../component/field/field-list'

export function ListGuard({ children, field, value }: ListProps) {
  return (
    <VisibilityGuard container={field} fields={field.fields}>
      <List field={field}>
        <FieldList field={field} value={value}>
          {children}
        </FieldList>
      </List>
    </VisibilityGuard>
  )
}
