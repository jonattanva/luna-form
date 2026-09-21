import { Group } from '../../component/group'
import { List } from '../../component/list'
import {
  getInitialList,
  getLabel,
  isMultiFieldList,
  translate,
} from '@luna-form/core'
import type { ListProps } from '../../component/field/field-list'

// A list rendered on the server: its rows, open, with no button to collapse or
// remove one. Adding, removing and collapsing are state and handlers, and this
// tree has neither; the client renders the same rows with all three.
export function ListSlot(props: ListProps) {
  const label = translate(getLabel(props.field), props.translations)
  const isMultiField = isMultiFieldList(props.field)

  return (
    <List field={props.field} translations={props.translations}>
      {getInitialList(props.field, props.value).map((index) => (
        <div
          data-slot={isMultiField ? 'list-item-card' : undefined}
          className={
            isMultiField
              ? 'box-border w-full min-w-0 rounded-lg border border-zinc-100 p-4 dark:border-zinc-900'
              : 'box-border flex w-full min-w-0 flex-col gap-2'
          }
          key={index}
        >
          {isMultiField && (
            <div className="flex min-w-0 flex-col font-medium text-zinc-700 dark:text-zinc-400">
              <span className="text-base">
                {label} {index + 1}
              </span>
            </div>
          )}
          <Group>{props.children(index)}</Group>
        </div>
      ))}
    </List>
  )
}
