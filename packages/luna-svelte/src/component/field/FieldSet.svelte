<script lang="ts">
  import Group from '../Group.svelte'
  import Legend from '../Legend.svelte'
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
</script>

{#if !section.title && !section.description}
  <Group {compact}>
    {#if children}
      {@render children()}
    {/if}
  </Group>
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
