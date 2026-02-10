<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    children,
    isPending,
  }: {
    children?: Snippet<[{ isPending?: boolean }]>
    isPending?: boolean
  } = $props()
</script>

<div data-slot="field-control" class="w-full">
  {#if children}
    {@render children({ isPending })}
  {/if}
</div>
