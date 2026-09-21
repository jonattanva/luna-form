import config from '@/luna.config'
import { Form } from 'react-luna-form/server'

// A Server Component renders the form: nothing above this says "use client", so
// Next resolves `react-luna-form/server` under the `react-server` condition --
// the one the README offers that entry for, and the one it stopped loading
// under. The fields below are what `tests/e2e/server-entry.spec.ts` reads back.
const sections = [
  {
    title: 'Server rendered',
    description: 'Rendered on the server, before any JavaScript runs.',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'input/text',
        description: 'The name this form was given.',
      },
      {
        label: 'Email',
        name: 'email',
        type: 'input/email',
        required: true,
      },
    ],
  },
]

export default function ServerPage() {
  return (
    <div className="flex h-full w-full items-start justify-center overflow-auto">
      <div className="w-full max-w-md p-8">
        <Form config={config} sections={sections} />
      </div>
    </div>
  )
}
