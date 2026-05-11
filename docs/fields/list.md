# List Field (`list`)

The `list` field type in Luna Form acts as an iterative array structure, enabling users to add, edit, and remove a repeating set of fields dynamically. It's particularly useful when capturing a collection of identical data objects—like a list of addresses, multiple users, or repeated configurations.

---

## Core Properties

- **`name`** _(string, required)_: The unique identifier. The resulting form state binds to an array containing objects referencing the child elements.
- **`type`** _(string, required)_: Evaluates the type definition exactly to `"list"`.
- **`label`** _(string, optional)_: The human-readable label (typically rendered as a fieldset legend).
- **`description`** _(string | object, optional)_: Help text or extra context shown globally just under the legend.
- **`fields`** _(Array<Field | Column>, required)_: The nested structure defining what underlying standard HTML inputs are repeated for each iteration in the array.

---

## Advanced Configuration (`advanced` object)

The `advanced` property customizes structural interaction rules and layout rendering for the collection container.

- **`action`** _(string)_: A custom label applied strictly to the generic "Add item" button rendering at the end of the collection (e.g. `"Add email address"`).
- **`length`** _({ min?: number, max?: number })_: Configures restrictions on how many items can be generated. Enforces boundary conditions where minimum instances ensure permanent default items and maximum instances automatically disable insertion toggles.
- **`collapsible`** _(boolean)_: When `true`, list elements wrap seamlessly into user-expanding accordions instead of vertical flat blocks. Helpful for rich inner form collections.
- **`collapsed`** _(boolean)_: Only effective if `collapsible: true`. When enabled, list items default to a visually collapsed representation upon mounting or adding.

### Collapsed Previews (`preview` object)

If list items render into structural wrappers relying on collapsibles, the **`preview`** object handles mapping internal field values outward toward the unexpanded accordion headers directly.

- **`label`** _(string | PreviewItem)_: Targets a primary field to replace the list element's fallback title string.
- **`badge`** _(string | PreviewItem)_: Extracts a selected field mapping dynamically as an isolated badge indicator beside the label.
- **`tags`** _(PreviewItem[])_: Defines an array pointing to additional fields inside the iteration mapping, injected strictly below the label row simulating tag clouds.

**`PreviewItem` Definition:**
Previews can map seamlessly pointing out the desired child `name` simply as strings format, or strictly defined mapping condition rules optionally:

- **`field`** _(string)_: The child layout field name.
- **`label`** _(string)_: Provides contextual prefix naming before mapping the preview value statically.
- **`when`** _(string | string[] | Condition)_: Standard complex logical operators dictating runtime evaluation rules when a tag or standard preview conditionally displays inside the wrapper.

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
      "options": [
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

## Complete Example Reference

```json
{
  "label": "Working Experiences",
  "name": "experiences",
  "type": "list",
  "description": "Please detail your previous relevant jobs.",
  "advanced": {
    "action": "Add Experience Record",
    "collapsible": true,
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
      "options": [
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
