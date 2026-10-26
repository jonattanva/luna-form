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

// A form without a language speaks English, the language of its labels, on
// every machine. The machine's own language is the browser's on the client
// and the process's on the server, and the two renders would disagree.
const DEFAULT_LOCALE = 'en'

// A few tags, as many languages as an application serves; a server handed one
// per request from a header keeps no more.
const READ_LOCALES = 32
const readLocales = new Map<string, string>()

/**
 * The language a form writes its months, days, numbers, dates and dictionary
 * in: its `lang`, as a canonical tag, and English without one, for one that is
 * no tag, or for one the runtime knows no language for. It is the one reading
 * of the language, so everything the form writes agrees on it.
 */
export function toLocale(locale?: string): string {
  return locale
    ? remember(readLocales, locale, () => canonicalLocale(locale), READ_LOCALES)
    : DEFAULT_LOCALE
}

function canonicalLocale(locale: string): string {
  try {
    // A malformed tag (`es_MX`, `español`) throws a RangeError here rather than
    // deeper inside `Intl`, where it would take the whole form down. A tag that
    // is well formed but names no language the runtime has (`sp`, `zz`) would
    // be written in the machine's own language, so it is none either.
    const tag = Intl.getCanonicalLocales(locale)[0]
    return tag && Intl.DateTimeFormat.supportedLocalesOf(tag).length > 0
      ? tag
      : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

/** The base language of a form's language: `es` for `es-CO`. */
export function baseLanguage(locale?: string): string {
  return toLocale(locale).split('-')[0]
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
  // Only an object declares anything; text or a number there is no `advanced`.
  const advanced = isObject(field.advanced) ? field.advanced : undefined
  const key = advanced ?? field
  const known = readYears.get(key)
  if (known) {
    return known
  }

  const length = advanced?.length
  const limits: YearLimits = {
    max: readYear(length?.max),
    min: readYear(length?.min),
  }
  readYears.set(key, limits)

  const problems = describeBounds(field.name, length, limits, YEAR_BOUNDS)
  for (const problem of problems) {
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

const YEAR_BOUNDS: BoundRules = {
  beyond: 'after',
  disordered: NO_YEAR,
  kind: 'whole year',
  lost: NO_YEAR,
  needsBoth: true,
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

// The two formatters a zone is labelled with, made once each: making them is
// most of what a list of hundreds of zones costs, and a server labels the list
// again for every request's instant. There are as many as there are zones.
const zoneFormats = new Map<
  string,
  readonly [Intl.DateTimeFormat, Intl.DateTimeFormat]
>()

function formatsOf(tz: string) {
  const known = zoneFormats.get(tz)
  if (known) {
    return known
  }

  const made = [
    new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'longOffset' }),
    new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'long' }),
  ] as const
  zoneFormats.set(tz, made)
  return made
}

function getTimezoneInfo(
  tz: string,
  date: Date
): { offset: string; longName: string } {
  const [offsetFormat, longNameFormat] = formatsOf(tz)
  const offsetParts = offsetFormat.formatToParts(date)
  const longNameParts = longNameFormat.formatToParts(date)

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
 * same one. It is read as the name the runtime gives it, and a value that is no
 * zone suggests nothing, which a development build names.
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
  const zone = isString(value) ? canonicalZone(value) : undefined
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

// The name the runtime gives a zone, the one its list carries: `America/Bogota`
// for `america/bogota`, `America/New_York` for `US/Eastern`. A field submits
// it, so a zone written another way is suggested, and listed, once. A name
// starts with a letter: `Intl` takes an offset such as `+05:00` too, and that
// is no zone.
function canonicalZone(text: string): string | undefined {
  if (!/^[A-Za-z]/.test(text)) {
    return undefined
  }

  try {
    return new Intl.DateTimeFormat('en', { timeZone: text }).resolvedOptions()
      .timeZone
  } catch {
    return undefined
  }
}

// A date, a time and the offset that pins them to one instant.
const ISO_INSTANT =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(?:Z|([+-])(\d{2}):?(\d{2}))$/

/**
 * An instant as the host gives it in `context.now`: an ISO date, time and
 * offset, such as `2026-10-05T19:30:00-05:00` or `2026-10-06T00:30:00Z`.
 * Without its offset a time would be read in this machine's zone, which is the
 * clock the form keeps no more, so anything else is no instant.
 */
export function readInstant(text?: string): Date | undefined {
  const match = text === undefined ? null : ISO_INSTANT.exec(text)
  if (!match) {
    return undefined
  }

  // A group the text leaves out, the seconds or the offset of `Z`, is zero.
  const [year, month, day, hour, minute, , , , offsetHour, offsetMinute] = match
    .slice(1)
    .map((group) => Number(group ?? 0))
  // The seconds with their fraction, which may run past the millisecond.
  const seconds = Number(`${match[6] ?? 0}.${match[7] ?? 0}`)
  const sign = match[8] === '-' ? -1 : 1

  // ISO 8601 allows `24:00`, the end of a day, and nothing past it.
  const endOfDay = hour === 24 && minute === 0 && seconds === 0
  if (
    !toDay({ day, month, year }) ||
    (hour > 23 && !endOfDay) ||
    minute > 59 ||
    seconds >= 60 ||
    offsetMinute > 59
  ) {
    return undefined
  }

  // Set field by field: `Date.UTC` reads a year below 100 as the 1900s.
  const midnight = new Date(0)
  midnight.setUTCFullYear(year, month - 1, day)
  return new Date(
    midnight.getTime() +
      (hour * 60 + minute - sign * (offsetHour * 60 + offsetMinute)) * 60_000 +
      seconds * 1_000
  )
}

// A few lists, one per zone and instant a form suggests and is rendered at.
const BUILT_ZONES = 8
const builtZones = new Map<string, readonly TimezoneGroup[]>()

/**
 * Every zone this engine knows, grouped by region, with the one the host
 * suggests first. Labelled for the instant the host gives, `context.now`: the
 * offset a zone has, and the name it goes by, both depend on it, so without one
 * a zone goes by its city. Nothing here reads this machine's clock or zone.
 *
 * Built once while the zone and the instant hold: a timezone select builds its
 * options on every render, and there are hundreds of zones. Frozen, since every
 * form that asks shares it, on a server every request. `suggested` is a zone's
 * name as the runtime gives it, as `buildSuggestedZone` reads it. Sorted in
 * English, the language of the labels, so no machine's collation orders it.
 */
export function getTimezones(
  suggested?: string,
  now?: string
): readonly TimezoneGroup[] {
  const instant = readInstant(now)
  return remember(
    builtZones,
    `${suggested ?? ''}|${instant?.getTime() ?? ''}`,
    () => buildTimezones(suggested, instant),
    BUILT_ZONES
  )
}

function buildTimezones(
  suggested: string | undefined,
  instant: Date | undefined
): readonly TimezoneGroup[] {
  const itemOf = (tz: string): TimezoneItem => {
    const city = getTimezoneCity(tz)
    if (!instant) {
      return Object.freeze({ value: tz, label: city })
    }

    const { offset, longName } = getTimezoneInfo(tz, instant)
    return Object.freeze({
      value: tz,
      label: `${city} - ${longName} (${offset})`,
    })
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

  const groups = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
    .map(([label, items]) =>
      Object.freeze({
        label,
        items: Object.freeze(
          items.sort((a, b) => a.label.localeCompare(b.label, 'en'))
        ),
      })
    )

  return Object.freeze(
    suggested
      ? [
          Object.freeze({
            label: 'Suggested',
            items: Object.freeze([itemOf(suggested)]),
          }),
          ...groups,
        ]
      : groups
  )
}

// The one reading of a day, for every way a date leaves this module.
//
// A day arrives in one of two shapes: `yyyy-MM-dd`, which is what a calendar
// emits and what the form hands out, or the field's own `format`, which is
// what a person types and what an older host may still hold. Both are read,
// so whatever the form gave away can be given back. An impossible day, half a
// date or a year that is not four digits is no day. A `yyyy-MM-dd` is a day,
// not an instant, so no clock or zone takes part.
function readDay(value: string, format: DateFormat): Day | undefined {
  const text = value.trim()
  if (!text) {
    return undefined
  }

  if (ISO_DATE.test(text)) {
    return toDay(readParts(text, ISO_FORMAT))
  }

  // A text is read in one language at a time: `MAYO` is no English `May`
  // followed by an `O`, but it is the Spanish `mayo`.
  for (const names of Object.values(MONTHS)) {
    const day = toDay(readParts(text, format, names))
    if (day) {
      return day
    }
  }

  return undefined
}

// The formats are a closed list, so the form reads and writes them itself
// rather than shipping a date library to every page that renders a form. The
// tokens are date-fns's, which is what `format` is written in: a year, a month
// as a number or a name, a day, and a time of day on either clock.
const TOKENS = /(yyyy|MMMM|MMM|MM|M|dd|d|HH|hh|mm|ss|a)/

type Day = Readonly<{ day: number; month: number; year: number }>
type TimeOfDay = Readonly<{ hour: number; minute: number; second: number }>

type Parts = {
  day?: number
  hour?: number
  hour12?: number
  minute?: number
  month?: number
  pm?: boolean
  second?: number
  year?: number
}

type MonthNames = Readonly<{ long: string[]; short: string[] }>

// The month names the form writes, in the languages it writes them in, and
// reads back in either: a form in Spanish shows `octubre 2, 2026`, and that is
// the text a person edits. A language without names here writes English.
const MONTHS: Record<string, MonthNames> = {
  en: {
    long: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    short: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
  es: {
    long: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
    short: [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ],
  },
}

// A month name at the start of `text`, case aside: `MMMM` takes the full name,
// then the short one, `MMM` only the short one, and either falls back to the
// first letter, which names the first month it starts: `J` is January.
function readMonthName(
  text: string,
  token: string,
  names: MonthNames
): Readonly<{ length: number; month: number }> | undefined {
  const lower = text.toLowerCase()
  const widths = token === 'MMMM' ? [names.long, names.short] : [names.short]

  for (const width of [...widths, names.long.map((name) => name[0])]) {
    const month = width.findIndex((name) =>
      lower.startsWith(name.toLowerCase())
    )
    if (month !== -1) {
      return { length: width[month].length, month: month + 1 }
    }
  }
  return undefined
}

// A meridiem at the start of `text`: `AM`, `pm`, `a.m.`, or its first letter.
const MERIDIEM = /^([ap])(\.?\s?m\.?)?/i

const YEAR_DIGITS = /^\d{1,4}/
const DIGITS = /^\d{1,2}/

type NumberPart = Exclude<keyof Parts, 'pm'>

const NUMBER_TOKENS: Record<string, NumberPart> = {
  yyyy: 'year',
  MM: 'month',
  M: 'month',
  dd: 'day',
  d: 'day',
  HH: 'hour',
  hh: 'hour12',
  mm: 'minute',
  ss: 'second',
}

// What `text` says in `pattern`, read token by token and with nothing left
// over but blank space, month names in the language `names` gives. A number
// takes as many digits as its token allows -- four for a year, two for the
// rest -- and no fewer than one, so a year still being typed reads as one and
// its floor, not its width, keeps it out.
function readParts(
  text: string,
  pattern: string,
  names: MonthNames = MONTHS.en
): Parts | undefined {
  const parts: Parts = {}
  let rest = text

  for (const [index, piece] of pattern.split(TOKENS).entries()) {
    // `split` with a group alternates: text between tokens, then a token.
    if (index % 2 === 0) {
      if (!rest.startsWith(piece)) {
        return undefined
      }
      rest = rest.slice(piece.length)
      continue
    }

    if (piece === 'MMMM' || piece === 'MMM') {
      const name = readMonthName(rest, piece, names)
      if (!name) {
        return undefined
      }
      parts.month = name.month
      rest = rest.slice(name.length)
      continue
    }

    if (piece === 'a') {
      const meridiem = MERIDIEM.exec(rest)
      if (!meridiem) {
        return undefined
      }
      parts.pm = meridiem[1].toLowerCase() === 'p'
      rest = rest.slice(meridiem[0].length)
      continue
    }

    const digits = (piece === 'yyyy' ? YEAR_DIGITS : DIGITS).exec(rest)
    if (!digits) {
      return undefined
    }
    parts[NUMBER_TOKENS[piece]] = Number(digits[0])
    rest = rest.slice(digits[0].length)
  }

  return rest.trim() === '' ? parts : undefined
}

// A day that exists: a year of four digits, and a date its month has.
function toDay(parts: Parts | undefined): Day | undefined {
  if (!parts) {
    return undefined
  }

  const { day, month, year } = parts
  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    year < MIN_YEAR ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > new Date(Date.UTC(year, month, 0)).getUTCDate()
  ) {
    return undefined
  }
  return { day, month, year }
}

// A time on the clock: an hour of the day, or of either half of it with its
// meridiem, and the minutes and seconds within it. Seconds a format does not
// carry are none.
function toTimeOfDay(parts: Parts | undefined): TimeOfDay | undefined {
  if (!parts) {
    return undefined
  }

  const { hour12, minute = -1, second = 0 } = parts
  const hour =
    hour12 === undefined
      ? parts.hour
      : hour12 >= 1 && hour12 <= 12
        ? (hour12 % 12) + (parts.pm ? 12 : 0)
        : undefined

  if (
    hour === undefined ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second > 59
  ) {
    return undefined
  }
  return { hour, minute, second }
}

const pad = (value: number, length = 2) => String(value).padStart(length, '0')

// `pattern` written with what a day and a time give it, month names in `lang`.
function writeParts(
  pattern: string,
  day: Partial<Day>,
  time: Partial<TimeOfDay>,
  lang?: string
): string {
  const names = MONTHS[baseLanguage(lang)] ?? MONTHS.en
  const { day: date = 1, month = 1, year = 0 } = day
  const { hour = 0, minute = 0, second = 0 } = time

  const written: Record<string, string> = {
    yyyy: pad(year, 4),
    MMMM: names.long[month - 1],
    MMM: names.short[month - 1],
    MM: pad(month),
    M: String(month),
    dd: pad(date),
    d: String(date),
    HH: pad(hour),
    hh: pad(hour % 12 || 12),
    mm: pad(minute),
    ss: pad(second),
    a: hour < 12 ? 'AM' : 'PM',
  }

  return pattern
    .split(TOKENS)
    .map((piece, index) => (index % 2 === 0 ? piece : written[piece]))
    .join('')
}

// A day as the form holds it, `yyyy-MM-dd`, or `''` when the text is no day
// and the caller has to judge it.
export function toNativeDate(value: string, fromFormat: DateFormat): string {
  const day = value ? readDay(value, fromFormat) : undefined
  return day ? writeParts(ISO_FORMAT, day, {}) : ''
}

export function toNativeTime(value: string, fromFormat: TimeFormat): string {
  const time = value ? toTimeOfDay(readParts(value, fromFormat)) : undefined
  return time ? writeParts('HH:mm:ss', {}, time) : ''
}

export function fromNativeTime(
  native: string,
  toFormat: TimeFormat = 'HH:mm'
): string {
  if (!native) {
    return ''
  }

  const format = native.split(':').length === 3 ? 'HH:mm:ss' : 'HH:mm'
  const time = toTimeOfDay(readParts(native, format))
  return time ? writeParts(toFormat, {}, time) : ''
}

// A value as a date field shows it: the day in the field's format, or the text
// as it is when it is no day, which is what the field itself shows.
export function displayDate(
  value: string,
  format: DateFormat,
  lang?: string
): string {
  const day = readDay(value, format)
  return day ? writeParts(format, day, {}, lang) : value
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
  // A rule the field declares that cannot be read: a `$ref` the host did not
  // resolve, or a bound or a reserved day that is no day. The form cannot tell
  // which days such a field allows, so it takes none: on a server that forgot
  // its `context`, taking them all would let a booked night be booked again,
  // with nothing in production to say so.
  unreadable: boolean
}>

type DateBound = 'max' | 'min'

// What keeps a day out: a bound it falls outside of, with the day it is
// bounded by, or a reservation. A range can also be kept out for its shape:
// an end missing, or a last day before the first.
export type DateIssue =
  | Readonly<{ issue: DateBound; limit: string }>
  | Readonly<{ issue: 'range' }>
  | Readonly<{ issue: 'reserved' }>
  | Readonly<{ issue: 'unreadable' }>

// A day the form is told about, a bound or a reservation, is a `yyyy-MM-dd`
// day: the shape a native `<input type="date">` takes for its own `min` and
// `max`. Anything else is no day: the control is not handed it, and the schema,
// which cannot tell what such a rule allows, takes no day at all.
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
const NO_LIMITS: DateLimits = { reserved: NO_DAYS.days, unreadable: false }

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
  const bounds = {
    max: readIsoDay(advanced.length?.max),
    min: readIsoDay(advanced.length?.min),
  }
  const limits: DateLimits = {
    ...bounds,
    reserved: reserved.days,
    unreadable:
      isUnreadableLength(advanced.length, bounds) ||
      (advanced.reserved != null &&
        (!Array.isArray(advanced.reserved) || reserved.rejected.length > 0)),
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

// Bounds that are declared and cannot be read: the whole `length` a `$ref`
// nothing resolved, or a bound that is no value of its kind -- no day here, no
// number for `buildLengthLimits`.
export function isUnreadableLength<T>(
  length: unknown,
  read: Readonly<{ max?: T; min?: T }>
): boolean {
  if (length == null) {
    return false
  }

  if (!isObject(length) || refOf(length) !== undefined) {
    return true
  }

  return BOUNDS.some(
    (bound) => length[bound] != null && read[bound] === undefined
  )
}

// What keeps a day out, if anything does. Compared as text: in `yyyy-MM-dd` the
// order of the strings is the order of the days, with no time zone in the way.
export function checkDay(day: string, limits: DateLimits): DateIssue | null {
  if (limits.unreadable) {
    return { issue: 'unreadable' }
  }

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

const BOUNDS: readonly DateBound[] = ['min', 'max']

// What is wrong with the limits a field declares, given what was read from
// them, for whoever wrote it. A bound or a reserved day that is no day -- a
// `$ref` that nothing resolved is the usual way to get one -- or a minimum
// after the maximum lets no day through.
function describeDateLimits(
  name: string,
  advanced: Record<string, unknown>,
  limits: DateLimits,
  rejected: readonly number[]
): string[] {
  return [
    ...describeBounds(name, advanced.length, limits, DATE_BOUNDS),
    ...describeReserved(name, advanced.reserved, rejected),
  ]
}

// How a field's bounds fail it, for `describeBounds`: what a bound that is not
// a value of its `kind` is, what the field is left with when a bound is lost
// or the two are out of order, and whether it needs both to offer anything.
// `beyond` says how a minimum stands past the maximum: a day or a year comes
// after another, a number is above it.
export type BoundRules = Readonly<{
  beyond: 'above' | 'after'
  disordered: string
  kind: string
  lost: string
  needsBoth: boolean
}>

const NO_DAY = 'the field takes no day'

const DATE_BOUNDS: BoundRules = {
  beyond: 'after',
  disordered: 'no day passes',
  kind: 'yyyy-MM-dd day',
  lost: NO_DAY,
  needsBoth: false,
}

// What is wrong with the bounds a field declares in `advanced.length`, given
// what was read from them: the whole `length` a `$ref` nothing resolved, a
// bound that is no value of its kind or, where both are needed, missing, and a
// minimum past the maximum.
export function describeBounds<T extends number | string>(
  name: string,
  length: unknown,
  limits: Readonly<{ max?: T; min?: T }>,
  rules: BoundRules
): string[] {
  const unresolved = refOf(length)
  if (unresolved !== undefined) {
    return [
      `${name}: advanced.length points at ${unresolved}, which nothing resolved, so ${rules.lost}`,
    ]
  }

  const declared = isObject(length) ? length : {}
  if (rules.needsBoth && declared.min == null && declared.max == null) {
    return [
      `${name}: advanced.length.min and .max are missing, so ${rules.lost}`,
    ]
  }

  const problems: string[] = []
  for (const bound of BOUNDS) {
    const value = declared[bound]
    if (limits[bound] !== undefined || (value == null && !rules.needsBoth)) {
      continue
    }

    const key = `${name}: advanced.length.${bound}`
    problems.push(
      value == null
        ? `${key} is missing, so ${rules.lost}`
        : describeValue(key, value, rules.kind, rules.lost)
    )
  }

  if (
    limits.min !== undefined &&
    limits.max !== undefined &&
    limits.min > limits.max
  ) {
    problems.push(
      `${name}: advanced.length.min is ${rules.beyond} advanced.length.max, so ${rules.disordered}`
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
        ? `${key} points at ${unresolved}, which nothing resolved, so ${NO_DAY}`
        : `${key} is ${JSON.stringify(reserved)}, which is no list of days, so ${NO_DAY}`,
    ]
  }

  return rejected.map((index) =>
    describeValue(`${key}[${index}]`, reserved[index], 'yyyy-MM-dd day', NO_DAY)
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
  // The language to name months and days in: the form's `lang`, or English.
  lang: string
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
    lang?: string
  }>
): DateProps {
  return {
    format: toDateFormat(props[DATA_FORMAT]),
    lang: toLocale(props.lang),
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

/**
 * What a reader worked out for a key, kept while it is among the last `limit`
 * keys read, the one read longest ago dropped first: what a component reads on
 * every render is worked out once while its input holds, whatever other forms
 * read between, and a server that sees a new input on every request holds no
 * more than that.
 */
export function remember<T>(
  cache: Map<string, T>,
  key: string,
  compute: () => T,
  limit: number
): T {
  const known = cache.get(key)
  if (known !== undefined) {
    // To the back of the line: a `Map` keeps the order keys went in.
    cache.delete(key)
    cache.set(key, known)
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
