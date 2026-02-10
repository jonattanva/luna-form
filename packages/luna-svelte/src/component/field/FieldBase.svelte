<script lang="ts">
  import {
    DATA_INVALID,
    DATA_READONLY,
    type Orientation,
  } from '@luna-form/core'
  import { twMerge } from 'tailwind-merge'
  import type { Snippet } from 'svelte'

  let {
    children,
    class: className,
    disabled,
    errors: errorList,
    isCheckbox,
    isReversed,
    isClickable,
    orientation,
  }: {
    children?: Snippet
    class?: string
    disabled?: boolean
    errors?: string[]
    isCheckbox?: boolean
    isReversed?: boolean
    isClickable?: boolean
    orientation: Orientation
  } = $props()

  const hasErrors = $derived(errorList && errorList.length > 0)
</script>

<div
  data-slot="field"
  data-clickable={isClickable ? 'true' : 'false'}
  {...{ [DATA_INVALID]: hasErrors ? 'true' : undefined }}
  {...{ [DATA_READONLY]: disabled ? 'true' : undefined }}
  data-orientation={orientation}
  class={twMerge(
    'group flex w-full flex-col items-center data-[invalid=true]:text-red-600 data-[invalid=true]:dark:text-red-500',
    'data-[clickable=true]:items-start',
    isCheckbox && (isReversed ? 'flex-row-reverse!' : 'flex-row!'),
    'data-[clickable=true]:has-[>[data-slot=field-content]]:[&>:first-child]:mt-px',
    className
  )}
>
  {#if children}
    {@render children()}
  {/if}
</div>
