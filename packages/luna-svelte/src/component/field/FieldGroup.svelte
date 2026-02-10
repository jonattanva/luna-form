<script lang="ts">
  import {
    VERTICAL,
    isCheckbox as checkIsCheckbox,
    isClickable as checkIsClickable,
    type Field,
    type Orientation,
  } from '@luna-form/core'
  import type { Snippet } from 'svelte'
  import FieldVertical from './FieldVertical.svelte'
  import FieldHorizontal from './FieldHorizontal.svelte'

  let {
    children,
    cols,
    disabled,
    errors,
    field,
    orientation,
  }: {
    children?: Snippet
    cols?: number
    disabled?: boolean
    errors?: string[]
    field: Field
    orientation?: Orientation
  } = $props()

  const isClickable = $derived(checkIsClickable(field))
  const isCheckbox = $derived(checkIsCheckbox(field))
</script>

{#if orientation === VERTICAL}
  <FieldVertical {cols} {disabled} {errors} {isCheckbox} {isClickable}>
    {#if children}
      {@render children()}
    {/if}
  </FieldVertical>
{:else}
  <FieldHorizontal {cols} {disabled} {errors} {isCheckbox} {isClickable}>
    {#if children}
      {@render children()}
    {/if}
  </FieldHorizontal>
{/if}
