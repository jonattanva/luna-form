import {
  Select as Component,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Select({
  id,
  onChange,
  options = [],
  placeholder = 'Select an option',
  ...selectProps
}: {
  id: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}) {
  function handleValueChange(value: string) {
    if (onChange) {
      const event = {
        target: { value },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(event)
    }
  }

  return (
    <Component onValueChange={handleValueChange} {...selectProps}>
      <SelectTrigger className="w-45" id={id}>
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
