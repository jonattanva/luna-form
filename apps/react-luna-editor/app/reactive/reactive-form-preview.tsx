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

  function handleValueChange(input: { name: string; value: unknown }) {
    console.log('Form values changed:', input)
    setValues((prev) => ({ ...prev, [input.name]: input.value }))
  }

  // A host putting its own state back the way it was, which is the one thing
  // this page could not do before: everything else here only ever adds to
  // `values`. What the form does with a value that lost a field is only
  // observable from the outside, so it needs someone outside to lose one.
  function handleReset() {
    setValues((form.value as Record<string, unknown>) ?? {})
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
          <div className="flex w-full justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset values
            </Button>
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </div>
        )}
      </Form>
    </div>
  )
}
