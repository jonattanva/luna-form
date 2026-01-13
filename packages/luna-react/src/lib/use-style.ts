import type { Style } from '@luna-form/core'

export function useStyle(globalStyle?: Style, localStyle?: Style) {
  return { ...globalStyle, ...localStyle }
}
