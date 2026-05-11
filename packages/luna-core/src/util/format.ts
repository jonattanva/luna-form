import {
  format as fnsFormat,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
  isValid,
  parseISO,
} from 'date-fns'
import { enUS, es } from 'date-fns/locale'
import { isString } from './is-type'
import type { Locale } from 'date-fns'

export type FormatContext = { locale?: string }
export type FormatFilter = (
  value: unknown,
  args: string[],
  ctx: FormatContext
) => string

const DATE_FNS_LOCALES: Record<string, Locale> = {
  en: enUS,
  'en-US': enUS,
  es: es,
  'es-ES': es,
  'es-MX': es,
}

const DATE_PATTERNS: Record<string, string> = {
  short: 'M/d/yy',
  medium: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  full: 'EEEE, MMMM d, yyyy',
}

const UNIT_TO_MS: Record<string, number> = {
  ms: 1,
  s: 1_000,
  min: 60_000,
  h: 3_600_000,
  d: 86_400_000,
}

function resolveLocale(locale?: string): Locale | undefined {
  if (!locale) {
    return undefined
  }
  return DATE_FNS_LOCALES[locale] ?? DATE_FNS_LOCALES[locale.split('-')[0]]
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
  locale?: Locale
): string {
  const multiplier = UNIT_TO_MS[unit]
  if (multiplier === undefined) {
    return String(num)
  }
  const ms = num * multiplier
  const duration = intervalToDuration({ start: 0, end: ms })
  return formatDuration(duration, { locale })
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

export const formatFilters: Record<string, FormatFilter> = {
  currency: (value, args, ctx) => {
    const num = toNumber(value)
    if (num === null) {
      return String(value)
    }
    const code = args[0] ?? 'USD'
    return new Intl.NumberFormat(ctx.locale, {
      style: 'currency',
      currency: code,
    }).format(num)
  },

  percent: (value, _args, ctx) => {
    const num = toNumber(value)
    if (num === null) {
      return String(value)
    }
    return new Intl.NumberFormat(ctx.locale, { style: 'percent' }).format(num)
  },

  number: (value, _args, ctx) => {
    const num = toNumber(value)
    if (num === null) {
      return String(value)
    }
    return new Intl.NumberFormat(ctx.locale).format(num)
  },

  date: (value, args, ctx) => {
    const date = toDate(value)
    if (!date) {
      return String(value)
    }
    const style = args[0] ?? 'short'
    const locale = resolveLocale(ctx.locale)
    if (style === 'relative') {
      return formatDistanceToNow(date, { addSuffix: true, locale })
    }
    const pattern = DATE_PATTERNS[style] ?? style
    return fnsFormat(date, pattern, { locale })
  },

  duration: (value, args, ctx) => {
    const locale = resolveLocale(ctx.locale)

    if (typeof value === 'number') {
      return formatNumberAsDuration(value, args[0] ?? 'ms', locale)
    }

    if (isString(value)) {
      const num = toNumber(value)
      if (num !== null) {
        return formatNumberAsDuration(num, args[0] ?? 'ms', locale)
      }
    }

    const date = toDate(value)
    if (date) {
      return formatDistanceToNow(date, { addSuffix: true, locale })
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
