<script lang="ts">
  import { formatMarkdown } from '../lib/string.js'
  import Description from './Description.svelte'

  let {
    text,
  }: {
    text?: string
  } = $props()
</script>

{#if text}
  <Description>
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
  </Description>
{/if}
