'use client'

import {
  Select as Component,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { reportValue, splitAria } from '@/lib/utils'

export function Select({
  id,
  onChange,
  options = [],
  placeholder = 'Select an option',
  ...props
}: React.AriaAttributes & {
  id: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}) {
  // The root renders no element of its own: the name and the error state the
  // form gives go to the button that takes focus.
  const [aria, selectProps] = splitAria(props)
  return (
    <Component onValueChange={reportValue(onChange)} {...selectProps}>
      <SelectTrigger className="w-45" id={id} {...aria}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Component>
  )
}
