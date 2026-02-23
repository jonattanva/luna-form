import { Control as Action } from './control'
import { FieldSet } from './field/field-set'
import { Group } from './group'
import { VisibilityGuard } from '../client/component/guard/visibility-guard'
import { Separator } from './separator'
import { prepare, type Definition, type Sections } from '@luna-form/core'
import type { Config, Control, Slot } from '../type'

export function Form(
  props: Readonly<{
    action?: (formData: FormData) => void
    children: Slot
    config: Config
    control?: Control
    definition?: Definition
    isPending?: boolean
    noValidate?: boolean
    readOnly?: boolean
    sections: Sections
  }>
) {
  const sections = prepare(props.sections, props.definition)

  return (
    <div className="h-full w-full">
      <form noValidate={props.noValidate} action={props.action}>
        <Group>
          {sections.map((section, index) => (
            <VisibilityGuard key={index} fields={section.fields ?? []}>
              <FieldSet section={section} style={props.config.style}>
                {props.children({
                  disabled: props.readOnly,
                  fields: section.fields,
                })}
              </FieldSet>
              {section.separator && <Separator />}
            </VisibilityGuard>
          ))}
          {props.control && (
            <Action isPending={props.isPending}>{props.control}</Action>
          )}
        </Group>
      </form>
    </div>
  )
}
