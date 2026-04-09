import { TIMEZONE_REGIONS } from './constant'

const REGEX_DIGITS = /^\d+$/

const getSupportedTimezones = (): string[] =>
  'supportedValuesOf' in Intl
    ? (
        Intl as unknown as { supportedValuesOf(k: string): string[] }
      ).supportedValuesOf('timeZone')
    : []

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

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function getTimezoneRegion(tz: string): string {
  const slash = tz.indexOf('/')
  const prefix = slash === -1 ? tz : tz.slice(0, slash)
  return TIMEZONE_REGIONS[prefix] ?? 'Other'
}

function getTimeZoneName(
  longNameParts: Intl.DateTimeFormatPart[],
  defaultTimeZone: string
): string {
  const fullName =
    longNameParts.find((part) => {
      return part.type === 'timeZoneName'
    })?.value ?? defaultTimeZone

  return fullName.replace(
    /\s+(?:Standard|Daylight(?: Saving)?|Summer|Winter)\s+Time$/,
    ''
  )
}

function getTimezoneInfo(
  tz: string,
  date: Date
): { offset: string; longName: string } {
  const offsetParts = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    timeZoneName: 'longOffset',
  }).formatToParts(date)

  const longNameParts = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    timeZoneName: 'long',
  }).formatToParts(date)

  const raw =
    offsetParts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+00:00'
  const offset = raw.replace('GMT', 'UTC')

  const longName = getTimeZoneName(longNameParts, tz)

  return { offset, longName }
}

function getTimezoneCity(tz: string): string {
  return tz.slice(tz.lastIndexOf('/') + 1).replace(/_/g, ' ')
}

type TimezoneItem = { value: string; label: string }
type TimezoneGroup = { label: string; items: TimezoneItem[] }

let cachedResult: TimezoneGroup[] | null = null

export function getTimezones(): TimezoneGroup[] {
  if (cachedResult) {
    return cachedResult
  }

  const date = new Date()
  const detectedTimezone = getUserTimezone()
  const groupMap = new Map<string, TimezoneItem[]>()

  const detectedCity = getTimezoneCity(detectedTimezone)
  const { offset: detectedOffset, longName: detectedLongName } =
    getTimezoneInfo(detectedTimezone, date)
  const detectedItem: TimezoneItem = {
    value: detectedTimezone,
    label: `${detectedCity} - ${detectedLongName} (${detectedOffset})`,
  }

  for (const tz of getSupportedTimezones()) {
    if (tz === detectedTimezone) {
      continue
    }

    const city = getTimezoneCity(tz)
    const { offset, longName } = getTimezoneInfo(tz, date)

    const item: TimezoneItem = {
      value: tz,
      label: `${city} - ${longName} (${offset})`,
    }

    const region = getTimezoneRegion(tz)
    if (region === 'Other') {
      continue
    }

    const existing = groupMap.get(region)
    if (existing) {
      existing.push(item)
    } else {
      groupMap.set(region, [item])
    }
  }

  for (const items of groupMap.values()) {
    items.sort((a, b) => a.label.localeCompare(b.label))
  }

  const sortedGroups = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, items]) => ({ label, items }))

  cachedResult = [{ label: 'Suggested', items: [detectedItem] }, ...sortedGroups]

  return cachedResult
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
