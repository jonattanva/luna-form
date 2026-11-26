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
2. **It is validated** against the schema built from the fields that are
   currently mounted. A date is read in either shape the form accepts and comes
   out of the schema as `yyyy-MM-dd`, so your action sees one shape whatever
   `advanced.format` says.
3. **Dotted names are un-flattened.** `basicAuth.username` becomes
   `{ basicAuth: { username } }`, and a numeric segment becomes an array index,
   so `rules.0.value` rebuilds the list, its rows in the order they are shown.
4. **Your `action` is awaited** with that object and the schema.
5. **`onSuccess` is called** with what the action returned, and the form starts
   over.

## Only mounted fields are validated

The client schema is assembled from the fields on screen. A field hidden by a
[`state` action](../events/change.md#2-state-action-stateevent) is unmounted, so
it is absent from the schema and from the submitted object — which is the point:
a rule that does not apply cannot block a submit.

The consequence is that the browser check is narrower than the
[headless one](../validation/overview.md#headless-validation).
`buildFormSchema` walks the whole tree, list lengths included. A server that
re-validates with it is not repeating the client's work; it is doing the part
the client structurally cannot.

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

- **`success: true`** — `onSuccess` receives `data`, and the form starts over.
- **`success: false`** — the `error` you return is rendered by the form's
  [alert](../setup.md#style-alert-env), untouched. This is where a server-side
  failure ("that email is already registered") belongs.
- **It throws** — the error is caught and logged, and the alert shows a generic
  title with the thrown message as its detail. A rejection is a bug report, not
  a message for the user; return `success: false` for anything you want them to
  read.

## The form starts over on a successful submit

Once the action succeeds the form starts over, as when it first opened: every
field and list mounts anew on a fresh store. A field comes back with its
`defaultValue` or blank, a list with the rows it starts with, one by default,
and a field a change event revealed is hidden again. A custom control and the
form's `children` start from their own initial state too, and if the focus was
in the form it moves to its submit button. For the usual "submit and move on"
this is what you want, and for a form that should keep what was submitted it is
a surprise.

If the values have to survive, hold them outside the form: mirror
`onValueChange` into your own state and feed it back through `value`. The form
starts over from what `value` holds, so the fields and the rows come back as
you kept them, and their change events run again for those values as they do
when the form opens, a `source` fetch included. Clear your state in `onSuccess`
to start blank instead. See
[`withDeclaredFields`](../setup.md#withdeclaredfields) for the part that trips
people, which is that a key you stop sending is not the same as a key you send
empty.

A **failed** submit is the opposite: nothing is cleared or reset, so what the
user entered stays on screen next to the errors — typed text, ticked boxes and
picked options alike. An error inside a collapsed
[section](../structure/sections.md#advancedcollapsible) or list row is brought
on screen too: the section or row holding it opens. The form does not take over
`value` either. What you pass is still what the fields read, so you can change
it, or put it back, while the errors are showing.

## The focus moves to the first error

When validation holds a submit back, the focus moves to the first field with an
error, in the order of the page, as a browser does for its own validation. It
happens on every failed submit, whether the user clicked the button or pressed
Enter in a field. A field inside a collapsed section or list row gets the focus
once what holds it has opened.

The field is found the way its label finds it: by the `id` your component
received, then by the element carrying the `aria-errormessage` the form handed
it. If that element cannot take the focus itself, such as a `role="group"`
holding a row of buttons, the first control inside it that can take the focus
gets it. See
[custom inputs](../fields/custom-inputs.md#forwarding-id-is-what-gives-the-field-its-name)
for where the `id` belongs.

The focus is left where it is when it was somewhere else on the page, outside
the form, so a submit made by code, an
[agent's](../agents/tools.md) included, does not take the user away from what
they were doing. A failure your `action` returns marks no field, so the focus
does not move to one; the alert is what tells the user. There is no option to
turn this off.

## Turning submit validation off

`defineConfig({ validation: { submit: false } })` skips the parse entirely. The
action is called with the raw `FormData` and the schema, and nothing is checked,
reported or cleared on the way — for a form whose action does its own parsing.
A row's fields arrive under the names their controls carry, the row at its
position (`rules.0.value`), however many rows were removed before it.
What it returns ends the submit as it does with validation on: a success calls
`onSuccess` and starts the form over, a failure shows its `error`, and a throw
is caught. With no action at all, submitting does nothing.

The other three keys are untouched by that: this object
[merges into the defaults](../setup.md#validation), so a form that stops
validating on submit goes on validating as the user types.

## The error summary

When a validation fails, two things happen at once: each field is told about its
own errors, and the form reports a summary. The summary renders only when
`validation.showError` is on and a component is registered as `alert`; without
one, the per-field messages are all the user sees.

Its three strings — the title, the "correct the errors" description, and the
title used when an action throws — are
[shipped translations](../fields/list.md#built-in-translations), so `lang` alone
localizes them.
