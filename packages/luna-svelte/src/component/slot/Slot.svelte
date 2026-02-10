<script lang="ts">
  import Field from '../field/Field.svelte'
  import Column from '../Column.svelte'
  import SlotBase from './SlotBase.svelte'
  import type { Fields, Style } from '@luna-form/core'
  import type { Children } from '../../type'

  let {
    children,
    disabled,
    fields,
    style,
  }: {
    children: Children
    disabled?: boolean
    fields?: Fields
    style?: Style
  } = $props()
</script>

<SlotBase
  {children}
  {disabled}
  {fields}
  {style}
  components={{ column: Column, field: Field }}
/>
