import {
  DATA_FORMAT,
  DATE_FORMATS,
  MAX,
  MIN,
  TIMEZONE_REGIONS,
} from './constant'
import { isObject, isString } from './is-type'
import { logger } from './logger'
import { refOf } from './prepare'
import { isValid, parse, format as fnsFormat } from 'date-fns'
import type {
  Date as DateField,
  DateFormat,
  Time,
  TimeFormat,
  TimezoneGroup,
  TimezoneItem,
} from '../type'

const REGEX_DIGITS = /^\d+$/
const REF = new Date(2000, 0, 1)

// A day the way the form exchanges it: what a native `<input type="date">`
// takes, what a calendar emits, what the host gets back and what the submit
// sends. `format` is only how a field shows it.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const ISO_FORMAT = 'yyyy-MM-dd'

const DEFAULT_DATE_FORMAT: DateFormat = 'MMMM d, yyyy'

// `yyyy` reads one to four digits, so without a floor every keystroke of a year
// being typed is a different valid day -- `15/06/2` is the year 2 -- and
// `15/06/24` is the year 24. A year is four digits here.
const MIN_YEAR = 1000

const getSupportedTimezones = (): string[] =>
  'supportedValuesOf' in Intl
    ? (
        Intl as unknown as { supportedValuesOf(k: string): string[] }
      ).supportedValuesOf('timeZone')
    : []

// Resolving to the runtime locale is what `toLocaleString` already did before
// `lang` was threaded through, so an absent or unusable tag keeps the previous
// behavior instead of forcing a language on the form.
const DEFAULT_LOCALE = 'default'

function toLocale(locale?: string): string {
  if (!locale) {
    return DEFAULT_LOCALE
  }

  try {
    // A malformed tag (`es_MX`, `español`) throws a RangeError here rather than
    // deeper inside toLocaleString, where it would take the whole form down.
    return Intl.getCanonicalLocales(locale)[0] ?? DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export function getMonth(locale?: string) {
  const resolved = toLocale(locale)

  return Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(0, i).toLocaleString(resolved, {
      month: 'long',
    }),
  }))
}

