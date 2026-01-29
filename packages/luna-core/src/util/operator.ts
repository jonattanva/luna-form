export const operators: Record<
  string,
  (current: unknown, value: unknown) => boolean
> = {
  eq,
  gt,
  gte,
  in: includes,
  lt,
  lte,
  neq,
  nin,
}

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/
const DMY_DATE_REGEX =
  /^(\d{2})[/-](\d{2})[/-](\d{4})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/

function isISODateString(value: unknown): value is string {
  return typeof value === 'string' && ISO_DATE_REGEX.test(value)
}

function isDMYDateString(value: unknown): value is string {
  return typeof value === 'string' && DMY_DATE_REGEX.test(value)
}

function parseDMYDate(value: string): number {
  const match = value.match(DMY_DATE_REGEX)
  if (match) {
    const [, day, month, year, hours, minutes, seconds] = match
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours ?? 0),
      Number(minutes ?? 0),
      Number(seconds ?? 0)
    ).getTime()
  }
  return NaN
}

function toComparableNumber(value: unknown): number {
  if (isISODateString(value)) {
    return new Date(value).getTime()
  }
  if (isDMYDateString(value)) {
    return parseDMYDate(value)
  }
  return Number(value)
}

function eq(current: unknown, value: unknown): boolean {
  return current === value
}

function neq(current: unknown, value: unknown): boolean {
  return current !== value
}

function includes(current: unknown, value: unknown): boolean {
  return Array.isArray(value) && value.includes(String(current))
}

function nin(current: unknown, value: unknown): boolean {
  return Array.isArray(value) && !value.includes(String(current))
}

function gt(current: unknown, value: unknown): boolean {
  return toComparableNumber(current) > toComparableNumber(value)
}

function gte(current: unknown, value: unknown): boolean {
  return toComparableNumber(current) >= toComparableNumber(value)
}

function lt(current: unknown, value: unknown): boolean {
  return toComparableNumber(current) < toComparableNumber(value)
}

function lte(current: unknown, value: unknown): boolean {
  return toComparableNumber(current) <= toComparableNumber(value)
}
