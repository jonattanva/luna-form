'use client'

import config from '@/luna.config'
import { Button } from './button'
import { Form } from 'react-luna-form'
import { action } from '@/app/action'
import { codeAtom } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { toast } from 'sonner'
import { useAtomValue } from 'jotai'

export function FormPreview() {
  const code = useAtomValue(codeAtom)
  const form = convertCodeToForm(code)

  function handleSuccess(response: { message: string }) {
    toast.success(response.message, {
      description: 'Your form has been processed.',
      duration: 4000,
    })
  }

  function handleError(error: {
    message: string
    detail: Record<string, string[]> | string[]
  }) {
    let description = ''

    if (Array.isArray(error.detail)) {
      description = error.detail.join(', ')
    } else {
      description = Object.entries(error.detail)
        .map(([key, value]) => `${key}: ${value.join(', ')}`)
        .join('; ')
    }

    toast.error(error.message, {
      description,
      duration: 8000,
    })
  }

  return (
    <div className="flex h-full flex-1 flex-col items-stretch overflow-y-auto">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md p-6">
          <Form
            {...form}
            action={action}
            config={config}
            onError={handleError}
            onSuccess={handleSuccess}
          >
            <div className="flex w-full justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
