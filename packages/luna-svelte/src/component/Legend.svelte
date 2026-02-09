<script lang="ts">
  import { formatMarkdown } from '../lib/string.js'

  let {
    description,
    title,
  }: {
    description?: string
    title?: string
  } = $props()
</script>

{#snippet renderMarkdown(text: string)}
  {#each formatMarkdown(text) as part, index (index)}
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
{/snippet}

{#if title}
  <legend class="mb-3 font-medium text-slate-800 dark:text-slate-200">
    {@render renderMarkdown(title)}
  </legend>
{/if}

{#if description}
  <p class="-mt-2 text-sm leading-normal font-normal text-slate-600 dark:text-slate-400">
    {@render renderMarkdown(description)}
  </p>
{/if}
