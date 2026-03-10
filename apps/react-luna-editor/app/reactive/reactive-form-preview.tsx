'use client'

import config from '@/luna.config'
import { Button } from '../../components/ui/button'
import { Code } from '../../components/ui/code'
import { Form } from 'react-luna-form'
import { action } from '@/app/action'
import { codeAtom } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

export function ReactiveFormPreview() {
  const code = useAtomValue(codeAtom)

  const [result, setResult] = useState<{
    message: string
    form: Record<string, unknown>
  } | null>(null)

  const form = convertCodeToForm(code)

  const [values, setValues] = useState<Record<string, unknown>>(
    () => (form.value as Record<string, unknown>) ?? {}
  )

  const [prevCode, setPrevCode] = useState(code)
  if (code !== prevCode) {
    setPrevCode(code)
    setValues((form.value as Record<string, unknown>) ?? {})
  }

  function handleValueChange({
    name,
    value,
  }: {
    name: string
    value: unknown
  }) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSuccess(response: {
    message: string
    form: Record<string, unknown>
  }) {
    setResult(response)
  }

  return (
    <div className="w-full max-w-md p-6">
      {result && (
        <div className="mb-4">
          <p>{result.message}</p>
          <Code response={result.form} />
        </div>
      )}
      <Form
        {...form}
        value={values}
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
  )
}
