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

You can fetch options from a remote API by providing a `DataSource` configuration.

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
