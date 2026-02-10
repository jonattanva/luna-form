<script lang="ts">
  import {
    VERTICAL,
    buildReverse,
    isCheckbox as checkIsCheckbox,
    isClickable as checkIsClickable,
    type Field,
    type Orientation,
  } from '@luna-form/core'
  import FieldHorizontal from './FieldHorizontal.svelte'
  import FieldVertical from './FieldVertical.svelte'
  import type { Snippet } from 'svelte'

  let {
    children,
    disabled,
    errors,
    field,
    orientation,
  }: {
    children?: Snippet
    disabled?: boolean
    errors?: string[]
    field: Field
    orientation?: Orientation
  } = $props()

  const isClickable = $derived(checkIsClickable(field))
  const isCheckbox = $derived(checkIsCheckbox(field))
  const isReversed = $derived(buildReverse(field))
</script>

{#if orientation === VERTICAL}
  <FieldVertical {disabled} {errors} {isCheckbox} {isReversed} {isClickable}>
    {#if children}
      {@render children()}
    {/if}
  </FieldVertical>
{:else}
  <FieldHorizontal {disabled} {errors} {isCheckbox} {isReversed} {isClickable}>
    {#if children}
      {@render children()}
    {/if}
  </FieldHorizontal>
{/if}
