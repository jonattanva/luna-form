<script lang="ts">
  import { isCheckbox, isRadio, type Field } from '@luna-form/core'
  import type { Snippet } from 'svelte'
  import { twMerge } from 'tailwind-merge'

  let {
    field,
    children,
  }: {
    field: Field
    children?: Snippet
  } = $props()

  const normal = $derived(isRadio(field) || isCheckbox(field))
</script>

<label
  data-slot="field-label"
  data-normal={normal}
  class={twMerge(
    'flex w-fit items-center gap-2 text-sm leading-snug font-medium select-none',
    'data-[normal=true]:font-normal',
    'group-data-[readonly=true]:cursor-not-allowed group-data-[readonly=true]:opacity-50',
  )}
  for={field.name}
>
  {@render children?.()}
  {#if !field.required}
    <span class="text-sm text-slate-600 dark:text-slate-400"> (Optional) </span>
  {/if}
</label>
