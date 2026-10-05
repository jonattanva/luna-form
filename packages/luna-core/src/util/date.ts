import {
  DATA_FORMAT,
  DATA_MODE,
  DATA_RESERVED,
  DATE_FORMATS,
  MAX,
  MIN,
  TIMEZONE_REGIONS,
} from './constant'
import { isObject, isString } from './is-type'
import { logger } from './logger'
import { refOf } from './prepare'
import { isValid, parse, parseISO, format as fnsFormat } from 'date-fns'
import type {
  Date as DateField,
  DateFormat,
  Input,
  Select,
  Time,
  TimeFormat,
  TimezoneGroup,
  TimezoneItem,
} from '../type'

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

export type YearLimits = Readonly<{ max?: number; min?: number }>

// Read once per declaration, as a date field's limits are, since the form reads
// them on every render. A field that declares no `advanced` is its own key.
const readYears = new WeakMap<object, YearLimits>()

/**
 * The first and the last year a year select offers, both included: whole
 * numbers, the way an `input/number` takes its bounds, or a `$ref` the host
 * resolved to one. The library keeps no clock, so "this year" is the host's to
 * say, through `context`, and a field without both bounds offers no year.
 *
 * Read once for the options the component is handed and for the schema that
 * checks a year, so the two cannot disagree. It takes an `Input` as well,
 * which is what the schema sees every field as.
 */
export function buildYearLimits(field: Input | Select): YearLimits {
  const key = field.advanced ?? field
  const known = readYears.get(key)
  if (known) {
    return known
  }

  const length = field.advanced?.length
  const limits: YearLimits = {
    max: readYear(length?.max),
    min: readYear(length?.min),
  }
  readYears.set(key, limits)

  for (const problem of describeYears(field.name, length, limits)) {
    logger.warn(problem)
  }

  return limits
}

function readYear(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value)
    ? value
    : undefined
}

const NO_YEAR = 'the field offers no year'

function describeYears(
  name: string,
  length: unknown,
  limits: YearLimits
): string[] {
  const unresolved = refOf(length)
  if (unresolved !== undefined) {
    return [
      `${name}: advanced.length points at ${unresolved}, which nothing resolved, so ${NO_YEAR}`,
    ]
  }

  const declared = isObject(length) ? length : {}
  if (declared.min == null && declared.max == null) {
    return [
      `${name}: a year select needs advanced.length.min and .max, so ${NO_YEAR}`,
    ]
  }

  const problems: string[] = []
  for (const [bound] of BOUND_NAMES) {
    if (limits[bound] !== undefined) {
      continue
    }

    const value = declared[bound]
    problems.push(
      value == null
        ? `${name}: advanced.length.${bound} is missing, so ${NO_YEAR}`
        : describeValue(
            `${name}: advanced.length.${bound}`,
            value,
            'whole year',
            NO_YEAR
          )
    )
  }

  if (
    limits.min !== undefined &&
    limits.max !== undefined &&
    limits.min > limits.max
  ) {
    problems.push(
      `${name}: advanced.length.min is after advanced.length.max, so ${NO_YEAR}`
    )
  }

  return problems
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

// Read once per declaration, since the form reads it on every render.
const readZones = new WeakMap<object, { zone?: string }>()

/**
 * The zone a timezone select suggests, as its definition gives it in
 * `advanced.suggested`: the host knows it -- a profile, a cookie, a header --
 * and passes it through `context`, so the server and the browser suggest the
 * same one. A value that is no zone `Intl` knows suggests nothing, and a
 * development build names it.
 */
export function buildSuggestedZone(field: Select): string | undefined {
  const advanced = field.advanced
  if (!isObject(advanced) || advanced.suggested == null) {
    return undefined
  }

  const known = readZones.get(advanced)
  if (known) {
    return known.zone
  }

  const value: unknown = advanced.suggested
  const zone = isString(value) && isTimeZone(value) ? value : undefined
  readZones.set(advanced, { zone })

  if (zone === undefined) {
    logger.warn(
      describeValue(
        `${field.name}: advanced.suggested`,
        value,
        'time zone',
        'no zone is suggested'
      )
    )
  }

  return zone
}

function isTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: zone })
    return true
  } catch {
    return false
  }
}