export function getWeekDays(locale?: string) {
  const resolved = toLocale(locale)

  return Array.from({ length: 7 }, (_, i) => ({
    value: i.toString(),
    label: new Date(2000, 0, 2 + i).toLocaleString(resolved, {
      weekday: 'long',
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
    offsetParts.find((part) => {
      return part.type === 'timeZoneName'
    })?.value ?? 'GMT+00:00'

  const offset = raw.replace('GMT', 'UTC')
  const longName = getTimeZoneName(longNameParts, tz)

  return { offset, longName }
}

function getTimezoneCity(tz: string): string {
  return tz.slice(tz.lastIndexOf('/') + 1).replace(/_/g, ' ')
}

export function getTimezones(): TimezoneGroup[] {
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

  return [{ label: 'Suggested', items: [detectedItem] }, ...sortedGroups]
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

// The one reading of a day, for every way a date leaves this module.
//
// A day arrives in one of two shapes: `yyyy-MM-dd`, which is what a calendar
// emits and what the form hands out, or the field's own `format`, which is
// what a person types and what an older host may still hold. Both are read,
// so whatever the form gave away can be given back. An impossible day, half a
// date or a year that is not four digits is no day. Read in local time: a
// `yyyy-MM-dd` is a day, not an instant.
function readDay(value: string, format: DateFormat): Date | undefined {
  const text = value.trim()
  if (!text) {
    return undefined
  }

  try {
    const day = parse(text, ISO_DATE.test(text) ? ISO_FORMAT : format, REF)
    return isValid(day) && day.getFullYear() >= MIN_YEAR ? day : undefined
  } catch {
    return undefined
  }
}

// A day as the form holds it, `yyyy-MM-dd`, or `''` when the text is no day
// and the caller has to judge it.
export function toNativeDate(value: string, fromFormat: DateFormat): string {
  const day = value ? readDay(value, fromFormat) : undefined
  return day ? fnsFormat(day, ISO_FORMAT) : ''
}

export function toNativeTime(value: string, fromFormat: TimeFormat): string {
  if (!value) {
    return ''
  }

  try {
    const date = parse(value, fromFormat, REF)
    return isValid(date) ? fnsFormat(date, 'HH:mm:ss') : ''
  } catch {
    return ''
  }
}

export function fromNativeTime(
  native: string,
  toFormat: TimeFormat = 'HH:mm'
): string {
  if (!native) {
    return ''
  }

  try {
    const format = native.split(':').length === 3 ? 'HH:mm:ss' : 'HH:mm'
    const date = parse(native, format, REF)

    return isValid(date) ? fnsFormat(date, toFormat) : ''
  } catch {
    return ''
  }
}

// A value as a date field shows it: the day in the field's format, or the text
// as it is when it is no day, which is what the field itself shows.
export function displayDate(value: string, format: DateFormat): string {
  const day = readDay(value, format)
  return day ? fnsFormat(day, format) : value
}

export function getTimeFormat(field: Time): TimeFormat {
  return field.advanced?.format ?? 'HH:mm'
}

// A format is read once, here, from wherever it was written: one this module
// does not know -- `DD/MM/YYYY`, a typo -- is the default, the same for the
// field, for its schema and for its component, rather than an error thrown
// from inside a render.
function toDateFormat(value?: string): DateFormat {
  return DATE_FORMATS.find((format) => format === value) ?? DEFAULT_DATE_FORMAT
}

export function getDateFormat(field: DateField): DateFormat {
  return toDateFormat(field.advanced?.format)
}

export type DateLimits = Readonly<{
  max?: string
  min?: string
}>

export type DateBound = keyof DateLimits

// A bound is a `yyyy-MM-dd` day, the shape a native `<input type="date">` takes
// for its own `min` and `max`. Anything else bounds nothing, the way a browser
// ignores a `min` it cannot read, so the control and the schema never disagree
// about one.
function readBound(value: unknown): string | undefined {
  return isString(value) && ISO_DATE.test(value)
    ? toNativeDate(value, ISO_FORMAT) || undefined
    : undefined
}

// The bounds a field declares are named once. The form copies a field -- an
// optional one in the headless schema, a read-only one while it renders -- but
// never the `length` it declares, so that object is what is remembered.
const reportedLimits = new WeakSet<object>()

/**
 * The first and the last day a date field allows, both included, read once for
 * the props its component is handed and for the schema that checks it.
 *
 * It is the one place the bounds are read, on the server and in the browser, so
 * it is where a bound that bounds nothing is named for whoever wrote the form.
 */
export function buildDateLimits(field: DateField): DateLimits {
  const length = field.advanced?.length
  const limits: DateLimits = {
    max: readBound(length?.max),
    min: readBound(length?.min),
  }

  if (isObject(length) && !reportedLimits.has(length)) {
    reportedLimits.add(length)
    for (const problem of describeDateLimits(field.name, length, limits)) {
      logger.warn(problem)
    }
  }

  return limits
}

// The bound a day falls outside of, and the day it is bounded by. Compared as
// text: in `yyyy-MM-dd` the order of the strings is the order of the days,
// with no time zone in the way.
export function checkDay(
  day: string,
  limits: DateLimits
): Readonly<{ bound: DateBound; limit: string }> | null {
  if (limits.min !== undefined && day < limits.min) {
    return { bound: 'min', limit: limits.min }
  }

  if (limits.max !== undefined && day > limits.max) {
    return { bound: 'max', limit: limits.max }
  }

  return null
}

const BOUND_NAMES: ReadonlyArray<[DateBound, string]> = [
  ['min', 'minimum'],
  ['max', 'maximum'],
]

// What is wrong with the bounds a field declares, given what was read from
// them. A bound that is no day bounds nothing -- a `$ref` that nothing resolved
// is the usual way to get one -- and a minimum after the maximum lets no day
// through.
function describeDateLimits(
  name: string,
  length: Record<string, unknown>,
  limits: DateLimits
): string[] {
  const unresolved = refOf(length)
  if (unresolved !== undefined) {
    return [
      `${name}: advanced.length points at ${unresolved}, which nothing resolved, so the field has no bounds`,
    ]
  }

  const problems: string[] = []
  for (const [bound, noun] of BOUND_NAMES) {
    const value = length[bound]
    if (value == null || limits[bound] !== undefined) {
      continue
    }

    const key = `${name}: advanced.length.${bound}`
    const ref = refOf(value)
    problems.push(
      ref !== undefined
        ? `${key} points at ${ref}, which nothing resolved, so the field has no ${noun}`
        : `${key} is ${JSON.stringify(value)}, which is no yyyy-MM-dd day, so the field has no ${noun}`
    )
  }

  if (
    limits.min !== undefined &&
    limits.max !== undefined &&
    limits.min > limits.max
  ) {
    problems.push(
      `${name}: advanced.length.min is after advanced.length.max, so no day passes`
    )
  }

  return problems
}

export type DateProps = Readonly<{
  format: DateFormat
  max?: string
  min?: string
}>

/**
 * What a date component reads back from the props the form gave it: the format
 * to show a day in, and the first and the last day it may offer, as
 * `yyyy-MM-dd`.
 *
 * The form writes a date field's rules as attributes, so a native input and a
 * calendar from any library can both carry them; this is the other half, and
 * it lives here so an adapter never decodes an attribute the form chose how
 * to encode.
 */
export function readDateProps(
  props: Readonly<{ [DATA_FORMAT]?: string; [MAX]?: string; [MIN]?: string }>
): DateProps {
  return {
    format: toDateFormat(props[DATA_FORMAT]),
    max: readBound(props[MAX]),
    min: readBound(props[MIN]),
  }
}
