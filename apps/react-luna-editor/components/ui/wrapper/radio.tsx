import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { RadioGroup, RadioGroupItem } from '../radio-group'
import { Field, FieldContent, FieldDescription, FieldLabel } from '../field'
import { reportValue } from '@/lib/utils'

export function Radio({
  onChange,
  options = [],
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  options?: Array<{ value: string; label: string; description?: string }>
}) {
  return (
    <RadioGroup {...props} onValueChange={reportValue(onChange)}>
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
