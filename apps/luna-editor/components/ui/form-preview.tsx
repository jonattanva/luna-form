'use client'

import config from '@/luna.config'
import { Form } from 'react-luna-form'
import { codeAtom } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { useAtomValue } from 'jotai'

export function FormPreview() {
  const code = useAtomValue(codeAtom)
  const form = convertCodeToForm(code)

  return (
    <div className="flex h-full flex-1 flex-col items-stretch">
      <div className="flex min-h-full items-center justify-center">
        <div className="flex min-h-full w-full max-w-3xl flex-col items-center justify-between">
          <div className="w-full max-w-md pt-12">
            <Form {...form} config={config} />
          </div>
        </div>
      </div>
    </div>
  )
}
