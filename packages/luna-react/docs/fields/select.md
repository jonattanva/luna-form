# Select Fields (`select`, `radio`, `chips`)

Luna Form provides several field types for selecting one or more values from a set of options. These fields share a common way of managing their data source.

## Supported Types

- `select`: A standard dropdown menu (`<select>`).
- `radio`: A group of radio buttons where only one can be selected.
- `chips`: Interactive buttons (tags) for selecting values. Supports single or multiple selection.

> **Tip:** Luna Form also includes **[Specialized Selectors](specialized-selectors.md)** with built-in sources for months, years, days, timezones, and more.

---

## The `source` Property

Unlike input fields, selectors require a list of options. This is managed via the `source` property.

### 1. Static Options

You can provide an array of objects directly in the schema.

```json
"source": [
  { "label": "Apple", "value": "apple" },
  { "label": "Banana", "value": "banana" },
  { "label": "Orange", "value": "orange", "description": "High in Vitamin C" }
]
```

Each option consists of:

- **`label`** _(string)_: The text displayed to the user.
- **`value`** _(string | number | boolean)_: The technical value submitted in the form.
- **`description`** _(string, optional)_: Additional help text for the specific option.

### 2. Remote Data Source

You can fetch options from a remote API by providing a `DataSource` configuration. Its full shape, and when a request is and is not made, are in [data-source.md](data-source.md).

```json
"source": {
  "url": "/api/v1/categories",
  "method": "GET"
}
```

If your API returns objects with different keys, you can map them using the `advanced.options` property. This is useful when your data doesn't match the default `{ label, value }` structure.

### Example: Mapping a User Object

Suppose your source returns an array of user objects with properties like `id`, `name`, `lastname`, and `age`:
`[{ "id": 101, "name": "John", "lastname": "Doe", "age": 25 }]`

You can use the `options` mapping to decide which properties are used for the selector's value, label, and (optional) description:

```json
{
  "name": "user_selection",
  "type": "select",
  "source": { "url": "/api/users" },
  "advanced": {
    "options": {
      "value": "id",
      "label": "name",
      "description": "age"
    }
  }
}
```

### Property Mapping Reference

Inside `advanced.options`, you can map:

- **`label`**: The key to use for the display text (e.g., `"name"`).
- **`value`**: The key to use for the technical value (e.g., `"id"`).
- **`description`** _(optional)_: The key to use for additional help text (e.g., `"age"`).

---

### `advanced.entity`

`advanced.options` decides what the user sees and what the field submits.
`advanced.entity` decides how a value is matched **back** to the row it came
from, and it defaults to `value`.

That default is right for options shaped `{ label, value }` and wrong for
everything else, which is why it belongs next to `options`: whenever
`options.value` names a key other than `value`, `entity` has to name the same
key.

```json
{
  "name": "user_selection",
  "type": "select",
  "source": { "url": "/api/users" },
  "advanced": {
    "entity": "id",
    "options": { "value": "id", "label": "name" }
  },
  "event": {
    "change": [{ "action": "value", "value": { "contact_email": "{email}" } }]
  }
}
```

It does two things, both of them a lookup by that key:

