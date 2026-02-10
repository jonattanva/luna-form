<script lang="ts">
  import {
    buildAriaAttributes,
    buildCommon,
    buildDataAttributes,
    type AriaAttributes,
    type CommonProps,
    type DataAttributes,
    type Field,
    type Orientation,
  } from '@luna-form/core'
  import type { Snippet } from 'svelte'

  let {
    children,
    disabled,
    errors,
    field,
    orientation,
  }: {
    children: Snippet<
      [
        {
          ariaAttributes: AriaAttributes
          commonProps: CommonProps
          dataAttributes: DataAttributes
          field: Field
          orientation?: Orientation
        },
      ]
    >
    disabled?: boolean
    errors?: string[]
    field: Field
    orientation?: Orientation
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
    orientation,
  })}
{/if}
