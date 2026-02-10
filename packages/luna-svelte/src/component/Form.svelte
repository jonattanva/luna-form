<script lang="ts">
  import Control from './Control.svelte'
  import FieldSet from './field/FieldSet.svelte'
  import Group from './Group.svelte'
  import Separator from './Separator.svelte'
  import { prepare, type Definition, type Sections } from '@luna-form/core'
  import type { Config, Control as ControlType, Slot } from '../type'

  let {
    action,
    children,
    config,
    control,
    definition,
    isPending,
    noValidate,
    readOnly,
    sections: sectionsProp,
  }: {
    action?: string | ((formData: FormData) => void)
    children: Slot
    config: Config
    control?: ControlType
    definition?: Definition
    isPending?: boolean
    noValidate?: boolean
    readOnly?: boolean
    sections: Sections
  } = $props()

  const sections = $derived(prepare(sectionsProp, definition))

  function handleAction(event: SubmitEvent) {
    if (typeof action === 'function') {
      event.preventDefault()
      action(new FormData(event.currentTarget as HTMLFormElement))
    }
  }
</script>

<div class="h-full w-full">
  <form
    novalidate={noValidate}
    action={typeof action === 'string' ? action : undefined}
    onsubmit={handleAction}
  >
    <Group>
      {#each sections as section, index (section.id ?? index)}
        <FieldSet {section} style={config.style}>
          {@render children({
            disabled: readOnly,
            fields: section.fields,
          })}
        </FieldSet>
        {#if section.separator}
          <Separator />
        {/if}
      {/each}
      {#if control}
        <Control {isPending} children={control} />
      {/if}
    </Group>
  </form>
</div>
