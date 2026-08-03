import { FieldList } from '../field/field-list'
import { List } from '../list'
import type { ListProps } from '../field/field-list'

export function ListSlot({
  children,
  field,
  lang,
  translations,
  value,
}: ListProps) {
  return (
    <List field={field} translations={translations}>
      <FieldList
        field={field}
        lang={lang}
        translations={translations}
        value={value}
      >
        {children}
      </FieldList>
    </List>
  )
}
