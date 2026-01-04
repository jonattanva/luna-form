'use client'

import config from '@/luna.config'
import { Button } from './button'
import { Form } from 'react-luna-form'
import { codeAtom } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { useAtomValue } from 'jotai'

export function FormPreview() {
  const code = useAtomValue(codeAtom)
  const form = convertCodeToForm(code)

  return (
    <div className="flex h-full flex-1 flex-col items-stretch overflow-y-auto">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md p-6">
          <Form {...form} config={config}>
            <div className="flex w-full justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
