const REGEX_DIGITS = /^\d+$/

export function getMonth() {
  return Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(0, i).toLocaleString('default', {
      month: 'long',
    }),
  }))
}

export function getYear(
  min: number,
  max: number
): Array<{ value: string; label: string }> {
  if (max >= min) {
    return Array.from({ length: max - min + 1 }, (_, i) => {
      const year = min + i
      return {
        value: year.toString(),
        label: year.toString(),
      }
    })
  }
  return []
}

export function getCurrentYear() {
  return new Date().getFullYear()
}

// Cannot access current time from a Client Component without a fallback UI defined
// https://nextjs.org/docs/messages/next-prerender-current-time-client
export function getConvert(value: string | number, current?: number): number {
  if (typeof value === 'number') {
    return value
  }

  const now = current ?? getCurrentYear()
  const trimmed = value.trim().toLowerCase()

  if (trimmed.startsWith('current')) {
    const match = trimmed.match(/^current([+-])(\d+)$/)
    if (match) {
      const [, operator, offsetStr] = match
      const offset = parseInt(offsetStr, 10)
      if (!isNaN(offset)) {
        return operator === '+' ? now + offset : now - offset
      }
    }
    return now
  }

  if (REGEX_DIGITS.test(trimmed)) {
    return parseInt(trimmed, 10)
  }

  return now
}
