export function resolveTarget(target: string, name: string): string {
  if (!target.includes('/')) {
    return target
  }

  const [parent, field] = target.split('/')
  const segments = name.split('.')
  const end = findRowEnd(segments, parent.split('.'))

  if (end === -1) {
    return field
  }

  return [...segments.slice(0, end), field].join('.')
}

// Where the row of the list `list` ends in `segments`: the index just past
// the row number, or -1 when the name sits in no row of that list. A row at
// the start of the name wins; otherwise the last row on the way down does.
// The row must be followed by at least one more segment, the field itself.
function findRowEnd(segments: string[], list: string[]): number {
  let end = -1

  for (let start = 0; start + list.length + 1 < segments.length; start++) {
    const index = start + list.length
    const isRow =
      list.every((segment, offset) => segments[start + offset] === segment) &&
      /^\d+$/.test(segments[index])

    if (isRow) {
      end = index + 1
      if (start === 0) {
        break
      }
    }
  }

  return end
}

// Whether an event's `target` names the field called `name`, read the way
// `resolveTarget` reads it: `city` is the `city` of the top level, and
// `shipping/city` is the `city` of a `shipping` row, wherever that list sits.
export function isTargetOf(name: string, target: string): boolean {
  if (!target.includes('/')) {
    return name === target
  }

  const [parent, field] = target.split('/')
  const segments = name.split('.')
  const count = segments.length

  return (
    count >= 3 &&
    segments[count - 1] === field &&
    /^\d+$/.test(segments[count - 2]) &&
    segments[count - 3] === parent
  )
}
