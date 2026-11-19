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
import { reportValue, splitAria } from '@/lib/utils'

type OptionItem = { value: string; label: string }
type OptionGroup = { label: string; items: OptionItem[] }

// Two options are the same when their values are: the list is built again
// when what labels it changes (the instant, the suggested zone), and the
// option held may come from the list before.
function isSameItem(item: OptionItem, selected: OptionItem) {
  return item.value === selected.value
}

function toLabel(item: OptionItem) {
  return item.label
}

function toValue(item: OptionItem) {
  return item.value
}

export function ComboboxWithGroup({
  onChange,
  options = [],
  placeholder = 'Select an option',
  value,
  ...props
}: React.AriaAttributes & {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  options?: OptionGroup[]
  placeholder?: string
  value?: string | null
}) {
  // The combobox holds the option itself, which it shows by its label and
  // submits by its value. It used to hold the label, and the input it keeps
  // for the form under the field's `name` then sent the city ("New York")
  // where the field holds the zone ("America/New_York").
  function findItem(val: string | null): OptionItem | null {
    if (!val) return null
    for (const group of options) {
      const found = group.items.find((item) => item.value === val)
      if (found) return found
    }
    return null
  }

  // The name and the error state the form gives go to the input that takes
  // focus, not to the root.
  const [aria, selectProps] = splitAria(props)
  const report = reportValue(onChange)

  function handleValueChange(item: OptionItem | null) {
    report(item?.value ?? null)
  }

  return (
    <Combobox
      items={options}
      value={findItem(value ?? null)}
      onValueChange={handleValueChange}
      isItemEqualToValue={isSameItem}
      itemToStringLabel={toLabel}
      itemToStringValue={toValue}
      {...selectProps}
    >
      <ComboboxInput placeholder={placeholder} {...aria} />
      <ComboboxContent>
        <ComboboxEmpty>No options found.</ComboboxEmpty>
        <ComboboxList>
          {(group: OptionGroup, index: number) => (
            <ComboboxGroup key={group.label} items={group.items}>
              <ComboboxLabel>{group.label}</ComboboxLabel>
              <ComboboxCollection>
                {(item: OptionItem) => (
                  <ComboboxItem key={item.value} value={item}>
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
