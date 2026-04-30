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
  return (
    <fieldset
      className="flex flex-col data-[empty=false]:gap-6"
      data-empty={props.empty}
      data-slot="field-set"
      id={props.id}
    >
      <Legend
        description={props.description}
        step={props.step}
        title={props.title}
      />
      {props.children}
    </fieldset>
  )
}
