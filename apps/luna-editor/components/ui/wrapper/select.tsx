import {
  Select as Adapter,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Select({
  ...props
}: {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}) {
  const {
    onChange,
    options = [],
    placeholder = 'Select an option',
    ...selectProps
  } = props

  function handleValueChange(value: string) {
    if (onChange) {
      const event = {
        target: { value },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(event)
    }
  }

  return (
    <Adapter onValueChange={handleValueChange} {...selectProps}>
      <SelectTrigger className="w-45">
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
    </Adapter>
  )
}
