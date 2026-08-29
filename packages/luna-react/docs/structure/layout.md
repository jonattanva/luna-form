# Layout

Inside a section, fields stack one per row. Everything else — fields side by
side, a label beside its control — is opt in, and this page is where those keys
live.

## Columns (`type: "column"`)

A `column` is a grid that holds fields. It is declared among the fields of a
section (or of a [list](../fields/list.md) row) and takes a `fields` array of
its own:

```json
{
  "type": "column",
  "advanced": { "cols": 2 },
  "fields": [
    { "name": "first_name", "type": "input/text", "label": "First name" },
    { "name": "last_name", "type": "input/text", "label": "Last name" }
  ]
}
```

A column has no `name` and holds no value. It groups its fields visually and
nothing more: they keep the names they declare, and the submitted object is the
same one you would get without it.

| Key             | Type                   | Does                                       |
| --------------- | ---------------------- | ------------------------------------------ |
| `type`          | `"column"`             | required, exactly this string              |
| `fields`        | `Array<Field \| List>` | what the grid holds                        |
| `advanced.cols` | `1 \| 2 \| 3`          | how many columns the grid has, default `2` |
| `description`   | `string \| object`     | help text under the grid                   |
| `order`         | `number`               | position among the section's other entries |

### `cols`, and the values that are not

`cols` accepts `1`, `2` and `3`. **Anything else falls back to `2`** —
`"cols": 4`, `"cols": 0`, a string, or the key left out entirely all produce the
same two-column grid, with no error and no warning. A four-column layout is not
something to reach for by writing `4`; it does not exist.

The grid is one column below the `md` breakpoint and `cols` columns from there
up, so a column layout stacks on a phone whatever it says.

### A field's own `cols` is a span

Inside a column, a field's `advanced.cols` says how many of the grid's columns
that field takes:

```json
{
  "type": "column",
  "advanced": { "cols": 3 },
  "fields": [
    {
      "name": "card_number",
      "type": "input/text",
      "label": "Card number",
      "advanced": { "cols": 2 }
    },
    { "name": "cvc", "type": "input/text", "label": "CVC" }
  ]
}
```

The card number takes two of the three columns and the CVC takes the third.
Spans of `1`, `2` and `3` are honoured and anything else is ignored, leaving the
field at one cell — unlike the container's `cols`, an out-of-range span does not
fall back to a default.

The same key means different things in the two places, which is worth reading
twice: on a `column` it is **how many columns the grid has**, on a field inside
it, **how many of them the field covers**.

A field's span outside a column does nothing at all. The class is emitted, the
parent is not a grid, and the field goes on filling the width.

### Description

A column's `description` renders **under** the grid, not above it, and unlike a
[section's description](sections.md#title-and-description-are-translated-not-interpolated)
it goes through interpolation: `{context.*}`, `{env.*}` and
[format filters](../interpolation/format-filters.md) all resolve. It also takes
the `{ title, message, collapsed }` object form that a field description takes.

### What a column can hold

Fields and [lists](../fields/list.md). A column inside a list row is supported
and keeps its grid; the fields inside it are named by the row's path like any
other leaf.

A column has no visibility of its own: `hidden` on a column is not read. Hide
the fields it holds instead — and note that when every field in a column is
hidden, the column counts as hidden for the
[section's visibility](sections.md#order-and-what-disappears), while the grid
element itself stays in the layout.

### Labels truncate inside a grid

A label that is longer than its cell is truncated to one line inside a column,
where the same label wraps outside one. This keeps the inputs of a row aligned
with each other instead of one sinking below its neighbour. Write the short
version in the `label` and put the rest in the `description`.

## Ordering fields and columns

Every entry in a `fields` array — a field, a column, a list — sorts by `order`
before rendering. Entries carrying one sort ascending; entries without one hold
their relative position and follow the rest. Because a column sorts as a single
entry, `order` interleaves whole columns with the plain fields around them, not
the fields inside them.

## Orientation (`advanced.horizontal`)

By default a field renders its label above its control. `advanced.horizontal`
puts them side by side from the `md` breakpoint up:

```json
{
  "name": "timeout",
  "type": "input/number",
  "label": "Timeout",
  "advanced": { "horizontal": true }
}
```

A form that wants every field that way sets it once as
`style.horizontal` in [`defineConfig`](../setup.md#style-alert-env). A field
that declares nothing inherits it; one that declares `false` opts out of it.

Two consequences:

- **`radio` and `checkbox` are always horizontal**, whatever the key or the
  form-wide style says. Their control belongs beside its label, so neither is
  read for them.
- **The description moves.** A vertical field renders its description after the
  control; a horizontal one renders it under the label, in the label's own
  column.

The rendered field carries `data-orientation="horizontal"` or `"vertical"`,
which is the attribute to key CSS on rather than the class names.

## `advanced.reverse` (checkbox only)

A `checkbox` renders its box first and its label after it. `reverse: false`
swaps them:

```json
{
  "name": "accepted",
  "type": "checkbox",
  "label": "I accept the terms",
  "advanced": { "reverse": false }
}
```

The default is the reversed order, so this key exists to turn it **off**, and
`"reverse": true` changes nothing. It is read only for `checkbox`; on a `radio`,
an `input/*` or anything else it is ignored.

## Spacing

Spacing between fields is a property of the section that holds them, not of the
field: see [`advanced.compact`](sections.md#advancedcompact).

## Styling hooks

Every structural element carries a `data-slot`, so a design system can restyle
the scaffolding without patching the library. The components you register in
[`defineConfig`](../setup.md#inputs-required) are yours already; these are the
parts around them.

| `data-slot`         | Wraps                                                   |
| ------------------- | ------------------------------------------------------- |
| `field-set`         | one section, the rendered `<fieldset>`                  |
| `field-set-content` | the body of a collapsible section                       |
| `field-group`       | the stack of entries inside a section                   |
| `field-separator`   | the rule drawn by `advanced.separator`                  |
| `column`            | the grid of a `column`                                  |
| `field`             | one field, with `data-orientation` on it                |
| `field-label`       | the `<label>`                                           |
| `field-content`     | the label and, when horizontal, the description with it |
| `field-control`     | the form's own control area — where `children` renders  |
| `list-item-card`    | one row of a [list](../fields/list.md)                  |

A field also carries `data-invalid` while it holds an error and `data-readonly`
while it is disabled, both readable from the descendants with
`group-data-[...]`.
