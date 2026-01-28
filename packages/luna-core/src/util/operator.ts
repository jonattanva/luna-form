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
  return Number(current) > Number(value)
}

function gte(current: unknown, value: unknown): boolean {
  return Number(current) >= Number(value)
}

function lt(current: unknown, value: unknown): boolean {
  return Number(current) < Number(value)
}

function lte(current: unknown, value: unknown): boolean {
  return Number(current) <= Number(value)
}
