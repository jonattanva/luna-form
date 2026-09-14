import { Control as Action } from './control'
import { FieldSet } from './field/field-set'
import { Group } from './group'
import { Separator } from './separator'
import { VisibilityGuard } from '../client/component/guard/visibility-guard'
import { prepare, type Definition, type Sections } from '@luna-form/core'
import type { Config, Control, Slot } from '../type'
import type { FormEvent } from 'react'

export function Form(
  props: Readonly<{
    advanced?: {
      step?: boolean
    }
    action?: (formData: FormData) => void
    children: Slot
    config: Config
    control?: Control
    definition?: Definition
    isPending?: boolean
    noValidate?: boolean
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void
    readOnly?: boolean
    sections: Sections
    translations?: Record<string, string>
  }>
) {
  const sections = prepare(props.sections, props.definition)

  // The client form submits through `onSubmit`, which dispatches the action
  // itself so that React resets nothing after a failed submit. See
  // `useFormState`. `action` stays in the markup all the same: a form submitted
  // before hydration then throws, instead of navigating to its own URL with
  // every field in the query string.
  return (
    <div className="h-full w-full">
      <form
        noValidate={props.noValidate}
        action={props.action}
        onSubmit={props.onSubmit}
      >
        <Group>
          {sections.map((section, index) => (
            <VisibilityGuard
              key={`key-${section.id}-${index}`}
              fields={section.fields ?? []}
            >
              <FieldSet
                advanced={props.advanced}
                section={section}
                step={index + 1}
                style={props.config.style}
                translations={props.translations}
              >
                {props.children({
                  disabled: props.readOnly,
                  fields: section.fields,
                })}
              </FieldSet>
              {section.advanced?.separator && <Separator />}
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
