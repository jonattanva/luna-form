# Submitting

What happens between the user pressing the button and your code receiving an
object. This page is about the client `Form` — the server one renders fields and
has no submit path of its own.

## Nothing submits without a control

The library renders no button. Whatever you pass as `children` becomes the
form's control area:

```tsx
<Form sections={sections} config={config} action={save}>
  {({ isPending }) => (
    <button type="submit" disabled={isPending}>
      {isPending ? 'Saving…' : 'Save'}
    </button>
  )}
</Form>
```

A plain node works as well; the function form is what gets `isPending`, which is
true from the moment the action starts until it settles.

## The pipeline

On submit, in this order:

1. **The form data becomes an object.** A name that appears more than once
   arrives as an array; everything else as a single value.
2. **Date fields are normalized.** A date input holds its value in the display
   format the field declares, and it is converted back to a native date before
   validation, so the schema and your action see one shape whatever
   `advanced.format` says.
3. **It is validated** against the schema built from the fields that are
   currently mounted.
4. **Dotted names are un-flattened.** `basicAuth.username` becomes
   `{ basicAuth: { username } }`, and a numeric segment becomes an array index,
   so `rules.0.value` rebuilds the list — with the gaps of removed rows closed
   up.
5. **Your `action` is awaited** with that object and the schema.
6. **`onSuccess` is called** with what the action returned, and the form clears
   itself.

## Only mounted fields are validated

The client schema is assembled from the fields on screen. A field hidden by a
[`state` action](../events/change.md#2-state-action-stateevent) is unmounted, so
it is absent from the schema and from the submitted object — which is the point:
a rule that does not apply cannot block a submit.

The consequence is that the browser check is narrower than the
[headless one](../validation/overview.md#headless-validation).
`buildFormSchema` walks the whole tree, item-scoped rules and list lengths
included. A server that re-validates with it is not repeating the client's work;
it is doing the part the client structurally cannot.

## What `action` receives and returns

```ts
type FormState<T> = {
  data: T | null
  error: {
    title: string
    description?: string
    details?: string[] | Record<string, string[]>
  } | null
  success: boolean
}

async function save(
  data: Payload,
  schema?: ZodSchema
): Promise<FormState<Saved>> {
  const stored = await api.save(data)
  return { data: stored, error: null, success: true }
}
```

The schema is handed over with the data so a server action can re-parse the same
rules rather than reconstructing them.

Three ways it can end:

- **`success: true`** — `onSuccess` receives `data`, and the form clears.
- **`success: false`** — the `error` you return is rendered by the form's
  [alert](../setup.md#style-alert-env), untouched. This is where a server-side
  failure ("that email is already registered") belongs.
- **It throws** — the error is caught and logged, and the alert shows a generic
  title with the thrown message as its detail. A rejection is a bug report, not
  a message for the user; return `success: false` for anything you want them to
  read.

## The form empties on a successful submit

Once the action succeeds the values are cleared and the inputs come back blank.
For the usual "submit and move on" this is what you want, and for a form that
should keep what was submitted it is a surprise.

If the values have to survive, hold them outside the form: mirror
`onValueChange` into your own state and feed it back through `value` — see
[`withDeclaredFields`](../setup.md#withdeclaredfields) for the part that trips
people, which is that a key you stop sending is not the same as a key you send
empty.

A **failed** validation is the opposite: the submitted values are handed back to
the form, so the user's typing is still on screen next to the errors.

## Turning submit validation off

`defineConfig({ validation: { submit: false, ... } })` skips the parse
entirely. The action is called with the raw `FormData` and the schema, and
nothing is checked, reported or cleared on the way — for a form whose action
does its own parsing. With no action at all, submitting does nothing.

Remember that this object [replaces the defaults rather than merging](../setup.md#validation),
so pass the keys you still want.

## The error summary

When a validation fails, two things happen at once: each field is told about its
own errors, and the form reports a summary. The summary renders only when
`validation.showError` is on and a component is registered as `alert`; without
one, the per-field messages are all the user sees.

Its three strings — the title, the "correct the errors" description, and the
title used when an action throws — are
[shipped translations](../fields/list.md#built-in-translations), so `lang` alone
localizes them.
