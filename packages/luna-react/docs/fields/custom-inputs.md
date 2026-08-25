# Custom Inputs

A field `type` that this library does not ship can be implemented by the host
application and registered under its own name. This is how a form gets a people
picker, a credential selector, or any control that only makes sense inside one
product.

## Registering

```ts
import {
  defineConfig,
  defineCustomInput,
  defineInput,
} from 'react-luna-form/config'
import { PeoplePicker } from './components/people-picker'

export default defineConfig({
  inputs: [
    defineInput(Input),
    defineCustomInput('people/picker', PeoplePicker),
  ],
})
```

`defineCustomInput(types, component)` takes one name or an array of names. Every
name becomes a key in `config.inputs`.

**The lookup is an exact string match.** There is no prefix resolution: naming a
field `people/picker` does not fall back to `people`, and naming it
`select/mine` does not fall back to `select`. `defineConfig` writes one entry per
registered string, and rendering reads `config.inputs[field.type]` directly.

**A type nothing registers renders nothing at all.** The lookup returns
`undefined`, the field is skipped, and the form renders without it — on the
server and on the client alike. There is no error, no warning and no
placeholder, so a typo in a `type` looks exactly like a field somebody chose not
to include. Check the spelling against your `defineConfig` when a field does not
appear.

## What your component receives

Props are applied in this order:

```tsx
<Component
  {...commonProps} // id, name, placeholder, disabled, required
  {...ariaAttributes} // aria-invalid, aria-errormessage
  {...dataAttributes} // data-invalid, data-readonly
  {...extraProps} // whatever the field family adds
  {...inputProps} // the prepared value or defaultValue
  onBlur={onBlur}
  onChange={onChange}
/>
```

`onChange` and `onBlur` are applied **last**, after every spread. A component
that forwards its props unchanged gets them for free. A component that declares
its own handlers must call the ones it received, or the form never learns the
value changed: validation will not run, and neither will any `change` event the
field declares.

## Forwarding `id` is what gives the field its name

The label is rendered by this library, outside your component, as
`<label htmlFor={field.name}>`. The matching `id` arrives in your props.

If your component does not put that `id` on the element the user actually
focuses, the label points at nothing. The field still works with a mouse, so
nothing looks broken — but it has no accessible name, screen readers announce it
as unlabelled, and a test that reaches fields by their label cannot find it.

```tsx
// Correct: the id reaches the real input.
function PeoplePicker({ ...props }: React.ComponentProps<'input'>) {
  return <input {...props} />
}

// Wrong: the id lands on a wrapper the label does not point to.
function PeoplePicker({ id, ...props }: React.ComponentProps<'input'>) {
  return (
    <div id={id}>
      <input {...props} />
    </div>
  )
}
```

The same applies when you build on a component library: whatever primitive
renders the focusable element is where the `id` belongs.

## Clearing a value on a select-family type

If you register a custom input under a `select` variant, be aware that an
`onChange('')` is **discarded**, not applied. Radix and similar components
re-emit `onChange("")` when a trigger remounts, and an empty string is never a
real selection, so the library drops it rather than wipe a value the user
already chose.

The consequence for a custom input: emitting an empty string to clear the field
does nothing. Emit a sentinel value your own code recognises, and translate it
back where you read the form.

This applies only to select-family fields. Text fields pass an empty string
through unchanged.

## Change events are debounced on text fields

For `input/*` and `textarea`, a declared `change` event fires 300 ms after the
last keystroke, not on every one. If you are testing a custom text input that
triggers a change event, wait for that window rather than asserting immediately.

Select-family fields dispatch straight away.

## Server and client

The same registered component is used by both render paths. If your custom
input needs browser APIs, state or effects, mark it `'use client'` as you would
any other component — the library does not do it for you.

## Checklist

Before shipping a custom input:

- Its `type` string matches `defineCustomInput` exactly, character for character
- The `id` it receives reaches the focusable element
- It forwards or calls the `onChange` and `onBlur` it receives
- If it is a select variant, it does not rely on `''` to clear