/**
 * An instant as the host gives it in `context.now`: an ISO date and time, such
 * as `2026-10-05T19:30:00-05:00`. Anything else is no instant.
 */
export function readInstant(text?: string): Date | undefined {
  if (text === undefined) {
    return undefined
  }

  const instant = parseISO(text)
  return isValid(instant) ? instant : undefined
}

// A few lists, one per zone and instant a form suggests and is rendered at.
const BUILT_ZONES = 8
const builtZones = new Map<string, TimezoneGroup[]>()

/**
 * Every zone this engine knows, grouped by region, with the one the host
 * suggests first. Labelled for the instant the host gives, `context.now`: the
 * offset a zone has, and the name it goes by, both depend on it, so without one
 * a zone goes by its city. Nothing here reads this machine's clock or zone.
 *
 * Built once while the zone and the instant hold: a timezone select builds its
 * options on every render, and there are hundreds of zones. `suggested` is a
 * zone `Intl` knows, as `buildSuggestedZone` gives it.
 */
export function getTimezones(
  suggested?: string,
  now?: string
): TimezoneGroup[] {
  return remember(
    builtZones,
    `${suggested ?? ''}|${now ?? ''}`,
    () => buildTimezones(suggested, readInstant(now)),
    BUILT_ZONES
  )
}

function buildTimezones(
  suggested: string | undefined,
  instant: Date | undefined
): TimezoneGroup[] {
  const itemOf = (tz: string): TimezoneItem => {
    const city = getTimezoneCity(tz)
    if (!instant) {
      return { value: tz, label: city }
    }

    const { offset, longName } = getTimezoneInfo(tz, instant)
    return { value: tz, label: `${city} - ${longName} (${offset})` }
  }

  const groupMap = new Map<string, TimezoneItem[]>()
  for (const tz of getSupportedTimezones()) {
    const region = getTimezoneRegion(tz)
    if (tz === suggested || region === 'Other') {
      continue
    }

    const existing = groupMap.get(region)
    if (existing) {
      existing.push(itemOf(tz))
    } else {
      groupMap.set(region, [itemOf(tz)])
    }
  }

  for (const items of groupMap.values()) {
    items.sort((a, b) => a.label.localeCompare(b.label))
  }

  const groups = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, items]) => ({ label, items }))

  return suggested
    ? [{ label: 'Suggested', items: [itemOf(suggested)] }, ...groups]
    : groups
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
  // Sorted and without repeats, the order the component is handed them in.
  reserved: readonly string[]
}>

type DateBound = 'max' | 'min'

// What keeps a day out: a bound it falls outside of, with the day it is
// bounded by, or a reservation. A range can also be kept out for its shape:
// an end missing, or a last day before the first.
export type DateIssue =
  | Readonly<{ issue: DateBound; limit: string }>
  | Readonly<{ issue: 'range' }>
  | Readonly<{ issue: 'reserved' }>

// A day the form is told about, a bound or a reservation, is a `yyyy-MM-dd`
// day: the shape a native `<input type="date">` takes for its own `min` and
// `max`. Anything else is no day, the way a browser ignores a `min` it cannot
// read, so the control and the schema never disagree about one.
function readIsoDay(value: unknown): string | undefined {
  return isString(value) && ISO_DATE.test(value)
    ? toNativeDate(value, ISO_FORMAT) || undefined
    : undefined
}

// The days of a list, sorted and once each, and where the entries that are no
// day sit, read in one pass: what names those entries does not read the list
// again to find them.
type ReadDays = Readonly<{
  days: readonly string[]
  rejected: readonly number[]
}>

function readDays(values: readonly unknown[]): ReadDays {
  const days = new Set<string>()
  const rejected: number[] = []
  values.forEach((value, index) => {
    const day = readIsoDay(value)
    if (day === undefined) {
      rejected.push(index)
    } else {
      days.add(day)
    }
  })
  return { days: [...days].sort(), rejected }
}

