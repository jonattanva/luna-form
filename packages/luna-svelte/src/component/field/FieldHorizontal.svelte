<script lang="ts">
  import { HORIZONTAL } from '@luna-form/core'
  import { twMerge } from 'tailwind-merge'
  import type { Snippet } from 'svelte'
  import FieldBase from './FieldBase.svelte'

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
  orientation={HORIZONTAL}
  class={twMerge(
    'gap-2 md:flex-row md:gap-4',
    '[&>[data-slot=field-content]]:min-w-0 [&>[data-slot=field-content]]:flex-grow [&>[data-slot=field-content]]:self-start',
    '[&_[role=checkbox]]:mt-[1.5px]',
    isClickable && 'md:flex-col',
    !isClickable && [
      'md:justify-between',
      '[&>*:not([data-slot=field-content])]:w-full',
      '[&>*:not([data-slot=field-content])]:md:w-1/2',
      '[&>*:not([data-slot=field-content])]:xl:w-2/5',
    ]
  )}
>
  {#if children}
    {@render children()}
  {/if}
</FieldBase>
