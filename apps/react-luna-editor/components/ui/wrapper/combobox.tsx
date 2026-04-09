'use client'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxSeparator,
} from '@/components/ui/combobox'

type OptionItem = { value: string; label: string }
type OptionGroup = { label: string; items: OptionItem[] }

export function ComboboxWithGroup({
  onChange,
  options = [],
  placeholder = 'Select an option',
  value,
  ...selectProps
}: {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  options?: OptionGroup[]
  placeholder?: string
  value?: string | null
}) {
  function getLabel(val: string | null): string | null {
    if (!val) return null
    for (const group of options) {
      const found = group.items.find((item) => item.value === val)
      if (found) return found.label
    }
    return null
  }

  function getValue(label: string | null): string | null {
    if (!label) return null
    for (const group of options) {
      const found = group.items.find((item) => item.label === label)
      if (found) return found.value
    }
    return null
  }

  function handleValueChange(label: string | null) {
    if (onChange) {
      const event = {
        target: { value: getValue(label) },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(event)
    }
  }

  return (
    <Combobox
      items={options}
      value={getLabel(value ?? null)}
      onValueChange={handleValueChange}
      {...selectProps}
    >
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>No options found.</ComboboxEmpty>
        <ComboboxList>
          {(group: OptionGroup, index: number) => (
            <ComboboxGroup key={group.label} items={group.items}>
              <ComboboxLabel>{group.label}</ComboboxLabel>
              <ComboboxCollection>
                {(item: OptionItem) => (
                  <ComboboxItem key={item.value} value={item.label}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              {index < options.length - 1 && <ComboboxSeparator />}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
