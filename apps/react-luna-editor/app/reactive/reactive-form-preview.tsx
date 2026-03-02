'use client'

import config from '@/luna.config'
import { Button } from '../../components/ui/button'
import { Code } from '../../components/ui/code'
import { Form } from 'react-luna-form'
import { action } from '@/app/action'
import { codeAtom } from '@/lib/store'
import { convertCodeToForm } from '@/lib/convert-code'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

export function ReactiveFormPreview() {
  const code = useAtomValue(codeAtom)

  const [values, setValues] = useState<Record<string, unknown>>({})
  const [result, setResult] = useState<{
    message: string
    form: Record<string, unknown>
  } | null>(null)

  // Sync initial values from the form definition whenever the stored JSON changes.
  useEffect(() => {
    const parsed = convertCodeToForm(code)
    setValues((parsed.value as Record<string, unknown>) ?? {})
  }, [code])

  const form = convertCodeToForm(code)

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
