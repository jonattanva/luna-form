import { Activity } from 'react'
import { KeepValueContext } from '../client/context/keep-value-context'

export function Collapsible({
  children,
  visible,
}: Readonly<{
  children: React.ReactNode
  visible?: boolean
}>) {
  return (
    <Activity mode={visible ? 'visible' : 'hidden'}>
      <KeepValueContext value={true}>{children}</KeepValueContext>
    </Activity>
  )
}
