<script lang="ts">
  import type { Nullable } from '@luna-form/core'

  let {
    errors,
    name,
  }: {
    errors?: Nullable<string[]>
    name?: string
  } = $props()
</script>

{#if errors && errors.length > 0}
  <ul
    class="text-sm text-red-600 dark:text-red-500"
    id={name ? `${name}-error` : undefined}
  >
    {#each errors as error, index (name ? `${name}-error-${index}` : index)}
      <li>
        {error}
      </li>
    {/each}
  </ul>
{/if}
