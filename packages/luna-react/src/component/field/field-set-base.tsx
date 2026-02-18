import { Legend } from '../legend'

export function FieldSetBase(
  props: Readonly<{
    children?: React.ReactNode
    description?: string
    empty?: boolean
    id?: string
    title?: string
  }>
) {
  return (
    <fieldset
      data-slot="field-set"
      data-empty={props.empty}
      className="flex flex-col data-[empty=false]:gap-6"
      id={props.id}
    >
      <Legend description={props.description} title={props.title} />
      {props.children}
    </fieldset>
  )
}
