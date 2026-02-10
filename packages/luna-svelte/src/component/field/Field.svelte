<script lang="ts">
  import {
    buildDisabled,
    buildOrientation,
    getSpan,
    mergeStyle,
    type Field as FieldType,
    type Style,
  } from '@luna-form/core'
  import { twMerge } from 'tailwind-merge'
  import FieldError from './FieldError.svelte'
  import FieldGroup from './FieldGroup.svelte'
  import InputBase from '../input/InputBase.svelte'
  import type { Snippet } from 'svelte'
  import type {
    AriaAttributes,
    CommonProps,
    DataAttributes,
    Orientation,
  } from '@luna-form/core'

  type ChildrenSnippet = Snippet<
    [
      {
        ariaAttributes: AriaAttributes
        commonProps: CommonProps
        dataAttributes: DataAttributes
        field: FieldType
        orientation?: Orientation
      },
    ]
  >

  let {
    children,
    disabled,
    errors,
    field,
    style,
  }: {
    children: ChildrenSnippet
    disabled?: boolean
    errors?: Record<string, string[]>
    field: FieldType
    style?: Style
  } = $props()

  const cols = $derived(field.advanced?.cols)
  const fieldErrors = $derived(field.name ? errors?.[field.name] : undefined)

  const mergedStyle = $derived(
    mergeStyle(style, {
      orientation: buildOrientation(field),
    })
  )

  const orientation = $derived(mergedStyle.orientation)
  const derivedDisabled = $derived(buildDisabled(field, disabled))
</script>

<div class={twMerge('flex flex-col gap-3', getSpan(cols))}>
  <FieldGroup
    disabled={derivedDisabled}
    errors={fieldErrors}
    {field}
    {orientation}
  >
    <InputBase
      disabled={derivedDisabled}
      errors={fieldErrors}
      {field}
      {orientation}
      {children}
    />
  </FieldGroup>
  <FieldError errors={fieldErrors} name={field.name} />
</div>
