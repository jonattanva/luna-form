'use client'

import config from '@/luna.config'
import { Button } from './button'
import { Code } from './code'
import { Form, type AgentOptions, type ValueChange } from 'react-luna-form'
import { action } from '@/app/action'
import { useDefinition } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { lazyComponent } from './wrapper/lazy'
import { useMemo, useState } from 'react'

// The toasts, which this page alone raises, and only once a submit succeeds.
// Mounted from the root layout, sonner was part of every page from the first
// byte. Here it is fetched once someone starts filling the form in, and the
// `Toaster` mounts with the first toast. Raising one before it has mounted
// loses nothing: sonner replays the active toasts to a `Toaster` that
// subscribes late.
const Toaster = lazyComponent(() =>
  import('./sonner').then((mod) => mod.Toaster)
)

// The preview offered to an agent, for it to try a form it wrote with the
// editor's own tools: filling and reading it, never sending it.
const AGENT: AgentOptions = {
  description:
    'The form the luna editor previews. Filling it changes nothing outside this page.',
  name: 'preview',
}

export function FormPreview() {
  const { code, read } = useDefinition()
  // Parsed once per text: the form's tools compare what it is handed by
  // identity, and a render that changes nothing else would build them again.
  const form = useMemo(() => convertCodeToForm(code), [code])
  const [notified, setNotified] = useState(false)

  function handleSuccess(response: {
    message: string
    form: Record<string, unknown>
  }) {
    setNotified(true)
    void import('sonner').then(({ toast }) => {
      toast(response.message, {
        description: <Code response={response.form} />,
        duration: 5000,
      })
    })
  }

  function handleValueChange(input: ValueChange) {
    console.log('Form values changed:', input)
    void Toaster.preload()
  }

  return (
    <div className="flex h-full flex-1 flex-col items-stretch overflow-x-hidden overflow-y-auto">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md p-6">
          <div className="flex w-full flex-col gap-6">
            {read && (
              <Form
                {...form}
                config={config}
                action={action}
                agent={AGENT}
                onSuccess={handleSuccess}
                onValueChange={handleValueChange}
              >
                {({ isPending }) => (
                  <div className="flex w-full justify-end">
                    <Button type="submit" disabled={isPending}>
                      Submit
                    </Button>
                  </div>
                )}
              </Form>
            )}
          </div>
        </div>
      </div>
      {notified && <Toaster />}
    </div>
  )
}
