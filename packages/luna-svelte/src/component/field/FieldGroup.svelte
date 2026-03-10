<script lang="ts">
  import {
    buildReverse,
    isCheckbox as checkIsCheckbox,
    isClickable as checkIsClickable,
    type Field,
  } from '@luna-form/core'
  import FieldHorizontal from './FieldHorizontal.svelte'
  import FieldVertical from './FieldVertical.svelte'
  import type { Snippet } from 'svelte'

  let {
    children,
    disabled,
    errors,
    field,
    horizontal,
  }: {
    children?: Snippet
    disabled?: boolean
    errors?: string[]
    field: Field
    horizontal?: boolean
  } = $props()

  const isClickable = $derived(checkIsClickable(field))
  const isCheckbox = $derived(checkIsCheckbox(field))
  const isReversed = $derived(buildReverse(field))
</script>

{#if !horizontal}
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
