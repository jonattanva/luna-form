import {
  format as fnsFormat,
  formatDuration,
  intervalToDuration,
  isValid,
  parseISO,
} from 'date-fns'
import { isString } from './is-type'
import { logger } from './logger'
import { dateFnsLocale, readInstant, remember, toLocale } from './date'

// `now` is the instant a relative date is measured from, as the host gives it
// in `context.now`: an ISO date, time and offset.
export type FormatContext = { locale?: string; now?: string }
export type FormatFilter = (
  value: unknown,
  args: string[],
  ctx: FormatContext
) => string

// The named styles, written by `Intl` in any language the runtime knows. In
// English they read as the date-fns patterns they replaced: `10/2/26`,
// `Oct 2, 2026`, `October 2, 2026`, `Friday, October 2, 2026`.
const DATE_STYLES = ['short', 'medium', 'long', 'full'] as const
type DateStyle = (typeof DATE_STYLES)[number]

const isDateStyle = (style: string): style is DateStyle =>
  DATE_STYLES.some((known) => known === style)

const UNIT_TO_MS: Record<string, number> = {
  ms: 1,
  s: 1_000,
  min: 60_000,
  h: 3_600_000,
  d: 86_400_000,
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value
  }
  if (isString(value) && value.trim() !== '') {
    const n = Number(value)
    return Number.isNaN(n) ? null : n
  }
  return null
}

function formatNumberAsDuration(
  num: number,
  unit: string,
  lang?: string
): string {
  const multiplier = UNIT_TO_MS[unit]
  if (multiplier === undefined) {
    return String(num)
  }
  const ms = num * multiplier
  const duration = intervalToDuration({ start: 0, end: ms })
  return formatDuration(duration, { locale: dateFnsLocale(lang) })
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isValid(value) ? value : null
  }
  if (isString(value)) {
    const parsed = parseISO(value)
    if (isValid(parsed)) {
      return parsed
    }
    const fallback = new Date(value)
    return isValid(fallback) ? fallback : null
  }
  if (typeof value === 'number') {
    const d = new Date(value)
    return isValid(d) ? d : null
  }
  return null
}

// The contexts whose `now` was named already: the form reads it on every
// render, and a context is the same object while nothing in it changes.
const namedNows = new WeakSet<object>()

/**
 * `context.now`, the one key of the host's `context` the library reads on its
 * own: the instant a relative date is measured from and a time zone's offset is
 * given for. The library keeps no clock, so without it there is no "now".
 *
 * Only an ISO date, time and offset is an instant. A `Date`, a timestamp or a
 * time without its offset is none, and a development build names it once for
 * the context that carries it, since nothing on the form says so otherwise.
 */
export function readNow(context?: Record<string, unknown>): string | undefined {
  const now = context?.now
  if (now == null) {
    return undefined
  }

  if (isString(now) && readInstant(now)) {
    return now
  }

  if (context && !namedNows.has(context)) {
    namedNows.add(context)
    logger.warn(
      `context.now is ${describeNow(now)}, which is no ISO date, time and offset such as "2026-10-05T19:30:00-05:00", so nothing is measured from it`
    )
  }

  return undefined
}

function describeNow(now: unknown): string {
  if (now instanceof Date) {
    return 'a Date (pass its toISOString())'
  }
  return isString(now) ? JSON.stringify(now) : `a ${typeof now}`
}

// The formatters a filter writes with, made once for each language and style:
// making one costs far more than using it, and a label with a filter is
// formatted on every render. A few are kept, as many as a page's languages and
// styles.
const FORMATS = 64
const dateFormats = new Map<string, Intl.DateTimeFormat>()
const numberFormats = new Map<string, Intl.NumberFormat>()
const relativeFormats = new Map<string, Intl.RelativeTimeFormat>()

function formatStyle(date: Date, style: DateStyle, lang?: string): string {
  const locale = toLocale(lang)
  return remember(
    dateFormats,
    `${locale}|${style}`,
    () => new Intl.DateTimeFormat(locale, { dateStyle: style }),
    FORMATS
  ).format(date)
}

