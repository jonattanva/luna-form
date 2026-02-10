<script lang="ts">
  import {
    translate,
    VERTICAL,
    type Field,
    type Orientation,
  } from '@luna-form/core'
  import type { Snippet } from 'svelte'
  import type { Config } from '../type.js'
  import FormattedDescription from './FormattedDescription.svelte'
  import InputLabel from './InputLabel.svelte'

  let {
    children,
    config,
    context,
    field,
    orientation,
    translations,
  }: {
    children?: Snippet
    config?: Config
    context?: Record<string, unknown>
    field: Field
    orientation?: Orientation
    translations?: Record<string, string>
  } = $props()
</script>

{#if field.name && field.label}
  <InputLabel {config} {context} {field} {orientation} {translations} />
{/if}

{#if children}
  {@render children()}
{/if}

{#if orientation === VERTICAL && field.description}
  <FormattedDescription text={translate(field.description, translations)} />
{/if}
