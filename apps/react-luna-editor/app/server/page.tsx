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
      {
        label: 'Code',
        name: 'code',
        type: 'input/text',
        disabled: true,
      },
      {
        // `advanced.data` names the same attribute the form writes for the
        // format; the form's value has to win on the server too.
        label: 'Check-in',
        name: 'check_in',
        type: 'input/date',
        advanced: { format: 'dd/MM/yyyy', data: { format: 'yyyy' } },
      },
      {
        // The zone suggested and the instant the zones and the description
        // are given for come from the context below, not from this process.
        label: 'Time zone',
        name: 'zone',
        type: 'select/timezone',
        description: 'Renews {context.renewal | date:relative}',
        advanced: { suggested: { $ref: '#/context/zone' } },
      },
    ],
  },
]

const context = {
  now: '2026-01-15T12:00:00Z',
  renewal: '2026-01-22T12:00:00Z',
  zone: 'America/Bogota',
}

export default function ServerPage() {
  return (
    <div className="flex h-full w-full items-start justify-center overflow-auto">
      <div className="w-full max-w-md p-8">
        <Form config={config} context={context} sections={sections} />
      </div>
    </div>
  )
}