- **A change event gets the whole row.** The library finds the source row whose
  `entity` key equals the current selection and hands that object to the
  event, which is what makes `{email}` — a key that is neither the label nor
  the value — resolvable. Without `entity` the lookup matches nothing, the
  event falls back to `{ value }`, and every other placeholder is left literal.
  See [Event payloads](../interpolation/overview.md#event-payloads).
- **An object value is read through it.** A form whose value for this field is
  the whole record rather than the id — `{ "id": 101, "name": "John" }` — shows
  the right option, because `entity` says which key of that object is the
  value. Without it the field looks for a `value` key, finds none, and mounts
  empty.

The comparison is made on the text of both sides, so a numeric `id` in the
source matches the string the select reports.

`entity` is not read for `chips`: an array selection answers to no single row,
so a `chips` change carries the array itself.

## Translating Options

When the options are declared inline as an array, `label` and `description` are resolved against the form dictionary, exactly like a field's own `label`. Missing keys fall back to the key itself.

```json
{
  "lang": "es",
  "translations": {
    "es": {
      "fruit_apple": "Manzana",
      "fruit_banana": "Plátano"
    }
  },
  "sections": [
    {
      "fields": [
        {
          "name": "fruit",
          "type": "select",
          "source": [
            { "value": "apple", "label": "fruit_apple" },
            { "value": "banana", "label": "fruit_banana" }
          ]
        }
      ]
    }
  ]
}
```

This applies to `select`, `radio` and `chips`, works with `advanced.options` mapping, and reaches the collapsed preview of a list.

Three rules bound the behavior:

- **`value` is never translated.** It is the technical value submitted with the form, so the payload stays identical in every language.
- **Only array sources are translated.** A remote `DataSource` returns data, not authored copy, so its labels are rendered as fetched. The same applies when a `source` change event replaces the array with a remote source at runtime.
- **Only object options are translated.** In a bare string array (`["apple", "banana"]`) the string is both the label and the value, so translating it would change what the form submits.

Specialized selectors carry their own built-in labels and are not resolved against the dictionary. See [Specialized Selectors](specialized-selectors.md#localization).

---

---

## Core Properties

- **`name`** _(string, required)_: The unique identifier.
- **`type`** _(string, required)_: One of the supported select types.
- **`label`** _(string, optional)_: Human-readable label.
- **`defaultValue`** _(any, optional)_: The initial selected value. Matches the `value` of one of the options.
  For `chips`, it must be an **array** — see below.
- **`required`** _(boolean, optional)_: If `true`, a value must be selected.

---

## Advanced Configuration (`advanced` object)

- **`multiple`** _(boolean, optional)_: (Available for `chips`) Allows selecting more than one option. Defaults to `true`.
- **`preselected`** _(boolean, optional)_: For specialized selectors like `select/month`, determines if the current value (e.g., current month) should be selected by default.
- **`horizontal`** _(boolean, optional)_: Renders the options or selector horizontally.
- **`entity`** _(string, optional)_: The key that identifies an option row, defaulting to `value`. Set it whenever `options.value` names a different key — see [`advanced.entity`](#advancedentity).
- **`options`** _({ label, value, description }, optional)_: Maps the keys of a remote row onto the option shape — see [Property Mapping Reference](#property-mapping-reference).

### A chips value is always an array

Whatever `multiple` says, a `chips` field holds an array. The value is coerced
on the way in: anything that is not an array becomes `[]`.

The consequence is a scalar `defaultValue`. This looks reasonable and does
nothing:

```json
{ "name": "method", "type": "chips", "defaultValue": "GET" }
```

`"GET"` is not an array, so the field mounts with nothing selected. Nothing
throws and nothing warns. Write it as an array, single selection or not:

```json
{ "name": "method", "type": "chips", "defaultValue": ["GET"] }
```

Setting `advanced.multiple` to `false` limits what a user can pick. It does not
change the shape of the value, so it does not make a scalar default work.

---

## Validation

- **`required`** _(string)_: Custom error message when no value is selected.
- **`option`** _(string)_: Custom error message when the value is not one of the options the definition writes. See below.

### Options written in the definition

When `source` is an array, written inline or through a `$ref` that resolves to one, those options are the only answers the field takes, whether the field is required or not. Any other value is held back with `validation.option` as the message, or `This option is not available` when there is none. The rule is part of the field's schema, so [`buildFormSchema`](../validation/overview.md#headless-validation) and the rendered `<Form>` check it alike. This covers a stored configuration and a request made by hand, such as a value that was removed from the options after it was saved.

```json
{
  "name": "fruit",
  "type": "select",
  "source": [
    { "label": "Apple", "value": "apple" },
    { "label": "Banana", "value": "banana" }
  ],
  "validation": { "option": "Pick a fruit from the list" }
}
```

How the value is read:

- **Through the mapping.** With `advanced.options.value`, the option's value is that key, so `{ "id": 101 }` offers `101`.
- **As text.** `101` and `"101"` are the same answer, as they are when the field matches a selection.
- **One by one for `chips`.** Every value in the array has to be offered.
- **Empty is not this rule's question.** An empty value or an empty `chips` array passes here. `required` decides whether the field may be empty.

Two kinds of field are not checked, because the definition does not know their options:

- A field whose `source` is a remote `DataSource`, or a `$ref` that did not resolve.
- A field that a [`source` change event](../events/change.md#3-source-action-sourceevent) aims at, even when it also writes an array. The target names one field, as it does for the event: `city` is the `city` at the top level, and `shipping/city` is the `city` of each `shipping` row. Any other field called `city` is still checked.

A list declares its options once for every row, so each row is checked against them, however deep the list is.

### A value the control cannot show

A select, radio or chips draws only the options it offers, so a value it holds outside them, from the host or from a `value` event, is not on screen. The browser does not submit that value either: a native select behind the control submits its first option instead, an option nobody picked, and a radio submits nothing.

The submit of the rendered `<Form>` therefore checks, for these fields, the value the field holds rather than what the browser sends. The field shows `validation.option`, or `This option is not available`, whether it is required or not, and nothing is sent until an option is picked. A field that holds one of its options, or nothing, is sent as the control sends it: a `select` with nothing picked sends `""`, and a `radio` sends nothing.

A field a `source` event aims at is sent as it holds its value, since its options are only known at run time.

Writing the same values again in a [`rules`](../validation/overview.md#rules) `oneOf` assertion is no longer needed. If both are present, a value that is not offered gets both messages.

---

## Complete Example

```json
{
  "name": "notification_preference",
  "type": "radio",
  "label": "How should we contact you?",
  "defaultValue": "email",
  "source": [
    { "label": "Email", "value": "email" },
    { "label": "SMS", "value": "sms" },
    {
      "label": "Push Notification",
      "value": "push",
      "description": "Requires mobile app"
    }
  ],
  "validation": {
    "required": "Please select a notification method."
  }
}
```
