import { Control as Action } from './control'
import { StaticFieldSet } from './field/field-set-static'
import { Group } from './group'
import { Separator } from './separator'
import { isGuardHidden } from '../lib/visibility'
import { prepare, type Definition, type Sections } from '@luna-form/core'
import type { Config, Control, Slot } from '../type'
import type { Fields } from '@luna-form/core'
import type { FormEvent } from 'react'

export type GuardProps = Readonly<{
  children: React.ReactNode
  fields: Fields
}>

// What a form knows about visibility with nothing to read: the definition, and
// that is all there is on the server. The guard that also reads what the form
// has been told since is the client's, and the client passes it in -- the way
// `createSlot` already hands this tree its `field` and its `list`.
//
// This is what keeps the server entry loadable under the `react-server`
// condition: a tree shared by both sides cannot import an atom, because jotai
// reaches for `createContext` as it loads and React does not export one there.
export function StaticGuard(props: GuardProps) {
  return isGuardHidden({}, props.fields) ? null : props.children
}

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
    fieldSet?: React.ComponentType<React.ComponentProps<typeof StaticFieldSet>>
    guard?: React.ComponentType<GuardProps>
    isPending?: boolean
    noValidate?: boolean
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void
    readOnly?: boolean
    sections: Sections
    translations?: Record<string, string>
  }>
) {
  const sections = prepare(props.sections, props.definition)
  const Guard = props.guard ?? StaticGuard
  const FieldSet = props.fieldSet ?? StaticFieldSet

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
            <Guard
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
            </Guard>
          ))}
          {props.control && (
            <Action isPending={props.isPending}>{props.control}</Action>
          )}
        </Group>
      </form>
    </div>
  )
}
