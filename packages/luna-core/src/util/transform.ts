import { isEmpty, isString } from './is-type'
import type { Transform } from '../type'

const transformers = {
  uppercase: (value: string) => value.toUpperCase(),
  lowercase: (value: string) => value.toLowerCase(),
  'remove-space': (value: string) => value.replace(/\s+/g, ''),
  'remove-accent': (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
}

export function applyTransform(
  value: unknown,
  transform?: Transform | Transform[]
) {
  if (!transform) {
    return value
  }

  if (!isString(value) || isEmpty(value)) {
    return value
  }

  const pipeline = Array.isArray(transform) ? transform : [transform]

  return pipeline.reduce((previous, current) => {
    const fn = transformers[current]
    if (fn) {
      return fn(previous)
    }
    return previous
  }, value)
}
