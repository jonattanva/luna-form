# Sections

`sections` is the top level of a form. Every other page describes what goes
inside one; this page describes the section itself.

A section is a **visual grouping and nothing else**. It draws a legend, sets the
spacing around its fields and can collapse them out of the way, but it does not
scope names: every field in the form shares one flat namespace, whichever
section it was declared in. Two fields called `email` in two different sections
are one field with two renderings, and
[`buildFormSchema`](../validation/overview.md#headless-validation) produces one
key for them.

## The shape

| Key                    | Type               | Does                                          |
| ---------------------- | ------------------ | --------------------------------------------- |
| `fields`               | `Fields`           | what the section renders                      |
| `title`                | `string`           | the legend                                    |
| `description`          | `string`           | help text under the legend                    |
| `id`                   | `string \| number` | the `id` attribute of the rendered `fieldset` |
| `order`                | `number`           | position among the other sections             |
| `advanced.compact`     | `boolean`          | tighter spacing between this section's fields |
| `advanced.collapsible` | `boolean`          | render the section closed, behind a toggle    |
| `advanced.separator`   | `boolean`          | draw a rule after the section                 |

```json
{
  "sections": [
    {
      "id": "payment",
      "title": "Payment Method",
      "description": "All transactions are secure and encrypted",
      "advanced": { "separator": true },
      "fields": [{ "name": "name", "type": "input/text", "label": "Name" }]
    }
  ]
}
```

## A section with no title and no description draws nothing

There is no empty legend and no wrapper to style around it: the section's fields
join the flow of the form as if they had been declared without one. This is the
form to reach for when you want the grouping only for `compact` spacing or for
`order`.

Declaring `advanced.collapsible` on such a section does nothing either — with no
title there is nothing to click, so the fields render open.

## Title and description are translated, not interpolated

Both are resolved against the [`translations`](../fields/list.md#localization)
dictionary and both render `[text](url)` markdown links. Neither is passed
through interpolation: a `{context.name}` in a section title stays on screen as
the literal text `{context.name}`.

This is the one place the rule differs. A field's `label` and `description`
_are_ interpolated, and so is a [column's description](layout.md#description).
If a section heading has to carry a value, put the value in a field description
or in a column instead.

## `advanced.compact`

Spacing between the fields of this section, tight instead of loose. It is
declared per section:

```json
{
  "title": "Connection",
  "advanced": { "compact": true },
  "fields": [{ "name": "host", "type": "input/text" }]
}
```

A section that declares nothing inherits `style.compact` from
[`defineConfig`](../setup.md#style-alert-env), so the form-wide default holds
and a section only has to speak up to differ from it — including to opt out,
with `"compact": false` under a compact form.

## `advanced.separator`

Draws a horizontal rule **after** the section, between it and whatever follows.
On the last section it draws a trailing rule, which is rarely what you want.

## `advanced.collapsible`

Renders the section closed, with its title as the toggle:

```json
{
  "title": "Advanced options",
  "advanced": { "collapsible": true },
  "fields": [{ "name": "timeout", "type": "input/number" }]
}
```

Three things to know before using it:

- **It always starts closed.** There is no key that opens it, and reopening the
  form does not remember that the user had expanded it.
- **The fields inside stay mounted.** Collapsing hides them; it does not unmount
  them. They keep their values, they still validate, and they are still
  submitted. That is the opposite of what a [`state` action](../events/change.md#what-clearing-a-hidden-target-means)
  does when it hides a field, which unmounts it and clears the value.
- **The description moves inside.** It renders with the fields rather than under
  the title, so it is not visible while the section is closed.

A collapsible section also renders no step number, whatever `advanced.step` says.

## `advanced.step` numbers the sections

Declared on the **form**, not on a section, it puts a numbered badge beside each
section's legend, counting the sections in the order they render:

```tsx
<Form advanced={{ step: true }} sections={sections} config={config} />
```

It is a numbering, not a wizard: every section is on screen at once, and the
library ships nothing that shows them one at a time. The badge appears only on
sections that draw a legend — a section with no title and no description has
nowhere to put it, and a collapsible one does not take it.

## `order`, and what disappears

`sections` renders in array order unless a section declares `order`. Sections
carrying one sort ascending; sections without one keep their relative order and
follow the rest. The same rule applies to the entries inside a section, so a
field and a column can be interleaved by `order` — see
[layout.md](layout.md#ordering-fields-and-columns).

Two kinds of section never render at all:

- **One with no fields.** `"fields": []` is dropped before rendering, legend
  included.
- **One whose fields are all hidden.** Hidden by `hidden: true` in the JSON or
  by a [`state` action](../events/change.md#2-state-action-stateevent) at run
  time, it makes no difference: when nothing inside a section is visible the
  section goes with it, and it comes back when one of them is shown again. A
  column counts as hidden when every field in it is.

A section has **no visibility flag of its own**. Writing `"hidden": true` on a
section is accepted and ignored; hide its fields instead, or leave the section
out of the array.

## `id`

Lands on the rendered `<fieldset>` as its `id` attribute, for an anchor link or
a test selector. It is not a name and nothing resolves against it: fields are
addressed by their own `name` from anywhere in the form.

## Complete example

```json
{
  "advanced": { "step": true },
  "sections": [
    {
      "id": "contact",
      "title": "Contact",
      "description": "How we reach you about this order",
      "advanced": { "separator": true },
      "fields": [
        { "name": "email", "type": "input/email", "label": "Email" },
        { "name": "phone", "type": "input/tel", "label": "Phone" }
      ]
    },
    {
      "title": "Delivery",
      "advanced": { "compact": true },
      "fields": [
        { "name": "street", "type": "input/text", "label": "Street" },
        { "name": "city", "type": "input/text", "label": "City" }
      ]
    },
    {
      "title": "Advanced options",
      "advanced": { "collapsible": true },
      "order": 99,
      "fields": [
        { "name": "notes", "type": "textarea", "label": "Delivery notes" }
      ]
    }
  ]
}
```
