'use client'

import config from '@/luna.config'
import { Button } from './button'
import { Code } from './code'
import { Form } from 'react-luna-form'
import { action } from '@/app/action'
import { codeAtom } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { lazyComponent } from './wrapper/lazy'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

// The toasts, which this page alone raises, and only once a submit succeeds.
// Mounted from the root layout, sonner was part of every page from the first
// byte. Here it is fetched once someone starts filling the form in, and the
// `Toaster` mounts with the first toast. Raising one before it has mounted
// loses nothing: sonner replays the active toasts to a `Toaster` that
// subscribes late.
const Toaster = lazyComponent(() =>
  import('./sonner').then((mod) => mod.Toaster)
)

export function FormPreview() {
  const code = useAtomValue(codeAtom)
  const form = convertCodeToForm(code)
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

  function handleValueChange(input: { name: string; value: unknown }) {
    console.log('Form values changed:', input)
    void Toaster.preload()
  }

  return (
    <div className="flex h-full flex-1 flex-col items-stretch overflow-x-hidden overflow-y-auto">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md p-6">
          <div className="flex w-full flex-col gap-6">
            <Form
              {...form}
              config={config}
              action={action}
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
          </div>
        </div>
      </div>
      {notified && <Toaster />}
    </div>
  )
}
