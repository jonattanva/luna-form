import { FieldList } from '../field/field-list'
import { KeepValueContext } from '../../context/keep-value-context'
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
  const content = (
    <List field={field} translations={translations}>
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
  )

  // A list holds nothing under its own name, so `keepValue` on the list is a
  // statement about its leaves -- and they are inputs, which read the flag from
  // this context. Provided only when the list asks for it, so a list sitting
  // inside a collapsible goes on inheriting the `true` it already had.
  return (
    <VisibilityGuard container={field} fields={field.fields}>
      {field.keepValue ? (
        <KeepValueContext value={true}>{content}</KeepValueContext>
      ) : (
        content
      )}
    </VisibilityGuard>
  )
}
