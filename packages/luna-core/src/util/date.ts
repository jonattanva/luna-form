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
import { enUS, es } from 'date-fns/locale'
import type { Locale } from 'date-fns'
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
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})$/

/**
 * An instant as the host gives it in `context.now`: an ISO date, time and
 * offset, such as `2026-10-05T19:30:00-05:00` or `2026-10-06T00:30:00Z`.
 * Without its offset a time would be read in this machine's zone, which is the
 * clock the form keeps no more, so anything else is no instant.
 */
export function readInstant(text?: string): Date | undefined {
  if (text === undefined || !ISO_INSTANT.test(text)) {
    return undefined
  }

  const instant = parseISO(text)
  return isValid(instant) ? instant : undefined
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
// date or a year that is not four digits is no day. Read in local time: a
// `yyyy-MM-dd` is a day, not an instant.
function readDay(value: string, format: DateFormat): Date | undefined {
  const text = value.trim()
  if (!text) {
    return undefined
  }

  if (ISO_DATE.test(text)) {
    return parseDay(text, ISO_FORMAT)
  }

  // In either language the form writes month and day names in: a form in
  // Spanish shows `octubre 2, 2026`, and that is the text a person edits.
  for (const locale of Object.values(DATE_FNS_LOCALES)) {
    const day = parseDay(text, format, locale)
    if (day) {
      return day
    }
  }

  return undefined
}

function parseDay(
  text: string,
  pattern: string,
  locale?: Locale
): Date | undefined {
  try {
    const day = parse(text, pattern, REF, { locale })
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
export function displayDate(
  value: string,
  format: DateFormat,
  lang?: string
): string {
  const day = readDay(value, format)
  return day ? fnsFormat(day, format, { locale: dateFnsLocale(lang) }) : value
}

// The languages date-fns writes month and day names in here. A pattern is
// date-fns's to write, so a language it is not given names them in English.
const DATE_FNS_LOCALES: Record<string, Locale> = { en: enUS, es }

/**
 * The date-fns locale for a language, by its base: `es-CO` writes Spanish
 * names. English for a language the library does not ship.
 */
export function dateFnsLocale(lang?: string): Locale | undefined {
  return DATE_FNS_LOCALES[baseLanguage(lang)]
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
export function isUnreadableLength(
  length: unknown,
  read: Readonly<{ max?: unknown; min?: unknown }>
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
export type BoundRules = Readonly<{
  disordered: string
  kind: string
  lost: string
  needsBoth: boolean
}>

const NO_DAY = 'the field takes no day'

const DATE_BOUNDS: BoundRules = {
  disordered: 'no day passes',
  kind: 'yyyy-MM-dd day',
  lost: NO_DAY,
  needsBoth: false,
}

// What is wrong with the bounds a field declares in `advanced.length`, given
// what was read from them: the whole `length` a `$ref` nothing resolved, a
// bound that is no value of its kind or, where both are needed, missing, and a
// minimum after the maximum.
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
      `${name}: advanced.length.min is after advanced.length.max, so ${rules.disordered}`
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
