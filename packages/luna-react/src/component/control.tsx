import type { Control } from '../type'

export function Control(
  props: Readonly<{
    children?: Control
    isPending?: boolean
  }>
) {
  const content =
    typeof props.children === 'function'
      ? props.children({ isPending: props.isPending })
      : props.children

  return (
    <div data-slot="field-control" className="w-full">
      {content}
    </div>
  )
}
