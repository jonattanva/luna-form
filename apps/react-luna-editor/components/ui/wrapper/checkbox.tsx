import { Checkbox as Component } from '../checkbox'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { reportValue } from '@/lib/utils'

export function Checkbox({
  onChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return <Component {...props} onCheckedChange={reportValue(onChange)} />
}
