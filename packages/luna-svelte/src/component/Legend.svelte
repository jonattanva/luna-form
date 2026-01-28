<script lang="ts">
  import { formatMarkdown } from '../lib/string'

  let {
    title,
    description,
  }: {
    title?: string
    description?: string
  } = $props()
</script>

{#if title}
  <legend class="mb-3 font-medium text-slate-800 dark:text-slate-200">
    {#each formatMarkdown(title) as part}
      {#if typeof part === 'string'}
        {part}
      {:else}
        <a
          class="underline"
          href={part.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {part.text}
        </a>
      {/if}
    {/each}
  </legend>
{/if}
{#if description}
  <p
    class="-mt-2 text-sm leading-normal font-normal text-slate-600 dark:text-slate-400"
  >
    {#each formatMarkdown(description) as part}
      {#if typeof part === 'string'}
        {part}
      {:else}
        <a
          class="underline"
          href={part.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {part.text}
        </a>
      {/if}
    {/each}
  </p>
{/if}