const NO_DAYS: ReadDays = { days: [], rejected: [] }
const NO_LIMITS: DateLimits = { reserved: NO_DAYS.days }

// What a field allows is read once per declaration. The form reads it on every
// render, and the `advanced` that declares it stays the same object for as long
// as nothing in it changes: the form copies a field -- an optional one in the
// headless schema, a read-only one while it renders -- but never its
// `advanced`. A declaration whose `$ref`s resolve again -- on every request on
// the server, with every new `context` in the browser -- is a new object, so a
// list the host has added to is read as it is now.
const readLimits = new WeakMap<object, DateLimits>()

/**
 * The days a date field allows: the first and the last, both included, and
 * the ones nobody may pick. Read once for the props its component is handed and
 * for the schema that checks it, so the two cannot disagree.
 *
 * It is the one place the limits are read, on the server and in the browser, so
 * it is where one that limits nothing is named for whoever wrote the form.
 */
export function buildDateLimits(field: DateField): DateLimits {
  const advanced = field.advanced
  if (!isObject(advanced)) {
    return NO_LIMITS
  }

  const known = readLimits.get(advanced)
  if (known) {
    return known
  }

  // Only an array is a list: a `$ref` that nothing resolved is still an object.
  const reserved = Array.isArray(advanced.reserved)
    ? readDays(advanced.reserved)
    : NO_DAYS
  const limits: DateLimits = {
    max: readIsoDay(advanced.length?.max),
    min: readIsoDay(advanced.length?.min),
    reserved: reserved.days,
  }
  readLimits.set(advanced, limits)

  const problems = describeDateLimits(
    field.name,
    advanced,
    limits,
    reserved.rejected
  )
  for (const problem of problems) {
    logger.warn(problem)
  }

  return limits
}

// What keeps a day out, if anything does. Compared as text: in `yyyy-MM-dd` the
// order of the strings is the order of the days, with no time zone in the way.
export function checkDay(day: string, limits: DateLimits): DateIssue | null {
  if (limits.min !== undefined && day < limits.min) {
    return { issue: 'min', limit: limits.min }
  }

  if (limits.max !== undefined && day > limits.max) {
    return { issue: 'max', limit: limits.max }
  }

  if (limits.reserved.includes(day)) {
    return { issue: 'reserved' }
  }

  return null
}

/**
 * A range as the form holds it, `[from, to]`, with `''` for an end nobody
 * picked: the pair a calendar emits or the two hidden inputs a form submits,
 * and one text alone as the first end. Anything else -- numbers, an object, a
 * list of more than two -- is no range, and comes back `undefined`, so it is
 * held back for what it is instead of being taken for a range nobody picked.
 */
export function toRange(value: unknown): [string, string] | undefined {
  if (isString(value)) {
    return [value, '']
  }

  return Array.isArray(value) && value.length <= 2 && value.every(isString)
    ? [value[0] ?? '', value[1] ?? '']
    : undefined
}

// What keeps a range out, if anything does. Each end answers to the rules of a
// single day; the last cannot come before the first; and the days between them
// belong to the range too, so a reserved one anywhere inside takes it, which is
// what react-day-picker calls `excludeDisabled`.
export function checkRange(
  from: string,
  to: string,
  limits: DateLimits
): DateIssue | null {
  if (to < from) {
    return { issue: 'range' }
  }

  const end = checkDay(from, limits) ?? checkDay(to, limits)
  if (end) {
    return end
  }

  return limits.reserved.some((day) => from < day && day < to)
    ? { issue: 'reserved' }
    : null
}

const BOUND_NAMES: ReadonlyArray<[DateBound, string]> = [
  ['min', 'minimum'],
  ['max', 'maximum'],
]

