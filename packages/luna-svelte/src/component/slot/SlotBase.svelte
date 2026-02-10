<script lang="ts" module>
  import type { Column, Field as FieldType, Style } from '@luna-form/core'
  import type { Component, Snippet } from 'svelte'
  import type { Children } from '../../type'

  export type ColumnProps = {
    children?: Snippet
    column?: Column
  }

  export type FieldProps = {
    children: Children
    disabled?: boolean
    errors?: Record<string, string[]>
    field: FieldType
    style?: Style
  }
</script>

<script lang="ts">
  import { isColumn, isField, prepare, type Fields } from '@luna-form/core'
  import SlotBase from './SlotBase.svelte'

  let {
    children,
    components,
    disabled,
    fields,
    style,
  }: {
    children: Children
    components: {
      column: Component<ColumnProps>
      field: Component<FieldProps>
    }
    disabled?: boolean
    fields?: Fields
    style?: Style
  } = $props()

  const preparedFields = $derived(prepare(fields))
</script>

{#each preparedFields as field}
  {#if isColumn(field)}
    <components.column column={field}>
      <SlotBase
        {children}
        {components}
        {disabled}
        fields={field.fields}
        {style}
      />
    </components.column>
  {:else if isField(field)}
    <components.field {disabled} {field} {style} {children} />
  {/if}
{/each}
