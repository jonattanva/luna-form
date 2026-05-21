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

---

## Core Properties

- **`name`** _(string, required)_: The unique identifier.
- **`type`** _(string, required)_: One of the supported select types.
- **`label`** _(string, optional)_: Human-readable label.
- **`defaultValue`** _(any, optional)_: The initial selected value. Matches the `value` of one of the options.
- **`required`** _(boolean, optional)_: If `true`, a value must be selected.

---

## Advanced Configuration (`advanced` object)

- **`multiple`** _(boolean, optional)_: (Available for `chips`) Allows selecting more than one option. The form value will be an array of selected values.
- **`preselected`** _(boolean, optional)_: For specialized selectors like `select/month`, determines if the current value (e.g., current month) should be selected by default.
- **`horizontal`** _(boolean, optional)_: Renders the options or selector horizontally.

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
