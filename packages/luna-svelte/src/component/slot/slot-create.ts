import type { Component } from 'svelte'
import SlotBase, { type FieldProps } from './SlotBase.svelte'
import Column from '../Column.svelte'

/**
 * Creates a Slot component with a pre-configured Field component.
 * In Svelte 5, this returns a functional wrapper around SlotBase.
 */
export function createSlot(Field: Component<FieldProps>): Component<any> {
  return ((anchor: any, props: any) => {
    return (SlotBase as any)(anchor, {
      ...props,
      components: { column: Column, field: Field },
    })
  }) as any
}
