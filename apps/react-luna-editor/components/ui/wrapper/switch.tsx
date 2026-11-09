import { Switch as Component } from '../switch'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { reportValue } from '@/lib/utils'

export function Switch({
  onChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return <Component {...props} onCheckedChange={reportValue(onChange)} />
}
