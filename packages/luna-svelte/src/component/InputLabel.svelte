<script lang="ts">
  import {
    HORIZONTAL,
    interpolate,
    isInterpolated,
    translate,
  } from '@luna-form/core'
  import FormattedDescription from './FormattedDescription.svelte'
  import Label from './Label.svelte'
  import type { Config } from '../type.js'
  import type { Field, Orientation } from '@luna-form/core'

  let {
    config,
    context,
    field,
    orientation,
    translations,
  }: {
    config?: Config
    context?: Record<string, unknown>
    field: Field
    orientation?: Orientation
    translations?: Record<string, string>
  } = $props()

  const label = $derived(
    isInterpolated(field.label)
      ? interpolate(field.label, {
          context,
          env: config?.env,
        })
      : field.label
  )

  const description = $derived(
    isInterpolated(field.description)
      ? interpolate(field.description, {
          context,
          env: config?.env,
        })
      : field.description
  )
</script>

<div
  data-slot="field-content"
  class="flex w-full flex-1 flex-col gap-1.5 leading-snug"
>
  <Label {field} {translations}>
    {translate(label, translations)}
  </Label>
  {#if orientation === HORIZONTAL}
    <FormattedDescription text={translate(description, translations)} />
  {/if}
</div>
