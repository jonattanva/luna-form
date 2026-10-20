import { Legend } from '../legend'

export function FieldSetBase(
  props: Readonly<{
    children?: React.ReactNode
    description?: string
    empty?: boolean
    id?: string
    step?: number
    title?: string
  }>
) {
  // A legend with nothing in it is still a box, and the fieldset's gap is
  // measured from it: an unlabelled list would open with that gap above its
  // first row, which reads as stray space wherever two of them stack.
  const hasLegend = Boolean(props.title || props.description || props.step)

  return (
    <fieldset
      className="flex w-full min-w-0 flex-col data-[empty=false]:gap-6"
      data-empty={props.empty}
      data-slot="field-set"
      id={props.id}
    >
      {hasLegend && (
        <Legend
          description={props.description}
          step={props.step}
          title={props.title}
        />
      )}
      <div className="w-full min-w-0">{props.children}</div>
    </fieldset>
  )
}
