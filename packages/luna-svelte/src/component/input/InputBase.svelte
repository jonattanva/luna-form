<script lang="ts">
  import {
    buildAriaAttributes,
    buildCommon,
    buildDataAttributes,
    type AriaAttributes,
    type CommonProps,
    type DataAttributes,
    type Field,
  } from '@luna-form/core'
  import type { Snippet } from 'svelte'

  let {
    children,
    disabled,
    errors,
    field,
    horizontal,
  }: {
    children: Snippet<
      [
        {
          ariaAttributes: AriaAttributes
          commonProps: CommonProps
          dataAttributes: DataAttributes
          field: Field
          horizontal?: boolean
        },
      ]
    >
    disabled?: boolean
    errors?: string[]
    field: Field
    horizontal?: boolean
  } = $props()

  const commonProps = $derived(buildCommon(field, disabled))
  const dataAttributes = $derived(buildDataAttributes(field))
  const ariaAttributes = $derived(buildAriaAttributes(field, errors))

  const derivedField = $derived({
    ...field,
    disabled: commonProps.disabled,
  })
</script>

{#if field.type}
  {@render children({
    ariaAttributes,
    commonProps,
    dataAttributes,
    field: derivedField,
    horizontal,
  })}
{/if}