// What is wrong with the limits a field declares, given what was read from
// them, for whoever wrote it. A bound or a reserved day that is no day limits
// nothing -- a `$ref` that nothing resolved is the usual way to get one -- and a
// minimum after the maximum lets no day through.
function describeDateLimits(
  name: string,
  advanced: Record<string, unknown>,
  limits: DateLimits,
  rejected: readonly number[]
): string[] {
  return [
    ...describeLength(name, advanced.length, limits),
    ...describeReserved(name, advanced.reserved, rejected),
  ]
}

function describeLength(
  name: string,
  length: unknown,
  limits: DateLimits
): string[] {
  if (!isObject(length)) {
    return []
  }

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

    problems.push(
      describeValue(
        `${name}: advanced.length.${bound}`,
        value,
        'yyyy-MM-dd day',
        `the field has no ${noun}`
      )
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

function describeReserved(
  name: string,
  reserved: unknown,
  rejected: readonly number[]
): string[] {
  if (reserved == null) {
    return []
  }

  const key = `${name}: advanced.reserved`
  if (!Array.isArray(reserved)) {
    const unresolved = refOf(reserved)
    return [
      unresolved !== undefined
        ? `${key} points at ${unresolved}, which nothing resolved, so no day is reserved`
        : `${key} is ${JSON.stringify(reserved)}, which is no list of days, so no day is reserved`,
    ]
  }

  return rejected.map((index) =>
    describeValue(
      `${key}[${index}]`,
      reserved[index],
      'yyyy-MM-dd day',
      'it reserves nothing'
    )
  )
}

function describeValue(
  key: string,
  value: unknown,
  kind: string,
  outcome: string
) {
  const unresolved = refOf(value)
  return unresolved !== undefined
    ? `${key} points at ${unresolved}, which nothing resolved, so ${outcome}`
    : `${key} is ${JSON.stringify(value)}, which is no ${kind}, so ${outcome}`
}

export type DateProps = Readonly<{
  format: DateFormat
  max?: string
  min?: string
  mode: 'range' | 'single'
  reserved: readonly string[]
}>

/**
 * What a date component reads back from the props the form gave it: the format
 * to show a day in, whether it picks one day or a range, the first and the last
 * day it may offer, and the days it may not, all as `yyyy-MM-dd`.
 *
 * The form writes a date field's rules as attributes, so a native input and a
 * calendar from any library can both carry them; this is the other half, and
 * it lives here so an adapter never decodes an attribute the form chose how
 * to encode.
 */
export function readDateProps(
  props: Readonly<{
    [DATA_FORMAT]?: string
    [DATA_MODE]?: string
    [DATA_RESERVED]?: string
    [MAX]?: string
    [MIN]?: string
  }>
): DateProps {
  return {
    format: toDateFormat(props[DATA_FORMAT]),
    max: readIsoDay(props[MAX]),
    min: readIsoDay(props[MIN]),
    mode: props[DATA_MODE] === 'range' ? 'range' : 'single',
    reserved: readReservedProp(props[DATA_RESERVED]),
  }
}

// The reserved days components are handed, read once per text. A component
// renders on every keystroke with the same text and gets the same array back,
// so it can memoize on it, whatever other date fields read in between. A few
// texts are kept, about as many date fields as a form shows at once, and the
// oldest goes first, so a server rendering one list per request holds no more.
const READ_TEXTS = 32
const readTexts = new Map<string, readonly string[]>()

function readReservedProp(text = ''): readonly string[] {
  return text
    ? remember(
        readTexts,
        text,
        () => readDays(text.split(',')).days,
        READ_TEXTS
      )
    : NO_DAYS.days
}

// What a reader worked out for a key, kept while it is among the last `limit`
// keys read, the oldest dropped first: what a component reads on every render
// is worked out once while its input holds, and a server that sees a new input
// on every request holds no more than that.
function remember<T>(
  cache: Map<string, T>,
  key: string,
  compute: () => T,
  limit: number
): T {
  const known = cache.get(key)
  if (known !== undefined) {
    return known
  }

  const oldest = cache.keys().next().value
  if (cache.size >= limit && oldest !== undefined) {
    cache.delete(oldest)
  }

  const value = compute()
  cache.set(key, value)
  return value
}
