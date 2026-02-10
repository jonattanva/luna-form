<script lang="ts">
  import type { Snippet } from 'svelte'
  import { twMerge } from 'tailwind-merge'

  let {
    children,
    compact,
  }: {
    children?: Snippet
    compact?: boolean
  } = $props()
</script>

<div
  data-slot="field-group"
  data-compact={compact}
  class={twMerge('flex w-full flex-col gap-8 data-[compact=true]:gap-3')}
>
  {#if children}
    {@render children()}
  {/if}
</div>
