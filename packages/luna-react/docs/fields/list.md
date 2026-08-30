# List Field (`list`)

The `list` field type in Luna Form acts as an iterative array structure, enabling users to add, edit, and remove a repeating set of fields dynamically. It's particularly useful when capturing a collection of identical data objects—like a list of addresses, multiple users, or repeated configurations.

---

## Core Properties

- **`name`** _(string, required)_: The unique identifier. The resulting form state binds to an array containing objects referencing the child elements.
- **`type`** _(string, required)_: Evaluates the type definition exactly to `"list"`.
- **`label`** _(string, optional)_: The human-readable label (typically rendered as a fieldset legend).
- **`description`** _(string | object, optional)_: Help text or extra context shown globally just under the legend. Supports **Markdown** (specifically links).
- **`fields`** _(Array<Field | Column | List>, required)_: The nested structure defining what underlying standard HTML inputs are repeated for each iteration in the array. A `list` among them is a list nested inside this one: each row gets its own, named by its path (`groups.0.checks`).

---

## Advanced Configuration (`advanced` object)

The `advanced` property customizes structural interaction rules and layout rendering for the collection container.

- **`title`** _(string)_: Names one item of the collection. The header of the second row then reads `Contact 2` and its controls announce `Collapse Contact 2` and `Remove Contact 2`.
  It falls back to the list's `label`, and then to its `name`, so a list called `contacts` with neither captions its rows `contacts 1`. A [`preview.label`](#collapsed-previews-preview-object) replaces the caption where it resolves; this stays the fallback for the rows where it does not.
  Like `action`, it is copy the form declares, so it is translated through the dictionary — see [Localization](#localization).
- **`action`** _(string)_: A custom label applied strictly to the generic "Add item" button rendering at the end of the collection (e.g. `"Add email address"`).
  A custom label has to be translated by the form; the built-in `Add item` default is already translated by the library — see [Localization](#localization).
- **`length`** _({ min?: number, max?: number })_: Configures restrictions on how many items can be generated. Enforces boundary conditions where minimum instances ensure permanent default items and maximum instances automatically disable insertion toggles. The matching error messages are declared under the list's `validation.length` — see the [Validation reference](../validation/overview.md#list-length).
  Both bounds apply to the rows a list opens with, not only to the ones added by hand: an initial `value` shorter than `min` leaves the remainder standing and empty, and one longer than `max` stops at `max`. A [`value` event](../events/change.md#targeting-a-list) assigning rows is clamped the same way.
- **`collapsed`** _(boolean)_: When enabled, list items default to a visually collapsed representation upon mounting or adding.

### Collapsed Previews (`preview` object)

If list items render into structural wrappers (e.g., when they contain multiple fields and become automatically collapsible), the **`preview`** object handles mapping internal field values outward toward the unexpanded accordion headers directly.

- **`label`** _(string | PreviewItem)_: Targets a primary field to replace the list element's fallback title string.
- **`badge`** _(string | PreviewItem)_: Extracts a selected field mapping dynamically as an isolated badge indicator beside the label.
- **`tags`** _(PreviewItem[])_: Defines an array pointing to additional fields inside the iteration mapping, injected strictly below the label row simulating tag clouds.

**`PreviewItem` Definition:**
Previews can map seamlessly pointing out the desired child `name` simply as strings format, or strictly defined mapping condition rules optionally:

- **`field`** _(string)_: The child layout field name.
- **`label`** _(string)_: Provides contextual prefix naming before mapping the preview value statically.
- **`when`** _(string | string[] | Condition)_: Standard complex logical operators dictating runtime evaluation rules. When an **array** is provided, it performs an **OR match** against the field's current value.

---

## Filling a list from another field

A `list` can be the target of a `value` change event. Aim one at the list's own name and give it an array of objects, and the list becomes exactly those rows — one object per row, each key matching a field name inside it.

It assigns rather than adds: the rows you send are the rows that remain, `advanced.length` still bounds the result, and rows that survive are matched by position so they are not remounted.

A row's key can name a nested `list` instead of a field, in which case its value is that list's rows and the whole tree is assigned in one event. The full rules and worked examples are in [Targeting a list](../events/change.md#targeting-a-list) and [Rows that hold rows](../events/change.md#rows-that-hold-rows).

---

## Interaction Targeting in Events

When interacting internally inside specific items belonging directly to iterators (`list`), Target Actions (like configuring cross dependencies over Change events) inherit relative pathing resolution logically overriding direct top-level values leveraging `"list_name/field_name"` resolution strings.

For example, if you want a field inside the list to update another field **in the same iteration/row**, you must prefix the target field's name with the list's name:

```json
{
  "name": "users",
  "type": "list",
  "fields": [
    {
      "name": "role",
      "type": "select",
      "source": [
        { "value": "admin", "label": "Admin" },
        { "value": "user", "label": "User" }
      ],
      "event": {
        "change": [
          {
            "action": "value",
            "value": {
              "users/access_level": "full_access"
            },
            "when": "admin"
          }
        ]
      }
    },
    {
      "name": "access_level",
      "type": "input/text"
    }
  ]
}
```

See [Change Events](../events/change.md#target-resolution-in-lists) structure definitions closely outlining array value mapping techniques cleanly.

---

## Localization

Every piece of copy a list renders goes through the `translations` dictionary, keyed by its English source text. The keys split into two groups by who owns the text.

**Declared by the form**, so only the form can translate them:

- `label` and `description`, rendered as the fieldset legend and its help text.
- `advanced.action`, the custom add-button label.
- `advanced.title`, which supplies the caption of each item (`Contact 1`, `Contact 2`, …) and feeds the accessible names of its controls.

**Owned by the library**, so `lang` alone is enough — see [built-in translations](#built-in-translations):

- `Add item`, the add-button label when no `action` is declared.
- `Expand {label} {index}`, `Collapse {label} {index}` and `Remove {label} item {index}`, the accessible names of the item controls.

```json
{
  "lang": "es",
  "translations": {
    "es": {
      "contact_label": "Contacto"
    }
  },
  "sections": [
    {
      "fields": [
        {
          "label": "contact_label",
          "name": "contacts",
          "type": "list",
          "fields": [
            { "name": "name", "label": "Nombre", "type": "input/text" },
            { "name": "email", "label": "Correo", "type": "input/email" }
          ]
        }
      ]
    }
  ]
}
```

The list renders as `Contacto`, its add button as `Añadir elemento`, and its controls announce `Contraer Contacto 1` and `Eliminar Contacto 1` — the form only had to name its own label.

### Built-in translations

The library ships translations for the copy it renders on its own behalf, because a form cannot name those strings in its schema. Today that covers **Spanish**; any other `lang` falls back to the English source text.

Beyond the list keys above, the built-in set also covers the `(Optional)` label suffix, the `Yes`/`No` options of [`select/active`](specialized-selectors.md#5-activebinary-selector-selectactive), and the summary the form shows above itself when a submit fails: `There were validation errors submitting the form.`, `Please correct the errors and try again.`, and `An unexpected error occurred submitting the form.` (plus `Unknown error` for a thrown action carrying no message).

The built-ins are layered _under_ the form's own block, so declaring a key still overrides them:

```json
{
  "lang": "es",
  "translations": { "es": { "Add item": "Agregar contacto" } }
}
```

Regional tags resolve to their base language, so `es-MX` and `es-419` both get the Spanish defaults. A form's own entries keep matching on the exact tag, unchanged.

### Accessible name templates

The accessible names are single keys carrying `{label}` and `{index}` placeholders rather than separate words, so a translation can reorder the parts — or drop one. The Spanish default for `Remove {label} item {index}` is `Eliminar {label} {index}`, without the English `item` filler:

```json
{
  "translations": {
    "fr": { "Remove {label} item {index}": "Supprimer {label} {index}" }
  }
}
```

Left untranslated, the template fills in to the same English text it replaced.

---

## Complete Example Reference

```json
{
  "label": "Working Experiences",
  "name": "experiences",
  "type": "list",
  "description": "Please detail your previous relevant jobs.",
  "advanced": {
    "action": "Add Experience Record",
    "collapsed": true,
    "length": {
      "min": 1,
      "max": 3
    },
    "preview": {
      "label": "company",
      "badge": "status",
      "tags": [
        "title",
        {
          "field": "internal_review",
          "label": "Checked",
          "when": {
            "operator": "eq",
            "value": true
          }
        }
      ]
    }
  },
  "fields": [
    {
      "name": "company",
      "label": "Company Name",
      "type": "input/text",
      "required": true
    },
    {
      "name": "title",
      "label": "Job Title",
      "type": "input/text"
    },
    {
      "name": "status",
      "type": "select",
      "source": [
        { "value": "active", "label": "Currently Employed" },
        { "value": "past", "label": "Past Job" }
      ]
    },
    {
      "name": "internal_review",
      "type": "checkbox",
      "hidden": true
    }
  ]
}
```
