<script lang="ts">
  import FormBody from '../../component/Form.svelte'
  import Field from '../../component/field/Field.svelte'
  import { createSlot } from '../../component/slot/slot-create'
  import type { Config, Control, FormStateError } from '../../type'
  import type { Definition, Nullable, Sections, ZodSchema } from '@luna-form/core'

  type FormState<T> = {
    data: Nullable<T>
    error: Nullable<FormStateError>
    success: boolean
  }

  interface Props {
    action?: (
      formData: Record<string, unknown>,
      schema?: ZodSchema
    ) => Promise<FormState<Record<string, unknown>>>
    children?: Control
    config: Config
    context?: Record<string, unknown>
    definition?: Definition
    lang?: string
    onSuccess?: (data: Record<string, unknown>) => void
    onValueChange?: (input: { name: string; value: unknown }) => void
    readOnly?: boolean
    sections: Sections
    translations?: Record<string, Record<string, string>>
    value?: Nullable<Record<string, unknown>>
  }

  let {
    children: controlProp,
    config,
    context,
    definition,
    lang,
    readOnly,
    sections,
    translations: translationsProp,
    value: valueProp,
  }: Props = $props()

  const Slot = createSlot(Field)

  const translations = $derived(translationsProp?.[lang ?? ''])

  // useFormState placeholders
  const action = undefined
  const state: FormState<Record<string, unknown>> = {
    data: null,
    error: null,
    success: true,
  }
  const isPending = false

  const isShowingError = $derived(
    config.validation.showError && !state.success && state.error
  )
  const value = $derived(state.data ?? valueProp)
</script>

{#if isShowingError && config.alert}
  {@const Alert = config.alert}
  <div class="mb-4 w-full">
    <Alert
      description={state.error?.description}
      details={state.error?.details}
      title={state.error!.title}
    />
  </div>
{/if}

<FormBody
  {action}
  {config}
  control={controlProp}
  {definition}
  {isPending}
  noValidate
  readOnly={readOnly}
  {sections}
>
  {#snippet children({ disabled, fields })}
    <Slot {disabled} {fields} style={config.style}>
      {#snippet children(internal)}
        <div
          data-placeholder="Input"
          data-name={internal.field.name}
          data-type={internal.field.type}
          data-context={JSON.stringify(context)}
          data-translations={JSON.stringify(translations)}
          data-value={JSON.stringify(value)}
        ></div>
      {/snippet}
    </Slot>
  {/snippet}
</FormBody>
