export function Group(
  props: Readonly<{
    children?: React.ReactNode
    compact?: boolean
  }>
) {
  return (
    <div
      data-slot="field-group"
      data-compact={props.compact}
      className="flex w-full flex-col gap-8 data-[compact=true]:gap-3"
    >
      {props.children}
    </div>
  )
}
