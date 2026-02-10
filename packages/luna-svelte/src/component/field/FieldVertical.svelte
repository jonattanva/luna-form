<script lang="ts">
  import FieldBase from './FieldBase.svelte'
  import { VERTICAL } from '@luna-form/core'
  import { twMerge } from 'tailwind-merge'
  import type { Snippet } from 'svelte'

  let {
    children,
    cols,
    disabled,
    errors,
    isCheckbox,
    isClickable,
  }: {
    children?: Snippet
    cols?: number
    disabled?: boolean
    errors?: string[]
    isCheckbox?: boolean
    isClickable?: boolean
  } = $props()
</script>

<FieldBase
  {cols}
  {disabled}
  {errors}
  {isCheckbox}
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
