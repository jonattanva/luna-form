<script lang="ts">
  import { translate, type Field } from '@luna-form/core'
  import FormattedDescription from './FormattedDescription.svelte'
  import InputLabel from './InputLabel.svelte'
  import type { Config } from '../type.js'
  import type { Snippet } from 'svelte'

  let {
    children,
    config,
    context,
    field,
    horizontal,
    translations,
  }: {
    children?: Snippet
    config?: Config
    context?: Record<string, unknown>
    field: Field
    horizontal?: boolean
    translations?: Record<string, string>
  } = $props()
</script>

{#if field.name && field.label}
  <InputLabel {config} {context} {field} {horizontal} {translations} />
{/if}

{#if children}
  {@render children()}
{/if}

{#if !horizontal && field.description}
  <FormattedDescription text={translate(field.description, translations)} />
{/if}
