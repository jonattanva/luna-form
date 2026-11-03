export function resolveTarget(target: string, name: string): string {
  if (!target.includes('/')) {
    return target
  }

  const [parent, field] = target.split('/')

  const regex = new RegExp(`(^|.*\\.)(${parent}\\.\\d+\\.)`)
  const match = name.match(regex)

  if (match) {
    return `${match[0]}${field}`
  }

  return field
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
