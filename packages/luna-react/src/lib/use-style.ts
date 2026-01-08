import type { Orientation } from '@luna-form/core'

export type Style = {
  compact?: boolean
  orientation?: Orientation
}

export function useStyle(globalStyle?: Style, localStyle?: Style) {
  return { ...globalStyle, ...localStyle }
}
