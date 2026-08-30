# react-luna-form

Build React forms from JSON.

A form is declared as data, not composed as components: a `sections` array of
field descriptors is the single source for what renders **and** for the
[Zod](https://zod.dev) schema that validates it. The same descriptors render on
the server, render on the client, and validate headlessly in a backend.

```json
{
  "sections": [
    {
      "title": "Payment Method",
      "fields": [
        {
          "name": "name",
          "type": "input/text",
          "label": "Name on Card",
          "required": true,
          "validation": { "required": "Enter the name on your card" }
        }
      ]
    }
  ]
}
```

## Installation

```bash
pnpm add react-luna-form
```

The package ships no dependencies of its own. Everything it needs is a peer
dependency, so your application resolves a single copy of React, Zod and the
rest:

| Peer                    | Required version   | Used for                                    |
| ----------------------- | ------------------ | ------------------------------------------- |
| `react`, `react-dom`    | `^19.0.0`          | rendering, and `useActionState` on submit   |
| `zod`                   | `^4.0.0`           | the schema derived from `sections`          |
| `jotai`, `jotai-family` | `^2.0.0`, `^1.0.0` | the form's value, error and source stores   |
| `swr`                   | `^2.0.0`           | fetching a field's remote `source`          |
| `date-fns`              | `^4.0.0`           | date and time formatting, `duration` filter |
| `fast-equals`           | `^6.0.0`           | change detection in the stores              |
| `tailwind-merge`        | `^3.5.0`           | merging the classes the components render   |

None of them is optional. A package manager that installs peers automatically
(npm 7+, or pnpm with `auto-install-peers=true`) brings them in for you;
otherwise install them alongside the library.

## Styling

The components render Tailwind utility classes and **no CSS is shipped in the
bundle**. With [Tailwind CSS v4](https://tailwindcss.com) installed, point it at
the package so the classes inside the published build are generated:

```css
@import 'tailwindcss';

@source '../node_modules/react-luna-form';
```

Without that `@source` line the form renders with the right markup and none of
its layout.

Every element also carries a `data-slot` attribute — `field`, `field-label`,
`field-control`, `field-set`, `field-group`, `field-separator`, `column`,
`list-item-card` — so a design system can restyle the structure without
touching the library.

## Quick start

**1. Register the components that render each field type.** Nothing is bundled:
you pass your own input, select and textarea, so the form looks like the rest of
your product.

```ts
// luna.config.ts
import { defineConfig, defineInput, defineSelect } from 'react-luna-form/config'
import { Input } from './components/ui/input'
import { Select } from './components/ui/select'

export default defineConfig({
  inputs: [defineInput(Input), defineSelect(Select)],
})
```

**2. Render the descriptors.**

```tsx
import config from '@/luna.config'
import form from './form.json'
import { Form } from 'react-luna-form/server'

export default function Page() {
  return <Form {...form} config={config} />
}
```

That is the server form: it renders the fields without client state. For
anything interactive — change events, conditional visibility, remote sources,
submitting through a server action — import `Form` from `react-luna-form`
instead.

**3. Validate the same JSON anywhere.**

```ts
import { buildFormSchema, collectIssues } from 'react-luna-form/schema'

const result = buildFormSchema(sections).safeParse(payload)
if (!result.success) {
  const issues = collectIssues(result.error)
}
```

## Entry points

| Import                   | Contains                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| `react-luna-form`        | `Form` (client), `withDeclaredFields`                                     |
| `react-luna-form/server` | `Form` (server) and `Fallback`, usable under the `react-server` condition |
| `react-luna-form/config` | `defineConfig` and the `define*` registration helpers                     |
| `react-luna-form/schema` | `buildFormSchema` and `collectIssues`, with no React dependency           |

## Documentation

The JSON contract is documented in full under [`docs/`](docs/index.md), which
ships inside the published package: the copy you read is the one that describes
the version you installed, at `node_modules/react-luna-form/docs/`.

Start at [docs/setup.md](docs/setup.md) to wire a form up, then read the page
for whatever you are declaring — [fields](docs/fields/input.md),
[validation](docs/validation/overview.md),
[change events](docs/events/change.md).

## License

Apache-2.0
