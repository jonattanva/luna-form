<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    children,
  }: {
    children?: Snippet
  } = $props()
</script>

<p
  class="-mt-2 text-xs leading-normal font-normal text-slate-600 dark:text-slate-400"
>
  {#if children}
    {@render children()}
  {/if}
</p>
