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

  function handleSuccess(response: {
    message: string
    form: Record<string, unknown>
  }) {
    toast.success(response.message, {
      icon: null,
      description: (
        <pre className="mt-1.5 w-full overflow-auto rounded-md p-4 text-xs">
          <code className="text-gray-900">
            {JSON.stringify(response.form, null, 2)}
          </code>
        </pre>
      ),
      duration: 5000,
    })
  }

  function handleError(error: {
    message: string
    detail: Record<string, string[]> | string[]
  }) {
    let description = ''

    if (Array.isArray(error.detail)) {
      description = error.detail.join(', ')
    } else if (error.detail) {
      description = Object.entries(error.detail)
        .map(([key, value]) => `${key}: ${value.join(', ')}`)
        .join('; ')
    }

    toast.error(error.message, {
      icon: null,
      description: (
        <div className="mt-1.5 text-xs text-gray-900">{description}</div>
      ),
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
