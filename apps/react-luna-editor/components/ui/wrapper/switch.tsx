import { Switch as Component } from '../switch'
import * as CheckboxPrimitive from '@radix-ui/react-switch'

export function Switch({
  onChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  function handleCheckedChange(value: boolean | 'indeterminate') {
    if (onChange) {
      const event = {
        target: { value },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(event)
    }
  }

  return <Component {...props} onCheckedChange={handleCheckedChange} />
}
