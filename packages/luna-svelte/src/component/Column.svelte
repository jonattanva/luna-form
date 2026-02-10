<script lang="ts">
  import { getColumn } from '@luna-form/core'
  import { twMerge } from 'tailwind-merge'
  import type { Column } from '@luna-form/core'
  import type { Snippet } from 'svelte'

  let {
    children,
    column,
  }: {
    children?: Snippet
    column?: Column
  } = $props()

  const cols = $derived(getColumn(column?.advanced?.cols))
</script>

<div class="flex w-full flex-col gap-4">
  <div class={twMerge('grid grid-cols-1 gap-3 sm:gap-4', cols)}>
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
