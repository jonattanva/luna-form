'use client'

import config from '@/luna.config'
import { Button } from './button'
import { Code } from './code'
import { Form } from 'react-luna-form'
import { action } from '@/app/action'
import { codeAtom } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { toast } from 'sonner'
import { useAtomValue } from 'jotai'

export function FormPreview() {
  const code = useAtomValue(codeAtom)
  const form = convertCodeToForm(code)

  function handleSuccess(response: {
    message: string
    form: Record<string, unknown>
  }) {
    toast(response.message, {
      description: <Code response={response.form} />,
      duration: 5000,
    })
  }

  return (
    <div className="flex h-full flex-1 flex-col items-stretch overflow-y-auto">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md p-6">
          <Form
            {...form}
            config={config}
            action={action}
            onSuccess={handleSuccess}
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
  )
}
