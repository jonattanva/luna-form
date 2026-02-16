<script lang="ts">
  import ChevronIcon from '../ChevronIcon.svelte'
  import Group from '../Group.svelte'
  import Legend from '../Legend.svelte'
  import { formatMarkdown } from '../../lib/string.js'
  import { mergeStyle, type Section, type Style } from '@luna-form/core'
  import type { Snippet } from 'svelte'

  let {
    children,
    section,
    style,
  }: {
    children?: Snippet
    section: Section
    style?: Style
  } = $props()

  const fields = $derived(section.fields || [])

  const mergedStyle = $derived(
    mergeStyle(style, {
      compact: section.compact,
    })
  )

  const compact = $derived(mergedStyle.compact)

  let isOpen = $state(false)
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

{#if !section.title && !section.description}
  <Group {compact}>
    {#if children}
      {@render children()}
    {/if}
  </Group>
{:else if section.advanced}
  <fieldset
    data-slot="field-set"
    data-advanced="true"
    data-expanded={isOpen}
    data-empty={fields.length === 0}
    class="flex flex-col"
    id={section.id?.toString()}
  >
    <legend>
      <button
        type="button"
        onclick={() => (isOpen = !isOpen)}
        class="flex cursor-pointer items-center gap-2 text-base font-medium text-slate-600 dark:text-slate-400"
      >
        <ChevronIcon expanded={isOpen} />
        <span
          >{#if section.title}{@render renderMarkdown(section.title)}{/if}</span
        >
      </button>
    </legend>
    <div
      class="mt-3 flex flex-col gap-4 border-l-2 border-slate-300 pl-4 dark:border-slate-600"
      data-slot="field-set-content"
      hidden={!isOpen}
    >
      {#if section.description}
        <p
          class="text-sm leading-normal font-normal text-slate-600 dark:text-slate-400"
        >
          {@render renderMarkdown(section.description)}
        </p>
      {/if}
      <Group {compact}>
        {#if children}
          {@render children()}
        {/if}
      </Group>
    </div>
  </fieldset>
{:else}
  <fieldset
    data-slot="field-set"
    data-empty={fields.length === 0}
    class="flex flex-col data-[empty=false]:gap-6"
    id={section.id?.toString()}
  >
    <Legend description={section.description} title={section.title} />
    <Group {compact}>
      {#if children}
        {@render children()}
      {/if}
    </Group>
  </fieldset>
{/if}
