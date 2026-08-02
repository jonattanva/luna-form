import { FieldList } from '../field/field-list'
import { List } from '../../../component/list'
import { VisibilityGuard } from './visibility-guard'
import type { ListProps } from '../../../component/field/field-list'

export function ListGuard({
  children,
  field,
  lang,
  onValueChange,
  translations,
  value,
}: ListProps) {
  return (
    <VisibilityGuard container={field} fields={field.fields}>
      <List field={field}>
        <FieldList
          field={field}
          lang={lang}
          onValueChange={onValueChange}
          translations={translations}
          value={value}
        >
          {children}
        </FieldList>
      </List>
    </VisibilityGuard>
  )
}