function formatNumber(
  num: number,
  lang?: string,
  options: Intl.NumberFormatOptions = {}
): string {
  const locale = toLocale(lang)
  return remember(
    numberFormats,
    `${locale}|${options.style ?? ''}|${options.currency ?? ''}`,
    () => new Intl.NumberFormat(locale, options),
    FORMATS
  ).format(num)
}

// Measured from the instant the host gives, never from this machine's clock:
// the server and the browser render the same words, and on any day. Without an
// instant there is nothing to measure from, so the date is shown as it is.
function since(date: Date, ctx: FormatContext): string {
  const now = readInstant(ctx.now)
  return now
    ? relativeTime(date, now, ctx.locale)
    : formatStyle(date, 'medium', ctx.locale)
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30.4375 * DAY
const YEAR = 12 * MONTH

// Each unit, and how many of it there are before the next one is used.
const UNITS: ReadonlyArray<
  readonly [Intl.RelativeTimeFormatUnit, number, number]
> = [
  ['second', SECOND, 60],
  ['minute', MINUTE, 60],
  ['hour', HOUR, 24],
  ['day', DAY, 31],
  ['month', MONTH, 12],
]

// The distance in the largest unit that holds it, chosen after rounding, so
// nothing reads "60 minutes ago": days up to a month, months up to a year,
// and then years. No distance at all is "now". `Intl` writes it in any
// language the runtime knows.
function relativeTime(date: Date, now: Date, lang?: string): string {
  const distance = date.getTime() - now.getTime()
  const size = Math.abs(distance)

  const write = (amount: number, unit: Intl.RelativeTimeFormatUnit) => {
    const locale = toLocale(lang)
    const numeric = amount === 0 ? 'auto' : 'always'
    const format = remember(
      relativeFormats,
      `${locale}|${numeric}`,
      () => new Intl.RelativeTimeFormat(locale, { numeric }),
      FORMATS
    )
    return format.format(distance < 0 ? -amount : amount, unit)
  }

  for (const [unit, length, limit] of UNITS) {
    const amount = Math.round(size / length)
    if (amount < limit) {
      return write(amount, unit)
    }
  }

  return write(Math.round(size / YEAR), 'year')
}

export const formatFilters: Record<string, FormatFilter> = {
  currency: (value, args, ctx) => {
    const num = toNumber(value)
    if (num === null) {
      return String(value)
    }
    const code = args[0] ?? 'USD'
    return formatNumber(num, ctx.locale, { style: 'currency', currency: code })
  },

  percent: (value, _args, ctx) => {
    const num = toNumber(value)
    if (num === null) {
      return String(value)
    }
    return formatNumber(num, ctx.locale, { style: 'percent' })
  },

  number: (value, _args, ctx) => {
    const num = toNumber(value)
    if (num === null) {
      return String(value)
    }
    return formatNumber(num, ctx.locale)
  },

  date: (value, args, ctx) => {
    const date = toDate(value)
    if (!date) {
      return String(value)
    }
    const style = args[0] ?? 'short'
    if (style === 'relative') {
      return since(date, ctx)
    }
    if (isDateStyle(style)) {
      return formatStyle(date, style, ctx.locale)
    }
    // Anything else is a date-fns pattern, written as it reads.
    return fnsFormat(date, style, { locale: dateFnsLocale(ctx.locale) })
  },

  duration: (value, args, ctx) => {
    if (typeof value === 'number') {
      return formatNumberAsDuration(value, args[0] ?? 'ms', ctx.locale)
    }

    if (isString(value)) {
      const num = toNumber(value)
      if (num !== null) {
        return formatNumberAsDuration(num, args[0] ?? 'ms', ctx.locale)
      }
    }

    const date = toDate(value)
    if (date) {
      return since(date, ctx)
    }

    return String(value)
  },
}

export function applyFormatFilter(
  value: unknown,
  expression: string,
  ctx: FormatContext
): string | undefined {
  const segments = expression
    .split(':')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  if (segments.length === 0) {
    return undefined
  }

  const [name, ...args] = segments
  const filter = formatFilters[name]
  if (!filter) {
    return undefined
  }

  return filter(value, args, ctx)
}
