<script lang="ts">
  import FieldBase from './FieldBase.svelte'
  import { VERTICAL } from '@luna-form/core'
  import { twMerge } from 'tailwind-merge'
  import type { Snippet } from 'svelte'

  let {
    children,
    disabled,
    errors,
    isCheckbox,
    isReversed,
    isClickable,
  }: {
    children?: Snippet
    disabled?: boolean
    errors?: string[]
    isCheckbox?: boolean
    isReversed?: boolean
    isClickable?: boolean
  } = $props()
</script>

<FieldBase
  {disabled}
  {errors}
  {isCheckbox}
  {isReversed}
  {isClickable}
  orientation={VERTICAL}
  class={twMerge(
    'gap-3 has-[>[data-slot=field-content]]:items-start',
    !isClickable && '[&>*]:w-full'
  )}
>
  {#if children}
    {@render children()}
  {/if}
</FieldBase>
