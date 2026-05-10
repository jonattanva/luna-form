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
