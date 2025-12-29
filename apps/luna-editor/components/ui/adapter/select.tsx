import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SelectAdapter({
  ...props
}: {
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}) {
  const {
    onBlur,
    options = [],
    placeholder = 'Select an option',
    ...selectProps
  } = props

  return (
    <Select {...selectProps}>
      <SelectTrigger className="w-45" onBlur={onBlur}>
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
    </Select>
  )
}
