<script lang="ts">
  import { formatMarkdown } from '../lib/string.js'

  let {
    description,
    step,
    title,
  }: {
    description?: string
    step?: number
    title?: string
  } = $props()
</script>

{#snippet content()}
  <div class="flex flex-col">
    {#if title}
      <legend class="mb-3 font-medium text-slate-800 dark:text-slate-200">
        {@render renderMarkdown(title)}
      </legend>
    {/if}

    {#if description}
      <p
        class="-mt-2 text-sm leading-normal font-normal text-slate-600 dark:text-slate-400"
      >
        {@render renderMarkdown(description)}
      </p>
    {/if}
  </div>
{/snippet}

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

{#if step}
  <div class="flex flex-row items-start gap-4">
    <div
      class="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
    >
      <span class="text-lg font-bold">{step}</span>
    </div>
    {@render content()}
  </div>
{:else}
  {@render content()}
{/if}
