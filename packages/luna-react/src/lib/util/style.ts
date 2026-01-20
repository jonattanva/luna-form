import type { Style } from '@luna-form/core'

export function mergeStyle(globalStyle?: Style, localStyle?: Style) {
  return { ...globalStyle, ...localStyle }
}
