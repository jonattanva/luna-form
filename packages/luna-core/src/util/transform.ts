import { isEmpty, isString } from './is-type'
import type { Transform, Value } from '../type'

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

/**
 * Where `next` differs from `previous`: from `start` to `end` is what a change
 * typed or pasted, and the text on either side was already there.
 */
function changedSpan(previous: string, next: string) {
  const limit = Math.min(previous.length, next.length)

  let start = 0
  while (start < limit && previous[start] === next[start]) {
    start++
  }

  let kept = 0
  while (
    kept < limit - start &&
    previous[previous.length - 1 - kept] === next[next.length - 1 - kept]
  ) {
    kept++
  }

  return { start, end: next.length - kept }
}

/**
 * `applyTransform` over what a change wrote into a field, and not over the text
 * it kept: under `lowercase`, a key stored as `customerEmail` takes a letter
 * typed after it as `customerEmailx`, not `customeremailx`. With no text before
 * the change, all of `next` was written.
 */
export function applyTransformToChange(
  previous: string | undefined,
  next: Value,
  transform?: Transform | Transform[]
) {
  if (!transform || !isString(next) || !isString(previous)) {
    return applyTransform(next, transform)
  }

  const { start, end } = changedSpan(previous, next)
  const written = String(applyTransform(next.slice(start, end), transform))
  return next.slice(0, start) + written + next.slice(end)
}

/**
 * Where the caret goes once `applyTransformToChange` has rewritten `next`:
 * right after what the rewrite left of the text before `caret`.
 */
export function transformCaret(
  previous: string | undefined,
  next: string,
  caret: number,
  transform?: Transform | Transform[]
) {
  const { start, end } = changedSpan(previous ?? '', next)
  if (caret <= start) {
    return caret
  }

  if (caret >= end) {
    const rewritten = String(applyTransformToChange(previous, next, transform))
    return caret + rewritten.length - next.length
  }

  return (
    start + String(applyTransform(next.slice(start, caret), transform)).length
  )
}
