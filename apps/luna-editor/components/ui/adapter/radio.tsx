import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '../radio-group'

export function Radio({
  options = [],
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  options?: Array<{ value: string; label: string }>
}) {
  return (
    <RadioGroup {...props}>
      {options?.map((option, index) => (
        <div className="flex items-center space-x-2" key={index}>
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value} className="font-normal">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
