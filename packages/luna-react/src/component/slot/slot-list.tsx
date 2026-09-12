import {
  isColumn,
  isField,
  isList,
  type List,
  type Nullable,
  type Style,
} from '@luna-form/core'
import { SlotBase, type SlotComponents } from './slot-base'
import { useMemo } from 'react'
import type { Children, Config } from '../../type'

export function SlotList(
  props: Readonly<{
    children: Children
    components: SlotComponents
    config: Config
    context?: Record<string, unknown>
    disabled?: boolean
    field: List
    index: number
    lang?: string
    onValueChange?: (input: { name: string; value: unknown }) => void
    style?: Style
    translations?: Record<string, string>
    value?: Nullable<Record<string, unknown>>
  }>
) {
  // A row's leaves are renamed by cloning, which is unavoidable -- the name
  // carries the row it belongs to -- but the clone has to survive the render.
  // `useInput` memoizes each leaf's Zod schema on the object it is handed, so
  // renaming afresh every time rebuilt every row's schemas on every render of
  // the form, including renders started by a field outside the list.
  //
  // Memoized here rather than cached in a module, and that is the point: the
  // key would be the row's stable id, which only ever goes up, so a module
  // cache would grow for the life of the page. This one is the row's own, and
  // it goes when the row does.
  //
  // Hooks are fine in this tree: `component/form` renders `VisibilityGuard`,
  // which reads an atom, and the server entry renders that same tree.
  const { fields: rowFields, name: listName } = props.field
  const { index } = props

  const fields = useMemo(() => {
    return Array.isArray(rowFields)
      ? rowFields.map((field) => {
          if (isField(field) || isList(field)) {
            return {
              ...field,
              name: `${listName}.${index}.${field.name}`,
            }
          }

          if (isColumn(field)) {
            return {
              ...field,
              fields: field.fields.map((columnField) => ({
                ...columnField,
                name: `${listName}.${index}.${columnField.name}`,
              })),
            }
          }

          return field
        })
      : []
  }, [index, listName, rowFields])

  return (
    <SlotBase
      components={props.components}
      config={props.config}
      context={props.context}
      disabled={props.disabled}
      fields={fields}
      lang={props.lang}
      onValueChange={props.onValueChange}
      style={props.style}
      translations={props.translations}
      value={props.value}
    >
      {props.children}
    </SlotBase>
  )
}
