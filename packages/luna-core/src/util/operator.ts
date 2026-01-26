export const operators: Record<
  string,
  (current: unknown, value: unknown) => boolean
> = {
  eq,
  neq,
  in: includes,
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
