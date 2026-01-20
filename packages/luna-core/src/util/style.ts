import type { Style } from '../type'

export function mergeStyle(globalStyle?: Style, localStyle?: Style) {
  return { ...globalStyle, ...localStyle }
}
