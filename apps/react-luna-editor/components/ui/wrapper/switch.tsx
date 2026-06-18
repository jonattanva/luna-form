import { Switch as Component } from '../switch'
import { Switch as SwitchPrimitive } from 'radix-ui'

export function Switch({
  onChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
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
