import type { Component, ComponentProps } from 'svelte'
import SlotBase, { type FieldProps } from './SlotBase.svelte'
import Column from '../Column.svelte'

type SlotBaseProps = ComponentProps<typeof SlotBase>
type CreateSlotProps = Omit<SlotBaseProps, 'components'>
type Internals = Parameters<Component<Record<string, unknown>>>[0]

/**
 * Creates a Slot component with a pre-configured Field component.
 * This adheres to Svelte 5 component function signature.
 */
export function createSlot(
  Field: Component<FieldProps>
): Component<CreateSlotProps> {
  // In Svelte 5, components are functions taking (internals, props).
  // We wrap SlotBase to inject the pre-configured components.
  const Slot = (internals: Internals, props: CreateSlotProps) => {
    return (SlotBase as (internals: Internals, props: SlotBaseProps) => unknown)(
      internals,
      {
        ...props,
        components: { column: Column, field: Field },
      } as SlotBaseProps
    )
  }

  return Slot as unknown as Component<CreateSlotProps>
}
