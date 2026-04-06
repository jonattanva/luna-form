import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { RadioGroup, RadioGroupItem } from '../radio-group'
import { Field, FieldContent, FieldDescription, FieldLabel } from '../field'

export function Radio({
  onChange,
  options = [],
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  options?: Array<{ value: string; label: string; description?: string }>
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
    <RadioGroup {...props} onValueChange={handleValueChange}>
      {options?.map((option, index) => (
        <Field orientation="horizontal" key={index}>
          <RadioGroupItem value={option.value} id={option.value} />
          <FieldContent>
            <FieldLabel htmlFor={option.value}>{option.label}</FieldLabel>
            <FieldDescription>{option.description}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  )
}
